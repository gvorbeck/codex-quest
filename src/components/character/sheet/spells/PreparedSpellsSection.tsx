import type { Character, Spell } from "@/types/character";
import type { SelectOption } from "@/components/ui/inputs/Select";
import { Typography } from "@/components/ui/design-system";
import { Button, Select } from "@/components/ui/inputs";
import { Accordion } from "@/components/ui/layout";
import { SkeletonList } from "@/components/ui/feedback";
import { Icon } from "@/components/ui";
import { SpellDetails } from "@/components/character/shared";

interface PreparedSpellsSectionProps {
  character: Character;
  spellSlots: Record<number, number>;
  availableSpells: Record<number, Spell[]>;
  loadingSpells: boolean;
  canEdit: boolean;
  preparedSpells: Spell[];
  onSpellPreparation: (level: number, index: number, spellName: string) => void;
  onClearPreparation: (level: number, index: number) => void;
  getPreparedSpellForSlot: (level: number, index: number) => Spell | null;
}

export default function PreparedSpellsSection({
  spellSlots,
  availableSpells,
  loadingSpells,
  canEdit,
  preparedSpells,
  onSpellPreparation,
  onClearPreparation,
  getPreparedSpellForSlot,
}: PreparedSpellsSectionProps) {
  const hasSpellSlots = Object.keys(spellSlots).length > 0;

  if (!hasSpellSlots) {
    return null;
  }

  return (
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
                                      onSpellPreparation(
                                        level,
                                        index,
                                        spellName
                                      );
                                    } else {
                                      onClearPreparation(
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
                                  onClearPreparation(level, index)
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
  );
}