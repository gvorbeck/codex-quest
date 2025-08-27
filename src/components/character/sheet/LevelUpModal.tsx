import { useState } from "react";
import { Modal } from "@/components/ui/feedback";
import { Button } from "@/components/ui";
import type { Character, Class } from "@/types/character";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character & { id?: string };
  classes: Class[];
  onLevelUp?: (updatedCharacter: Character) => void;
}

export default function LevelUpModal({ 
  isOpen, 
  onClose, 
  character, 
  classes,
  onLevelUp 
}: LevelUpModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Get the character's primary class for level up calculations
  const getPrimaryClass = () => {
    const primaryClassId = character.class[0];
    if (!primaryClassId) return null;
    
    // Try exact match first, then case-insensitive match for legacy data
    let primaryClass = classes.find(c => c.id === primaryClassId);
    
    if (!primaryClass) {
      // Try case-insensitive match (for migrated data)
      primaryClass = classes.find(c => 
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

  const handleLevelUp = async () => {
    if (!hasRequiredXP || !primaryClass) return;
    
    setIsProcessing(true);
    
    try {
      // This is where the actual level up logic will go
      // For now, just show that it's a placeholder
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      
      // Future implementation will:
      // 1. Increase character level
      // 2. Roll for HP gain
      // 3. Check for new spell slots
      // 4. Check for class abilities
      // 5. Update character data
      
      console.log("Level up processing would happen here");
      
      // For now, just call the callback with the current character
      // In the future, this will be the updated character with new level
      if (onLevelUp) {
        onLevelUp(character);
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
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
          <h3 className="text-lg font-semibold text-zinc-100 mb-3">Current Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-zinc-400">Current Level:</span>
              <span className="text-zinc-100 ml-2 font-semibold">{currentLevel}</span>
            </div>
            <div>
              <span className="text-zinc-400">Current XP:</span>
              <span className="text-zinc-100 ml-2 font-semibold">{character.xp.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-zinc-400">Class:</span>
              <span className="text-zinc-100 ml-2 font-semibold">{primaryClass?.name || "Unknown"}</span>
            </div>
            <div>
              <span className="text-zinc-400">Next Level XP:</span>
              <span className="text-zinc-100 ml-2 font-semibold">
                {requiredXP ? requiredXP.toLocaleString() : "Max Level"}
              </span>
            </div>
          </div>
        </div>

        {/* Level Up Preview */}
        {hasRequiredXP && primaryClass ? (
          <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-amber-100 mb-3 flex items-center gap-2">
              <span>🎉</span>
              Ready to Level Up!
            </h3>
            <div className="space-y-2 text-sm text-amber-100">
              <p>Your character is ready to advance to level {nextLevel}!</p>
              <p className="text-amber-200/80">
                <strong>Note:</strong> This is a placeholder implementation. 
                The full level up process will include HP rolls, spell slot updates, 
                and class feature unlocks.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-800/50 border border-zinc-600 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-zinc-300 mb-3">Level Up Requirements</h3>
            <p className="text-zinc-400 text-sm">
              {requiredXP 
                ? `You need ${(requiredXP - character.xp).toLocaleString()} more XP to reach level ${nextLevel}.`
                : "You have reached the maximum level for this class."
              }
            </p>
          </div>
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
            onClick={handleLevelUp}
            disabled={!hasRequiredXP || isProcessing}
            loading={isProcessing}
            loadingText="Processing..."
            className="min-w-[120px]"
          >
            {hasRequiredXP ? "Level Up!" : "Not Ready"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}