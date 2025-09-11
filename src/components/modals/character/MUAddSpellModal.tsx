import { useState, useMemo } from "react";
import { Modal } from "@/components/modals/base";
import { Typography } from "@/components/ui/design-system";
import { Button, Select } from "@/components/ui/inputs";
import { Callout } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/display";
import { getSpellSlots } from "@/utils/characterHelpers";
import { SpellDetails } from "@/components/character/shared";
import { allClasses } from "@/data/classes";
import spellsData from "@/data/spells.json";
import type { Character, Spell } from "@/types/character";

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
  const [selectedSpells, setSelectedSpells] = useState<Record<number, string>>({});

  // Get character's spell slots to determine which spell levels they can learn
  const spellSlots = useMemo(() => getSpellSlots(character, allClasses), [character]);
  
  // Filter spells that are available to magic-user type classes
  const availableSpellsByLevel = useMemo(() => {
    const spellsByLevel: Record<number, Spell[]> = {};
    
    // Get all spells that magic-user classes can cast
    const magicUserSpells = (spellsData as Spell[]).filter(spell => 
      spell.level["magic-user"] !== null || 
      spell.level.illusionist !== null || 
      spell.level.necromancer !== null || 
      spell.level.spellcrafter !== null
    );
    
    // Group by spell level based on character's classes
    magicUserSpells.forEach(spell => {
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
  }, [character.class, spellSlots]);

  // Filter out spells the character already knows
  const filteredSpellsByLevel = useMemo(() => {
    const knownSpellNames = new Set((character.spells || []).map(spell => spell.name));
    const filtered: Record<number, Spell[]> = {};
    
    Object.entries(availableSpellsByLevel).forEach(([level, spells]) => {
      filtered[parseInt(level)] = spells.filter(spell => !knownSpellNames.has(spell.name));
    });
    
    return filtered;
  }, [availableSpellsByLevel, character.spells]);

  const handleSpellSelection = (level: number, spellName: string) => {
    setSelectedSpells(prev => ({
      ...prev,
      [level]: spellName,
    }));
  };

  const handleAddSpells = () => {
    Object.entries(selectedSpells).forEach(([level, spellName]) => {
      if (spellName) {
        const spell = filteredSpellsByLevel[parseInt(level)]?.find(s => s.name === spellName);
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
    onClose();
  };

  const hasSelections = Object.values(selectedSpells).some(spell => spell !== "");
  const availableLevels = Object.keys(filteredSpellsByLevel).map(Number).sort((a, b) => a - b);

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
            Arcane spellcasters may learn spells by being taught by another arcane spellcaster, or by studying 
            another spellcaster's spellbook. If being taught, a spell can be learned in a single day. 
            Researching from a spellbook takes one day per spell level. In either case, the spell 
            must be transcribed into the character's own spellbook, at a cost of 500 gp per spell level.
          </Typography>
        </Callout>

        {/* Spell Selection */}
        {availableLevels.length > 0 ? (
          <div className="space-y-4">
            <Typography variant="sectionHeading" className="text-zinc-100">
              Available Spell Levels
            </Typography>
            
            {availableLevels.map(level => {
              const spellsForLevel = filteredSpellsByLevel[level] || [];
              if (spellsForLevel.length === 0) return null;
              
              return (
                <div key={level} className="space-y-2">
                  <Select
                    label={`Level ${level} Spells`}
                    value={selectedSpells[level] || ""}
                    onValueChange={(value) => handleSpellSelection(level, value)}
                    placeholder="Select a spell to learn..."
                    options={[
                      { value: "", label: "Select a spell..." },
                      ...spellsForLevel.map(spell => ({
                        value: spell.name,
                        label: spell.name,
                      })),
                    ]}
                  />
                  
                  {selectedSpells[level] && (
                    <div className="mt-2">
                      {(() => {
                        const selectedSpell = spellsForLevel.find(s => s.name === selectedSpells[level]);
                        if (!selectedSpell) return null;
                        
                        // Create a spell object with the required properties for SpellDetails
                        const spellWithLevel = {
                          ...selectedSpell,
                          spellLevel: level,
                          uniqueKey: `preview-${selectedSpell.name.toLowerCase().replace(/\s+/g, "-")}-${level}`
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
              You either know all available spells for your current spell levels, or you don't have any spell slots yet.
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