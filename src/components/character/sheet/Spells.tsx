import { useMemo, useState, useEffect } from "react";
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
import { Button, Select } from "@/components/ui/inputs";
import type { SelectOption } from "@/components/ui/inputs/Select";
import { Icon } from "@/components/ui";
import { SkeletonList } from "@/components/ui/feedback";
import { Modal } from "@/components/modals";
import { CantripSelector, SpellDetails } from "@/components/character/shared";
import { allClasses } from "@/data/classes";
import { loadSpellsForClass } from "@/services/dataLoader";
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

  const abilityBonus =
    hasDivineClasses && hasArcaneClasses
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
  const cantripModal = useModal();
  const addSpellModal = useModal();

  // State for available spells for clerics (loaded dynamically)
  const [availableSpells, setAvailableSpells] = useState<
    Record<number, Spell[]>
  >({});
  const [loadingSpells, setLoadingSpells] = useState(false);

  const {
    knownSpells,
    cantrips,
    spellSlots,
    spellSystemInfo,
    canCast,
    spellSystemType,
  } = useMemo(() => {
    if (!character || !canCastSpells(character, allClasses)) {
      return {
        knownSpells: [],
        cantrips: [],
        spellSlots: {},
        spellSystemType: "none",
      };
    }

    const characterSpells = character.spells || [];
    const hasReadMagic = hasReadMagicAbility(character);
    const systemType = getCharacterSpellSystemType(character);

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

    // Add character's spells based on spell system type
    characterSpells.forEach((spell, index) => {
      const spellLevel = getSpellLevel(spell, character.class);
      if (spellLevel > 0) {
        // For magic-user types, show spells without preparation metadata
        // For cleric types, this will be handled separately in the prepared spells section
        if (systemType === "magic-user" && !spell.preparation) {
          allSpells.push({
            ...spell,
            spellLevel,
            uniqueKey: `${spell.name
              .toLowerCase()
              .replace(/\s+/g, "-")}-${index}`,
          });
        }
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
      spellSystemType: systemType,
    };
  }, [character]);

  // Load available spells for cleric-type characters
  useEffect(() => {
    if (
      !character ||
      spellSystemType !== "cleric" ||
      !Object.keys(spellSlots).length
    ) {
      return;
    }

    const loadSpellsForSlots = async () => {
      setLoadingSpells(true);
      try {
        const spellsByLevel: Record<number, Spell[]> = {};
        const clericClassId = character.class.find((classId) =>
          ["cleric", "druid", "paladin"].includes(classId)
        );

        if (clericClassId) {
          // Load spells for each spell level the character has slots for
          for (const levelStr of Object.keys(spellSlots)) {
            const level = parseInt(levelStr);
            const spellsForLevel = await loadSpellsForClass(
              clericClassId,
              level
            );
            spellsByLevel[level] = spellsForLevel;
          }
        }

        setAvailableSpells(spellsByLevel);
      } catch (error) {
        console.error("Error loading spells for cleric:", error);
      } finally {
        setLoadingSpells(false);
      }
    };

    loadSpellsForSlots();
  }, [character, spellSystemType, spellSlots]);

  // Get prepared spells from character spells array (for cleric types)
  const preparedSpells = useMemo(() => {
    if (!character?.spells || spellSystemType !== "cleric") {
      return [];
    }

    return character.spells.filter((spell) => spell.preparation);
  }, [character?.spells, spellSystemType]);

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

  // Helper functions for cleric spell preparation
  const handleSpellPreparation = (
    slotLevel: number,
    slotIndex: number,
    spellName: string
  ) => {
    if (!character || !onCharacterChange) return;

    const selectedSpell = availableSpells[slotLevel]?.find(
      (spell) => spell.name === spellName
    );
    if (!selectedSpell) return;

    const currentSpells = character.spells || [];

    // Remove any existing spell prepared in this slot
    const filteredSpells = currentSpells.filter(
      (spell) =>
        !(
          spell.preparation?.slotLevel === slotLevel &&
          spell.preparation?.slotIndex === slotIndex
        )
    );

    // Add the new prepared spell
    const newPreparedSpell: Spell = {
      ...selectedSpell,
      preparation: {
        slotLevel,
        slotIndex,
      },
    };

    onCharacterChange({
      ...character,
      spells: [...filteredSpells, newPreparedSpell],
    });
  };

  const clearSpellPreparation = (slotLevel: number, slotIndex: number) => {
    if (!character || !onCharacterChange) return;

    const currentSpells = character.spells || [];
    const filteredSpells = currentSpells.filter(
      (spell) =>
        !(
          spell.preparation?.slotLevel === slotLevel &&
          spell.preparation?.slotIndex === slotIndex
        )
    );

    onCharacterChange({
      ...character,
      spells: filteredSpells,
    });
  };

  const getPreparedSpellForSlot = (
    slotLevel: number,
    slotIndex: number
  ): Spell | null => {
    return (
      preparedSpells.find(
        (spell) =>
          spell.preparation?.slotLevel === slotLevel &&
          spell.preparation?.slotIndex === slotIndex
      ) || null
    );
  };

  // Computed values
  const showCantrips = character.settings?.showCantrips !== false; // Default to true if not set
  const hasSpellSlots = Object.keys(spellSlots).length > 0;
  const hasAnySpells =
    knownSpells.length > 0 ||
    (showCantrips && cantrips.length > 0) ||
    preparedSpells.length > 0 ||
    hasSpellSlots;
  const isMagicUser = spellSystemType === "magic-user";
  const isClericType = spellSystemType === "cleric";
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

            {/* Known Spells (Magic-User types) */}
            {isMagicUser && (
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
                    Known Spells
                    {knownSpells.length > 0 && (
                      <span
                        className="text-sm font-normal text-zinc-400"
                        aria-label={`${knownSpells.length} spells known`}
                      >
                        ({knownSpells.length})
                      </span>
                    )}
                  </Typography>

                  {canEdit && (
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

                <Typography
                  variant="caption"
                  className="text-zinc-500 text-xs mb-4"
                >
                  Daily Usage: Limited by spell slots shown above
                </Typography>

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
                      {canEdit &&
                        " Click 'Add Spell' to learn your first spell."}
                    </Typography>
                  </Card>
                )}
              </section>
            )}

            {/* Prepared Spells (Cleric types) */}
            {isClericType && hasSpellSlots && (
              <section aria-labelledby="prepared-spells-heading">
                <div className="flex items-baseline justify-between mb-4">
                  <Typography
                    variant="sectionHeading"
                    id="prepared-spells-heading"
                    className="text-zinc-100 flex items-center gap-2 !mb-0"
                    as="h3"
                  >
                    <span
                      className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"
                      aria-hidden="true"
                    />
                    Daily Spell Preparation
                    {preparedSpells.length > 0 && (
                      <span
                        className="text-sm font-normal text-zinc-400"
                        aria-label={`${preparedSpells.length} spells prepared`}
                      >
                        ({preparedSpells.length})
                      </span>
                    )}
                  </Typography>
                </div>

                <Typography
                  variant="caption"
                  className="text-zinc-500 text-xs block mt-2 mb-4"
                >
                  You can prepare any spell of a level for which you have slots.
                  Choose wisely - these are your spells for the day.
                </Typography>

                {loadingSpells ? (
                  <SkeletonList
                    items={3}
                    showAvatar={false}
                    label="Loading available spells..."
                  />
                ) : (
                  <div className="space-y-6">
                    {Object.entries(spellSlots)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([levelStr, slotCount]) => {
                        const level = parseInt(levelStr);
                        const availableForLevel = availableSpells[level] || [];

                        return (
                          <div key={level} className="space-y-3">
                            <Typography
                              variant="subHeading"
                              className="text-purple-300 flex items-center gap-2"
                            >
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/50">
                                <Typography
                                  variant="caption"
                                  className="text-purple-200 text-xs font-bold leading-none"
                                >
                                  {level}
                                </Typography>
                              </div>
                              Level {level} Spells ({slotCount} slot
                              {slotCount !== 1 ? "s" : ""})
                            </Typography>

                            <div className="grid gap-3">
                              {Array.from({ length: slotCount }, (_, index) => {
                                const preparedSpell = getPreparedSpellForSlot(
                                  level,
                                  index
                                );
                                const selectOptions: SelectOption[] = [
                                  { value: "", label: "Select a spell" },
                                  ...availableForLevel.map((spell) => ({
                                    value: spell.name,
                                    label: spell.name,
                                  })),
                                ];

                                return (
                                  <div
                                    key={`${level}-${index}`}
                                    className="space-y-2"
                                  >
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
                                      <div className="lg:col-span-2">
                                        {canEdit ? (
                                          <Select
                                            label={`Slot ${index + 1}`}
                                            options={selectOptions}
                                            value={preparedSpell?.name || ""}
                                            placeholder="Select a spell"
                                            onValueChange={(spellName) => {
                                              if (spellName) {
                                                handleSpellPreparation(
                                                  level,
                                                  index,
                                                  spellName
                                                );
                                              } else {
                                                clearSpellPreparation(
                                                  level,
                                                  index
                                                );
                                              }
                                            }}
                                            disabled={
                                              availableForLevel.length === 0
                                            }
                                          />
                                        ) : (
                                          <div>
                                            <Typography
                                              variant="caption"
                                              className="block text-zinc-400 mb-1"
                                            >
                                              Slot {index + 1}
                                            </Typography>
                                            <div className="px-4 py-3 bg-zinc-800 border-2 border-zinc-600 rounded-lg">
                                              <Typography
                                                variant="body"
                                                className="text-zinc-100"
                                              >
                                                {preparedSpell?.name ||
                                                  "No spell prepared"}
                                              </Typography>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {canEdit && preparedSpell && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            clearSpellPreparation(level, index)
                                          }
                                          className="self-end"
                                        >
                                          <Icon name="close" size="sm" />
                                          Clear
                                        </Button>
                                      )}
                                    </div>

                                    {preparedSpell && (
                                      <Accordion
                                        items={[
                                          {
                                            ...preparedSpell,
                                            uniqueKey: `prepared-${level}-${index}`,
                                          },
                                        ]}
                                        sortBy="name"
                                        labelProperty="name"
                                        renderItem={(spell) => (
                                          <SpellDetails spell={spell} />
                                        )}
                                        showSearch={false}
                                        showCounts={false}
                                        className="mt-2"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </section>
            )}

            {/* Cantrips/Orisons */}
            {showCantrips && (
              <section aria-labelledby="cantrips-heading">
                <div className="flex items-baseline justify-between mb-4">
                  <Typography
                    variant="sectionHeading"
                    id="cantrips-heading"
                    className="text-zinc-100 flex items-center gap-2 !mb-0"
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
                  className="text-zinc-500 text-xs block mb-4"
                >
                  Daily Uses: Level + {spellSystemInfo.abilityBonus}• No
                  preparation required
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
            )}
          </div>
        ) : (
          <div
            className="status-message text-zinc-400 space-y-2"
            role="status"
            aria-live="polite"
          >
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
