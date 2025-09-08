import { useMemo } from "react";
import { useModal } from "@/hooks/useModal";
import {
  canCastSpells,
  getSpellLevel,
  getSpellSlots,
  getCharacterSpellSystemType,
} from "@/utils/characterHelpers";
import type { Character, Spell, Cantrip } from "@/types/character";
import { SectionWrapper, Accordion } from "@/components/ui/layout";
import { Card, Typography } from "@/components/ui/design-system";
import { Button } from "@/components/ui/inputs";
import { Icon } from "@/components/ui";
import { SkeletonList } from "@/components/ui/feedback";
import { Modal } from "@/components/modals";
import { CantripSelector, SpellDetails } from "@/components/character/shared";
import { allClasses } from "@/data/classes";
import MUAddSpellModal from "@/components/modals/character/MUAddSpellModal";

interface SpellsProps {
  character?: Character;
  onCharacterChange?: (character: Character) => void;
  isOwner?: boolean;
  loading?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface SpellWithLevel extends Spell {
  spellLevel: number;
  uniqueKey: string;
  [key: string]: unknown;
}

interface CantripWithLevel extends Cantrip {
  spellLevel: 0;
  uniqueKey: string;
  [key: string]: unknown;
}

type DisplayableSpell = SpellWithLevel | CantripWithLevel;

const READ_MAGIC_SPELL: Spell = {
  name: "Read Magic",
  range: "0 (personal)",
  level: {
    spellcrafter: 1,
    paladin: null,
    cleric: null,
    "magic-user": 1,
    druid: null,
    illusionist: 1,
    necromancer: 1,
  },
  duration: "2 turns",
  description:
    "This spell allows the caster to read magical inscriptions on objects (books, scrolls, weapons, etc.) which would otherwise be unintelligible. Reading a scroll of magic spells in this fashion does not invoke its magic, but allows the caster to see what spell it contains and (if the caster is able to cast spells of the level required) to cast it at a later time. The GM will determine what can be read and what cannot.",
};

function hasReadMagicAbility(character: Character): boolean {
  return character.class.some((classId) => {
    const classData = allClasses.find((c) => c.id === classId);
    if (!classData?.specialAbilities) return false;

    return classData.specialAbilities.some(
      (ability) => ability.name === "Read Magic"
    );
  });
}

function getSpellSystemInfo(character: Character) {
  const hasDivineClasses = character.class.some((classId) =>
    ["cleric", "druid"].includes(classId)
  );
  const hasArcaneClasses = character.class.some((classId) =>
    ["magic-user", "illusionist", "necromancer", "spellcrafter"].includes(
      classId
    )
  );

  const spellType =
    hasDivineClasses && !hasArcaneClasses ? "Orisons" : "Cantrips";
  const spellTypeLower = spellType.toLowerCase();

  const abilityBonus = hasDivineClasses && hasArcaneClasses
    ? "Intelligence/Wisdom Bonus"
    : hasDivineClasses
    ? "Wisdom Bonus"
    : "Intelligence Bonus";

  return {
    hasDivineClasses,
    hasArcaneClasses,
    spellType,
    spellTypeLower,
    abilityBonus,
  };
}

function getCharacterCantrips(character: Character): CantripWithLevel[] {
  return (character.cantrips || []).map((cantrip, index) => ({
    ...cantrip,
    spellLevel: 0 as const,
    uniqueKey: `cantrip-${cantrip.name.toLowerCase().replace(/\s+/g, "-")}-${index}`,
  }));
}

export default function Spells({
  character,
  onCharacterChange,
  isOwner = false,
  loading = false,
  className = "",
  size = "md",
}: SpellsProps) {
  const cantripModal = useModal();
  const addSpellModal = useModal();

  const { knownSpells, cantrips, spellSlots, spellSystemInfo, canCast } = useMemo(() => {
    if (!character || !canCastSpells(character, allClasses)) {
      return { knownSpells: [], cantrips: [], spellSlots: {} };
    }

    const characterSpells = character.spells || [];
    const hasReadMagic = hasReadMagicAbility(character);

    const allSpells: SpellWithLevel[] = [];

    // Add Read Magic if the character's class has it as a special ability
    if (hasReadMagic && !characterSpells.some((s) => s.name === "Read Magic")) {
      const readMagicLevel = getSpellLevel(READ_MAGIC_SPELL, character.class);
      if (readMagicLevel > 0) {
        allSpells.push({
          ...READ_MAGIC_SPELL,
          spellLevel: readMagicLevel,
          uniqueKey: `read-magic-auto`,
        });
      }
    }

    // Add character's known spells
    characterSpells.forEach((spell, index) => {
      const spellLevel = getSpellLevel(spell, character.class);
      if (spellLevel > 0) {
        allSpells.push({
          ...spell,
          spellLevel,
          uniqueKey: `${spell.name.toLowerCase().replace(/\s+/g, "-")}-${index}`,
        });
      }
    });

    const characterCantrips = getCharacterCantrips(character);
    const spells = allSpells.filter((spell) => spell.spellLevel > 0);
    const characterSpellSlots = getSpellSlots(character, allClasses);

    return {
      knownSpells: spells,
      cantrips: characterCantrips,
      spellSlots: characterSpellSlots,
      spellSystemInfo: getSpellSystemInfo(character),
      canCast: canCastSpells(character, allClasses),
    };
  }, [character]);

  // Show skeleton while loading
  if (loading || !character) {
    return (
      <SectionWrapper title="Spells" size={size} className={className}>
        <SkeletonList items={4} showAvatar={false} label="Loading spells..." />
      </SectionWrapper>
    );
  }

  // Don't render if character can't cast spells
  if (!canCast) {
    return null;
  }

  // Computed values
  const hasAnySpells = knownSpells.length > 0 || cantrips.length > 0;
  const hasSpellSlots = Object.keys(spellSlots).length > 0;
  const isMagicUser = getCharacterSpellSystemType(character) === "magic-user";
  const canEdit = isOwner && onCharacterChange;

  const renderSpell = (spell: DisplayableSpell) => (
    <SpellDetails spell={spell} />
  );

  return (
    <SectionWrapper title="Spells & Cantrips" size={size} className={className}>
      <div className="p-6">
        {hasAnySpells ? (
          <div className="space-y-6">
            {/* Spell Slots */}
            {hasSpellSlots && (
              <section aria-labelledby="spell-slots-heading">
                <Typography
                  variant="sectionHeading"
                  id="spell-slots-heading"
                  className="text-zinc-100 flex items-center gap-2 mb-3"
                  as="h3"
                >
                  <span
                    className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"
                    aria-hidden="true"
                  />
                  Spell Slots per Day
                </Typography>
                <Card
                  variant="nested"
                  className="p-4 mb-6 bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border-purple-800/30"
                >
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(spellSlots)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([level, slots]) => (
                        <div
                          key={level}
                          className="group relative flex items-center gap-2 rounded-lg px-3 py-2 bg-gradient-to-br from-purple-800/20 to-purple-900/40 border border-purple-700/50 shadow-sm transition-all duration-200 hover:shadow-purple-500/10 hover:border-purple-600/60"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/50">
                              <Typography
                                variant="caption"
                                className="text-purple-200 text-xs font-bold leading-none"
                              >
                                {level}
                              </Typography>
                            </div>
                            <div className="flex items-center justify-center min-w-[28px] h-6 rounded-md shadow-sm bg-gradient-to-br from-amber-500 to-orange-500">
                              <Typography
                                variant="caption"
                                className="text-zinc-900 text-xs font-bold leading-none"
                              >
                                {slots}
                              </Typography>
                            </div>
                          </div>
                          {/* Subtle glow effect on hover */}
                          <div className="absolute inset-0 rounded-lg bg-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                      ))}
                  </div>
                </Card>
              </section>
            )}

            {/* Known Spells */}
            <section aria-labelledby="known-spells-heading">
              <div className="flex items-baseline justify-between mb-4">
                <Typography
                  variant="sectionHeading"
                  id="known-spells-heading"
                  className="text-zinc-100 flex items-center gap-2"
                  as="h3"
                >
                  <span
                    className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"
                    aria-hidden="true"
                  />
                  Spells
                  {knownSpells.length > 0 && (
                    <span
                      className="text-sm font-normal text-zinc-400"
                      aria-label={`${knownSpells.length} spells known`}
                    >
                      ({knownSpells.length})
                    </span>
                  )}
                </Typography>

                {/* Add Spell button for Magic-User types */}
                {canEdit && isMagicUser && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={addSpellModal.open}
                  >
                    <Icon name="plus" size="sm" />
                    Add Spell
                  </Button>
                )}
              </div>

              {/* Spell Usage Explainer for Magic-User types */}
              {isMagicUser && (
                <Typography
                  variant="caption"
                  className="text-zinc-500 text-xs mb-4"
                >
                  Daily Usage: Limited by spell slots shown above
                </Typography>
              )}

              {knownSpells.length > 0 ? (
                <Accordion
                  items={knownSpells}
                  sortBy="name"
                  labelProperty="name"
                  showSearch={false}
                  renderItem={renderSpell}
                  className="mb-6"
                  showCounts={false}
                />
              ) : (
                <Card variant="standard" className="p-4 mb-6">
                  <Typography
                    variant="body"
                    className="text-zinc-400 text-center"
                  >
                    No spells known yet.
                    {canEdit && isMagicUser &&
                      " Click 'Add Spell' to learn your first spell."}
                  </Typography>
                </Card>
              )}
            </section>

            {/* Cantrips/Orisons */}
            <section aria-labelledby="cantrips-heading">
              <div className="flex items-baseline justify-between mb-4">
                <Typography
                  variant="sectionHeading"
                  id="cantrips-heading"
                  className="text-zinc-100 flex items-center gap-2"
                  as="h3"
                >
                  <span
                    className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"
                    aria-hidden="true"
                  />
                  {spellSystemInfo.spellType}
                  {cantrips.length > 0 && (
                    <span
                      className="text-sm font-normal text-zinc-400"
                      aria-label={`${cantrips.length} known`}
                    >
                      ({cantrips.length})
                    </span>
                  )}
                </Typography>

                {canEdit && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={cantripModal.open}
                  >
                    <Icon name="edit" size="sm" />
                    Edit {spellSystemInfo.spellType}
                  </Button>
                )}
              </div>

              <Typography
                variant="caption"
                className="text-zinc-500 text-xs mb-4"
              >
                Daily Uses: Level + {spellSystemInfo.abilityBonus}
                • No preparation required
              </Typography>

              {cantrips.length > 0 ? (
                <Accordion
                  items={cantrips}
                  sortBy="name"
                  labelProperty="name"
                  showSearch={false}
                  renderItem={renderSpell}
                  showCounts={false}
                />
              ) : (
                <Card variant="standard" className="p-4">
                  <Typography
                    variant="body"
                    className="text-zinc-400 text-center"
                  >
                    No {spellSystemInfo.spellTypeLower} known yet.
                    {canEdit &&
                      ` Click 'Edit ${spellSystemInfo.spellType}' to add some.`}
                  </Typography>
                </Card>
              )}
            </section>
          </div>
        ) : (
          <div className="status-message text-zinc-400 space-y-2" role="status" aria-live="polite">
            <Typography variant="body" className="text-lg">
              No spells known
            </Typography>
            <Typography variant="caption" className="text-sm">
              This character doesn't know any spells yet.
            </Typography>
          </div>
        )}
      </div>

      {/* Cantrip Edit Modal */}
      {canEdit && (
        <Modal
          isOpen={cantripModal.isOpen}
          onClose={cantripModal.close}
          title={`Edit ${spellSystemInfo.spellType}`}
          size="lg"
        >
          <CantripSelector
            character={character}
            onCantripChange={(cantrips) => {
              onCharacterChange!({
                ...character,
                cantrips,
              });
            }}
            mode="edit"
            title="Known Cantrips"
          />

          <div className="flex justify-end pt-4 mt-6 border-t border-zinc-700">
            <Button variant="primary" onClick={cantripModal.close}>
              Done
            </Button>
          </div>
        </Modal>
      )}

      {/* Magic-User Add Spell Modal */}
      {canEdit && isMagicUser && (
        <MUAddSpellModal
          isOpen={addSpellModal.isOpen}
          onClose={addSpellModal.close}
          character={character}
          onSpellAdd={(newSpell) => {
            const updatedSpells = [...(character.spells || []), newSpell];
            onCharacterChange!({
              ...character,
              spells: updatedSpells,
            });
          }}
        />
      )}
    </SectionWrapper>
  );
}
