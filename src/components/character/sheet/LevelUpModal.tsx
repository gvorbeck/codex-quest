import { useState, useMemo, useEffect } from "react";
import { Modal } from "@/components/ui/feedback";
import { Button } from "@/components/ui";
import { Select } from "@/components/ui/inputs";
import Card from "@/components/ui/design-system/Card";
import Typography from "@/components/ui/design-system/Typography";
import { roller } from "@/utils/dice";
import type { Character, Class, Spell } from "@/types/character";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character & { id?: string };
  classes: Class[];
  onLevelUp?: (updatedCharacter: Character) => void;
}

interface SpellGainInfo {
  level: number;
  newSpells: number[];
  totalSpellsGained: number;
  spellsByLevel: Array<{ spellLevel: number; count: number; spells: Spell[] }>;
}

export default function LevelUpModal({
  isOpen,
  onClose,
  character,
  classes,
  onLevelUp,
}: LevelUpModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableSpells, setAvailableSpells] = useState<Spell[]>([]);
  const [selectedSpells, setSelectedSpells] = useState<Record<string, string>>(
    {}
  );
  const [isLoadingSpells, setIsLoadingSpells] = useState(false);

  // Get the character's primary class for level up calculations
  const getPrimaryClass = () => {
    const primaryClassId = character.class[0];
    if (!primaryClassId) return null;

    // Try exact match first, then case-insensitive match for legacy data
    let primaryClass = classes.find((c) => c.id === primaryClassId);

    if (!primaryClass) {
      // Try case-insensitive match (for migrated data)
      primaryClass = classes.find(
        (c) =>
          c.id.toLowerCase() === primaryClassId.toLowerCase() ||
          c.name.toLowerCase() === primaryClassId.toLowerCase()
      );
    }

    return primaryClass;
  };

  const primaryClass = getPrimaryClass();
  const currentLevel = character.level;
  const nextLevel = currentLevel + 1;
  const requiredXP = primaryClass?.experienceTable[nextLevel];
  const hasRequiredXP = requiredXP !== undefined && character.xp >= requiredXP;

  // Calculate spell gains for leveling up
  const spellGainInfo: SpellGainInfo | null = useMemo(() => {
    if (!primaryClass?.spellcasting || !hasRequiredXP) return null;

    const currentSpells =
      primaryClass.spellcasting.spellsPerLevel[currentLevel] || [];
    const nextLevelSpells =
      primaryClass.spellcasting.spellsPerLevel[nextLevel] || [];

    const newSpells: number[] = [];
    let totalSpellsGained = 0;

    // Compare spell slots between current and next level
    for (
      let spellLevel = 0;
      spellLevel < nextLevelSpells.length;
      spellLevel++
    ) {
      const currentCount = currentSpells[spellLevel] || 0;
      const nextCount = nextLevelSpells[spellLevel] || 0;
      const newCount = nextCount - currentCount;

      if (newCount > 0) {
        newSpells[spellLevel] = newCount;
        totalSpellsGained += newCount;
      }
    }

    return totalSpellsGained > 0
      ? {
          level: nextLevel,
          newSpells,
          totalSpellsGained,
          spellsByLevel: [], // Will be populated when spells are loaded
        }
      : null;
  }, [primaryClass, currentLevel, nextLevel, hasRequiredXP]);

  // Load available spells when spell gain is detected
  useEffect(() => {
    const loadSpells = async () => {
      if (!spellGainInfo || !primaryClass) return;

      setIsLoadingSpells(true);
      try {
        // Import spells data dynamically
        const spellsModule = await import("@/data/spells.json");
        const allSpells: Spell[] = spellsModule.default;

        // Filter and organize spells by level
        const classSpellKey = primaryClass.id as keyof Spell["level"];
        const spellsByLevel: Array<{
          spellLevel: number;
          count: number;
          spells: Spell[];
        }> = [];

        // Process each spell level that gained slots
        spellGainInfo.newSpells.forEach((count, index) => {
          if (count > 0) {
            const spellLevel = index + 1;
            const spellsForLevel = allSpells.filter((spell) => {
              const spellLevelForClass = spell.level[classSpellKey];
              return spellLevelForClass === spellLevel;
            });

            if (spellsForLevel.length > 0) {
              spellsByLevel.push({
                spellLevel,
                count,
                spells: spellsForLevel,
              });
            }
          }
        });

        setAvailableSpells(allSpells); // Keep all spells for reference
        // Reset selected spells when new spells are loaded
        setSelectedSpells({});
      } catch (error) {
        console.error("Failed to load spells:", error);
        setAvailableSpells([]);
      } finally {
        setIsLoadingSpells(false);
      }
    };

    loadSpells();
  }, [spellGainInfo, primaryClass]);

  // Organize spells by level for UI rendering
  const organizedSpells = useMemo(() => {
    if (!spellGainInfo || !primaryClass || availableSpells.length === 0)
      return [];

    const classSpellKey = primaryClass.id as keyof Spell["level"];
    const spellsByLevel: Array<{
      spellLevel: number;
      count: number;
      spells: Spell[];
    }> = [];

    spellGainInfo.newSpells.forEach((count, index) => {
      if (count > 0) {
        const spellLevel = index + 1;
        const spellsForLevel = availableSpells.filter((spell) => {
          const spellLevelForClass = spell.level[classSpellKey];
          return spellLevelForClass === spellLevel;
        });

        if (spellsForLevel.length > 0) {
          spellsByLevel.push({
            spellLevel,
            count,
            spells: spellsForLevel,
          });
        }
      }
    });

    return spellsByLevel;
  }, [spellGainInfo, primaryClass, availableSpells]);

  // Generate HP gain calculation when modal opens and character is eligible (memoized to prevent recalculation)
  const hpGainResult = useMemo(() => {
    if (!primaryClass || !hasRequiredXP || !isOpen) {
      return null;
    }

    const hitDie = primaryClass.hitDie; // e.g., "1d8"
    const dieParts = hitDie.split("d");
    if (dieParts.length !== 2) {
      return null;
    }
    const dieType = parseInt(dieParts[1] || "6", 10); // Extract die size (8 from "1d8"), default to 6
    const constitutionModifier = character.abilities.constitution.modifier;

    try {
      // After level 9, characters get fixed HP as shown in advancement table
      if (character.level >= 9) {
        const className = primaryClass.name.toLowerCase();
        let fixedHpGain = 1; // Default +1 HP per level

        // Classes that get +2 HP per level after 9th level
        const twoHpClasses = [
          "fighter",
          "thief",
          "assassin",
          "barbarian",
          "ranger",
          "paladin",
          "scout",
        ];
        if (twoHpClasses.includes(className)) {
          fixedHpGain = 2;
        }

        const result = {
          roll: null, // No rolling after level 9
          constitutionBonus: null, // No Constitution bonus after level 9
          total: fixedHpGain,
          max: null,
          breakdown: `Fixed HP gain (level ${nextLevel}): ${fixedHpGain}`,
          isFixed: true,
        };

        return result;
      }

      // Levels 1-9: Roll hit die and add Constitution modifier
      const diceResult = roller(hitDie);
      const totalGain = Math.max(1, diceResult.total + constitutionModifier); // Minimum 1 HP gain

      const result = {
        roll: diceResult.total,
        constitutionBonus: constitutionModifier,
        total: totalGain,
        max: dieType + constitutionModifier,
        breakdown: `${diceResult.breakdown} + ${constitutionModifier} (Con) = ${totalGain}`,
        isFixed: false,
      };

      return result;
    } catch (error) {
      console.error("Error calculating HP gain:", error);
      return null;
    }
  }, [
    hasRequiredXP,
    primaryClass,
    character.abilities.constitution.modifier,
    character.level,
    nextLevel,
    isOpen,
  ]);

  const canLevelUp = useMemo(() => {
    if (!hasRequiredXP || !primaryClass || !hpGainResult) return false;

    // If spells are gained, ensure all spell selections are made
    if (spellGainInfo) {
      const requiredSelections = spellGainInfo.totalSpellsGained;
      const filledSelections = Object.values(selectedSpells).filter(
        (spell) => spell !== ""
      ).length;
      return filledSelections === requiredSelections;
    }

    return true;
  }, [
    hasRequiredXP,
    primaryClass,
    hpGainResult,
    spellGainInfo,
    selectedSpells,
  ]);

  const handleSpellSelection = (selectionKey: string, spellName: string) => {
    const newSelectedSpells = { ...selectedSpells };
    newSelectedSpells[selectionKey] = spellName;
    setSelectedSpells(newSelectedSpells);
  };

  const handleLevelUp = async () => {
    if (!canLevelUp || !hpGainResult) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Prepare new spells if any were selected
      let newSpells: Spell[] = [...(character.spells || [])];
      if (spellGainInfo && Object.keys(selectedSpells).length > 0) {
        const spellsToAdd = Object.values(selectedSpells)
          .filter((name) => name !== "")
          .map((name) => availableSpells.find((spell) => spell.name === name)!)
          .filter(Boolean);
        newSpells = [...newSpells, ...spellsToAdd];
      }

      // Create updated character with new level, HP, and spells
      const updatedCharacter: Character = {
        ...character,
        level: nextLevel,
        hp: {
          ...character.hp,
          max: character.hp.max + hpGainResult.total,
          current: character.hp.max + hpGainResult.total, // Heal to new max
        },
        ...(newSpells.length > 0 && { spells: newSpells }),
      };

      if (onLevelUp) {
        onLevelUp(updatedCharacter);
      }

      onClose();
    } catch (error) {
      console.error("Level up failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Level Up ${character.name}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Current Status */}
        <Card variant="standard" size="default">
          <Typography variant="sectionHeading" className="mb-4">
            Current Status
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <Typography variant="bodySmall" color="secondary">
                Current Level:
              </Typography>
              <Typography variant="bodySmall" weight="semibold">
                {currentLevel}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="bodySmall" color="secondary">
                Current XP:
              </Typography>
              <Typography variant="bodySmall" weight="semibold">
                {character.xp.toLocaleString()}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="bodySmall" color="secondary">
                Class:
              </Typography>
              <Typography variant="bodySmall" weight="semibold">
                {primaryClass?.name || "Unknown"}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="bodySmall" color="secondary">
                Next Level XP:
              </Typography>
              <Typography variant="bodySmall" weight="semibold">
                {requiredXP ? requiredXP.toLocaleString() : "Max Level"}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="bodySmall" color="secondary">
                Current HP:
              </Typography>
              <Typography variant="bodySmall" weight="semibold">
                {character.hp.current}/{character.hp.max}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="bodySmall" color="secondary">
                Hit Die:
              </Typography>
              <Typography variant="bodySmall" weight="semibold">
                {primaryClass?.hitDie || "N/A"}
              </Typography>
            </div>
          </div>
        </Card>

        {/* Level Up Preview */}
        {hasRequiredXP && primaryClass && hpGainResult ? (
          <Card variant="success" size="default">
            <Typography variant="sectionHeading" color="lime" className="mb-4">
              🎉 Ready to Level Up!
            </Typography>
            <div className="space-y-4">
              <Typography variant="body" color="primary">
                Your character is ready to advance to level {nextLevel}!
              </Typography>

              {/* HP Gain Preview */}
              <Card variant="nested" size="compact">
                <Typography variant="subHeading" color="amber" className="mb-2">
                  Hit Points Gain
                </Typography>
                <div className="space-y-2">
                  {hpGainResult.isFixed ? (
                    // Fixed HP gain (levels 10+)
                    <>
                      <div className="flex justify-between items-center">
                        <Typography variant="bodySmall" color="secondary">
                          Fixed HP Gain:
                        </Typography>
                        <Typography variant="bodySmall" weight="semibold">
                          +{hpGainResult.total} HP
                        </Typography>
                      </div>
                      <Typography variant="caption" color="secondary">
                        {hpGainResult.breakdown}
                      </Typography>
                    </>
                  ) : (
                    // Rolled HP gain (levels 1-9)
                    <>
                      <div className="flex justify-between items-center">
                        <Typography variant="bodySmall" color="secondary">
                          Roll ({primaryClass.hitDie}):
                        </Typography>
                        <Typography variant="bodySmall" weight="semibold">
                          {hpGainResult.roll}
                        </Typography>
                      </div>
                      <div className="flex justify-between items-center">
                        <Typography variant="bodySmall" color="secondary">
                          Constitution Bonus:
                        </Typography>
                        <Typography variant="bodySmall" weight="semibold">
                          {hpGainResult.constitutionBonus !== null &&
                          hpGainResult.constitutionBonus >= 0
                            ? "+"
                            : ""}
                          {hpGainResult.constitutionBonus}
                        </Typography>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center border-t border-amber-700/30 pt-2">
                    <Typography
                      variant="bodySmall"
                      color="amber"
                      weight="semibold"
                    >
                      Total HP Gain:
                    </Typography>
                    <Typography variant="bodySmall" color="amber" weight="bold">
                      +{hpGainResult.total} HP
                    </Typography>
                  </div>
                  <Typography variant="caption" color="secondary">
                    New HP: {character.hp.max} →{" "}
                    {character.hp.max + hpGainResult.total}
                  </Typography>
                </div>
              </Card>

              <Typography variant="bodySmall" color="muted">
                Note: This will also heal your character to full HP.
              </Typography>
            </div>
          </Card>
        ) : (
          <Card variant="standard" size="default">
            <Typography variant="sectionHeading" className="mb-4">
              Level Up Requirements
            </Typography>
            <Typography variant="body" color="secondary">
              {requiredXP
                ? `You need ${(
                    requiredXP - character.xp
                  ).toLocaleString()} more XP to reach level ${nextLevel}.`
                : "You have reached the maximum level for this class."}
            </Typography>
          </Card>
        )}

        {/* Spell Selection */}
        {spellGainInfo && hasRequiredXP && primaryClass && (
          <Card variant="info" size="default">
            <Typography variant="sectionHeading" color="amber" className="mb-4">
              ✨ New Spells Available!
            </Typography>
            <Typography variant="body" color="primary" className="mb-4">
              You gain {spellGainInfo.totalSpellsGained} new spell
              {spellGainInfo.totalSpellsGained > 1 ? "s" : ""} at level{" "}
              {nextLevel}!
            </Typography>

            {isLoadingSpells ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-400"></div>
                <Typography
                  variant="bodySmall"
                  color="secondary"
                  className="ml-3"
                >
                  Loading available spells...
                </Typography>
              </div>
            ) : (
              <div className="space-y-6">
                {organizedSpells.map((levelGroup) => (
                  <div key={levelGroup.spellLevel} className="space-y-4">
                    <Typography
                      variant="subHeading"
                      color="amber"
                      className="border-b border-amber-700/30 pb-2"
                    >
                      Level {levelGroup.spellLevel} Spells ({levelGroup.count}{" "}
                      to select)
                    </Typography>

                    {Array.from({ length: levelGroup.count }).map(
                      (_, index) => {
                        const selectionKey = `level-${levelGroup.spellLevel}-spell-${index}`;
                        const currentSelection =
                          selectedSpells[selectionKey] || "";

                        const spellOptions = levelGroup.spells
                          .filter((spell) => {
                            const isAlreadySelected = Object.entries(
                              selectedSpells
                            ).some(
                              ([key, value]) =>
                                key !== selectionKey && value === spell.name
                            );
                            return (
                              !isAlreadySelected ||
                              currentSelection === spell.name
                            );
                          })
                          .map((spell) => ({
                            value: spell.name,
                            label: spell.name,
                          }));

                        return (
                          <div key={selectionKey}>
                            <Select
                              label={
                                levelGroup.count > 1
                                  ? `Level ${levelGroup.spellLevel} Spell ${
                                      index + 1
                                    }`
                                  : `Level ${levelGroup.spellLevel} Spell`
                              }
                              value={currentSelection}
                              onValueChange={(value) =>
                                handleSpellSelection(selectionKey, value)
                              }
                              options={spellOptions}
                              placeholder="Choose a spell"
                              size="sm"
                              required
                            />

                            {/* Show spell details when selected */}
                            {currentSelection && (
                              <Card
                                variant="nested"
                                size="compact"
                                className="mt-2"
                              >
                                {(() => {
                                  const selectedSpell = levelGroup.spells.find(
                                    (s) => s.name === currentSelection
                                  );
                                  if (!selectedSpell) return null;

                                  return (
                                    <div>
                                      <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                                        <Typography
                                          variant="caption"
                                          color="secondary"
                                        >
                                          <strong>Range:</strong>{" "}
                                          {selectedSpell.range}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="secondary"
                                        >
                                          <strong>Duration:</strong>{" "}
                                          {selectedSpell.duration}
                                        </Typography>
                                      </div>
                                      <Typography
                                        variant="caption"
                                        color="secondary"
                                        className="text-xs"
                                      >
                                        {selectedSpell.description.length > 150
                                          ? `${selectedSpell.description.substring(
                                              0,
                                              150
                                            )}...`
                                          : selectedSpell.description}
                                      </Typography>
                                    </div>
                                  );
                                })()}
                              </Card>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                ))}

                {Object.values(selectedSpells).filter((s) => s !== "").length <
                  spellGainInfo.totalSpellsGained && (
                  <Typography
                    variant="caption"
                    color="amber"
                    className="block mt-2"
                  >
                    Please select all {spellGainInfo.totalSpellsGained} spell
                    {spellGainInfo.totalSpellsGained > 1 ? "s" : ""} to
                    continue.
                  </Typography>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleLevelUp();
            }}
            disabled={!canLevelUp || isProcessing}
            loading={isProcessing}
            loadingText="Leveling up..."
            className="min-w-[120px]"
          >
            {hasRequiredXP ? "Level Up!" : "Not Ready"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
