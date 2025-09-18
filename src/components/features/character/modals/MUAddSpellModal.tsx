import { useState, useMemo, useEffect, useCallback } from "react";
import { Modal } from "@/components/modals/base";
import { Typography } from "@/components/ui/core/display";
import { Button, Select } from "@/components/ui/core/primitives";
import { Callout, LoadingState } from "@/components/ui/core/feedback";
import { Icon } from "@/components/ui/core/display";
import SpellDetails from "@/components/domain/spells/SpellDetails";
import { allClasses } from "@/data";
import { loadAllSpells } from "@/services/dataLoader";
import type { Character, Spell } from "@/types";
import { getSpellSlots } from "@/utils";

interface MUAddSpellModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onSpellAdd: (spell: Spell) => void;
}

export default function MUAddSpellModal({
  isOpen,
  onClose,
  character,
  onSpellAdd,
}: MUAddSpellModalProps) {
  const [selectedSpells, setSelectedSpells] = useState<Record<number, string>>(
    {}
  );
  const [spellsState, setSpellsState] = useState({
    allSpells: [] as Spell[],
    isLoadingSpells: false,
    loadError: null as string | null,
    hasAttemptedLoad: false,
  });

  const { allSpells, isLoadingSpells, loadError, hasAttemptedLoad } =
    spellsState;

  // Get character's spell slots to determine which spell levels they can learn
  const spellSlots = useMemo(
    () => getSpellSlots(character, allClasses),
    [character]
  );

  // Extracted spell loading function that can be called directly
  const loadSpells = useCallback(async () => {
    setSpellsState((prev) => ({
      ...prev,
      isLoadingSpells: true,
      loadError: null,
    }));
    try {
      const spells = await loadAllSpells();
      setSpellsState((prev) => ({ ...prev, allSpells: spells }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load spells";
      setSpellsState((prev) => ({
        ...prev,
        loadError: errorMessage,
        allSpells: [],
      }));
    } finally {
      setSpellsState((prev) => ({
        ...prev,
        isLoadingSpells: false,
        hasAttemptedLoad: true,
      }));
    }
  }, []);

  // Load spells when modal opens
  useEffect(() => {
    if (isOpen && !hasAttemptedLoad) {
      loadSpells();
    }
  }, [isOpen, hasAttemptedLoad, loadSpells]);

  // Filter spells that are available to magic-user type classes
  const availableSpellsByLevel = useMemo(() => {
    const spellsByLevel: Record<number, Spell[]> = {};

    // Return empty if spells are loading or there was a load error
    if (isLoadingSpells || loadError) {
      return spellsByLevel;
    }

    // Get all spells that magic-user classes can cast
    const magicUserSpells = allSpells.filter(
      (spell) =>
        spell.level["magic-user"] !== null ||
        spell.level.illusionist !== null ||
        spell.level.necromancer !== null ||
        spell.level.spellcrafter !== null
    );

    // Group by spell level based on character's classes
    magicUserSpells.forEach((spell) => {
      let spellLevel = 0;

      // Determine the spell level for this character's classes
      for (const classId of character.class) {
        if (classId === "magic-user" && spell.level["magic-user"]) {
          spellLevel = spell.level["magic-user"];
          break;
        } else if (classId === "illusionist" && spell.level.illusionist) {
          spellLevel = spell.level.illusionist;
          break;
        } else if (classId === "necromancer" && spell.level.necromancer) {
          spellLevel = spell.level.necromancer;
          break;
        } else if (classId === "spellcrafter" && spell.level.spellcrafter) {
          spellLevel = spell.level.spellcrafter;
          break;
        }
      }

      if (spellLevel > 0 && spellSlots[spellLevel]) {
        if (!spellsByLevel[spellLevel]) {
          spellsByLevel[spellLevel] = [];
        }
        spellsByLevel[spellLevel]?.push(spell);
      }
    });

    return spellsByLevel;
  }, [character.class, spellSlots, allSpells, isLoadingSpells, loadError]);

  // Filter out spells the character already knows
  const filteredSpellsByLevel = useMemo(() => {
    const knownSpellNames = new Set(
      (character.spells || []).map((spell) => spell.name)
    );
    const filtered: Record<number, Spell[]> = {};

    Object.entries(availableSpellsByLevel).forEach(([level, spells]) => {
      filtered[parseInt(level)] = spells.filter(
        (spell) => !knownSpellNames.has(spell.name)
      );
    });

    return filtered;
  }, [availableSpellsByLevel, character.spells]);

  const handleSpellSelection = (level: number, spellName: string) => {
    setSelectedSpells((prev) => ({
      ...prev,
      [level]: spellName,
    }));
  };

  const handleAddSpells = () => {
    Object.entries(selectedSpells).forEach(([level, spellName]) => {
      if (spellName) {
        const spell = filteredSpellsByLevel[parseInt(level)]?.find(
          (s) => s.name === spellName
        );
        if (spell) {
          onSpellAdd(spell);
        }
      }
    });

    // Reset selections and close modal
    setSelectedSpells({});
    onClose();
  };

  const handleClose = () => {
    setSelectedSpells({});
    // Reset error state when modal closes
    setSpellsState((prev) => ({ ...prev, loadError: null }));
    onClose();
  };

  const hasSelections = Object.values(selectedSpells).some(
    (spell) => spell !== ""
  );
  const availableLevels = Object.keys(filteredSpellsByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Learn New Spells"
      size="lg"
    >
      <div className="space-y-6">
        {/* Explanation Text */}
        <Callout
          variant="info"
          title="Learning Spells"
          icon={<Icon name="book" size="md" className="text-amber-400" />}
          className="bg-amber-950/30 border-amber-800/50"
        >
          <Typography variant="caption" className="text-amber-300/80">
            Arcane spellcasters may learn spells by being taught by another
            arcane spellcaster, or by studying another spellcaster's spellbook.
            If being taught, a spell can be learned in a single day. Researching
            from a spellbook takes one day per spell level. In either case, the
            spell must be transcribed into the character's own spellbook, at a
            cost of 500 gp per spell level.
          </Typography>
        </Callout>

        {/* Spell Selection */}
        {isLoadingSpells ? (
          <LoadingState
            variant="inline"
            message="Loading available spells..."
            className="py-8"
          />
        ) : loadError ? (
          <div className="text-center py-8">
            <Callout
              variant="error"
              title="Failed to Load Spells"
              icon={
                <Icon
                  name="exclamation-circle"
                  size="md"
                  className="text-red-400"
                />
              }
              className="mb-4"
            >
              <Typography variant="body" className="text-red-300 mb-3">
                {loadError}
              </Typography>
              <Button
                variant="secondary"
                size="sm"
                disabled={isLoadingSpells}
                onClick={() => {
                  loadSpells();
                }}
              >
                Try Again
              </Button>
            </Callout>
          </div>
        ) : availableLevels.length > 0 ? (
          <div className="space-y-4">
            <Typography variant="sectionHeading" className="text-zinc-100">
              Available Spell Levels
            </Typography>

            {availableLevels.map((level) => {
              const spellsForLevel = filteredSpellsByLevel[level] || [];
              if (spellsForLevel.length === 0) return null;

              return (
                <div key={level} className="space-y-2">
                  <Select
                    label={`Level ${level} Spells`}
                    value={selectedSpells[level] || ""}
                    onValueChange={(value) =>
                      handleSpellSelection(level, value)
                    }
                    placeholder="Select a spell to learn..."
                    options={[
                      { value: "", label: "Select a spell..." },
                      ...spellsForLevel.map((spell) => ({
                        value: spell.name,
                        label: spell.name,
                      })),
                    ]}
                  />

                  {selectedSpells[level] && (
                    <div className="mt-2">
                      {(() => {
                        const selectedSpell = spellsForLevel.find(
                          (s) => s.name === selectedSpells[level]
                        );
                        if (!selectedSpell) return null;

                        // Create a spell object with the required properties for SpellDetails
                        const spellWithLevel = {
                          ...selectedSpell,
                          spellLevel: level,
                          uniqueKey: `preview-${selectedSpell.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}-${level}`,
                        };

                        return (
                          <SpellDetails
                            spell={spellWithLevel}
                            showAccessibilityLabels={false}
                            className="bg-zinc-800/30 rounded-lg p-3"
                          />
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Typography variant="body" className="text-zinc-400 mb-2">
              No new spells available
            </Typography>
            <Typography variant="caption" className="text-zinc-500">
              You either know all available spells for your current spell
              levels, or you don't have any spell slots yet.
            </Typography>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          {hasSelections && (
            <Button variant="primary" onClick={handleAddSpells}>
              Learn Selected Spells
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
