import { useMemo } from "react";
import { useModal } from "@/hooks/useModal";
import {
  canCastSpells,
  getSpellLevel,
  getSpellSlots,
  getCharacterSpellSystemType,
} from "@/utils/characterHelpers";
import type { Character, Spell, Cantrip } from "@/types/character";
import { SectionWrapper } from "@/components/ui/layout";
import { Accordion } from "@/components/ui/layout";
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
  uniqueKey: string; // Unique identifier for accordion grouping
  [key: string]: unknown;
}

interface CantripWithLevel extends Cantrip {
  spellLevel: 0; // Cantrips are always level 0
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

  let abilityBonus: string;
  if (hasDivineClasses && hasArcaneClasses) {
    abilityBonus = "Intelligence/Wisdom Bonus";
  } else if (hasDivineClasses) {
    abilityBonus = "Wisdom Bonus";
  } else {
    abilityBonus = "Intelligence Bonus";
  }

  return {
    hasDivineClasses,
    hasArcaneClasses,
    spellType,
    spellTypeLower,
    abilityBonus,
  };
}

function getCharacterCantrips(character: Character): CantripWithLevel[] {
  // Return only the cantrips that the character knows
  return (character.cantrips || []).map((cantrip, index) => ({
    ...cantrip,
    spellLevel: 0 as const,
    uniqueKey: `cantrip-${cantrip.name
      .toLowerCase()
      .replace(/\s+/g, "-")}-${index}`,
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
  const {
    isOpen: showCantripModal,
    open: openCantripModal,
    close: closeCantripModal,
  } = useModal();

  const {
    isOpen: showAddSpellModal,
    open: openAddSpellModal,
    close: closeAddSpellModal,
  } = useModal();
  const { knownSpells, cantrips, spellSlots } = useMemo(() => {
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
          uniqueKey: `${spell.name
            .toLowerCase()
            .replace(/\s+/g, "-")}-${index}`,
        });
      }
    });

    // Get the character's known cantrips
    const characterCantrips = getCharacterCantrips(character);

    // Separate spells and cantrips
    const spells = allSpells.filter((spell) => spell.spellLevel > 0);

    // Calculate spell slots
    const characterSpellSlots = getSpellSlots(character, allClasses);

    return {
      knownSpells: spells,
      cantrips: characterCantrips,
      spellSlots: characterSpellSlots,
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

  const renderSpell = (spell: DisplayableSpell) => (
    <SpellDetails spell={spell} />
  );

  // Don't render if character can't cast spells
  if (!canCastSpells(character, allClasses)) {
    return null;
  }

  const hasAnySpells = knownSpells.length > 0 || cantrips.length > 0;

  return (
    <SectionWrapper title="Spells & Cantrips" size={size} className={className}>
      <div className="p-6">
        {hasAnySpells ? (
          <div className="space-y-6">
            {/* Spell Slots */}
            {Object.keys(spellSlots).length > 0 && (
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
                          className="group relative flex items-center gap-2 bg-gradient-to-br from-purple-800/20 to-purple-900/40 border border-purple-700/50 rounded-lg px-3 py-2 shadow-sm hover:shadow-purple-500/10 hover:border-purple-600/60 transition-all duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-6 h-6 bg-purple-600/30 border border-purple-500/50 rounded-full">
                              <Typography
                                variant="caption"
                                className="text-purple-200 text-xs font-bold leading-none"
                              >
                                {level}
                              </Typography>
                            </div>
                            <div className="flex items-center justify-center min-w-[28px] h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-md shadow-sm">
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
                {isOwner &&
                  onCharacterChange &&
                  getCharacterSpellSystemType(character) === "magic-user" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={openAddSpellModal}
                    >
                      <Icon name="plus" size="sm" />
                      Add Spell
                    </Button>
                  )}
              </div>

              {/* Spell Usage Explainer for Magic-User types */}
              {getCharacterSpellSystemType(character) === "magic-user" && (
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
                    {isOwner &&
                      getCharacterSpellSystemType(character) === "magic-user" &&
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
                  {getSpellSystemInfo(character).spellType}
                  {cantrips.length > 0 && (
                    <span
                      className="text-sm font-normal text-zinc-400"
                      aria-label={`${cantrips.length} known`}
                    >
                      ({cantrips.length})
                    </span>
                  )}
                </Typography>

                {isOwner && onCharacterChange && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={openCantripModal}
                  >
                    <Icon name="edit" size="sm" />
                    Edit {getSpellSystemInfo(character).spellType}
                  </Button>
                )}
              </div>

              <Typography
                variant="caption"
                className="text-zinc-500 text-xs mb-4"
              >
                Daily Uses: Level + {getSpellSystemInfo(character).abilityBonus}
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
                    No {getSpellSystemInfo(character).spellTypeLower} known yet.
                    {isOwner &&
                      ` Click 'Edit ${
                        getSpellSystemInfo(character).spellType
                      }' to add some.`}
                  </Typography>
                </Card>
              )}
            </section>
          </div>
        ) : (
          <div className="status-message" role="status" aria-live="polite">
            <div className="text-zinc-400 space-y-2">
              <Typography variant="body" className="text-lg">
                No spells known
              </Typography>
              <Typography variant="caption" className="text-sm">
                This character doesn't know any spells yet.
              </Typography>
            </div>
          </div>
        )}
      </div>

      {/* Cantrip Edit Modal */}
      {isOwner && onCharacterChange && (
        <Modal
          isOpen={showCantripModal}
          onClose={closeCantripModal}
          title={`Edit ${getSpellSystemInfo(character).spellType}`}
          size="lg"
        >
          <CantripSelector
            character={character}
            onCantripChange={(cantrips) => {
              onCharacterChange({
                ...character,
                cantrips,
              });
            }}
            mode="edit"
            title="Known Cantrips"
          />

          <div className="flex justify-end pt-4 mt-6 border-t border-zinc-700">
            <Button variant="primary" onClick={closeCantripModal}>
              Done
            </Button>
          </div>
        </Modal>
      )}

      {/* Magic-User Add Spell Modal */}
      {isOwner &&
        onCharacterChange &&
        getCharacterSpellSystemType(character) === "magic-user" && (
          <MUAddSpellModal
            isOpen={showAddSpellModal}
            onClose={closeAddSpellModal}
            character={character}
            onSpellAdd={(newSpell) => {
              const updatedSpells = [...(character.spells || []), newSpell];
              onCharacterChange({
                ...character,
                spells: updatedSpells,
              });
            }}
          />
        )}
    </SectionWrapper>
  );
}
