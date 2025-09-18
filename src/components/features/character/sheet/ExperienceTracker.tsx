import React, { useState, useId, useEffect } from "react";
import { Button } from "@/components/ui";
import { LevelUpModal } from "@/components/modals/LazyModals";
import { logger } from "@/utils";
import { canLevelUp, hasCustomClasses, getXPToNextLevel } from "@/utils";
import type { Character, Class } from "@/types";

interface ExperienceTrackerProps {
  /** The character whose XP to track */
  character: Character & { id?: string };
  /** Available classes for level calculation */
  classes: Class[];
  /** Callback when XP changes */
  onChange?: (xp: number) => void;
  /** Callback when full character updates (level up) */
  onCharacterChange?: (character: Character) => void;
  /** Additional props for the container div */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

// Simple math expression evaluator
const evaluateExpression = (expr: string, currentValue: number): number => {
  // Remove spaces and convert to lowercase
  const cleaned = expr.trim().toLowerCase();

  // Check if it's a simple addition/subtraction expression
  if (cleaned.startsWith("+") || cleaned.startsWith("-")) {
    const operation = cleaned[0];
    const numberStr = cleaned.slice(1);
    const number = parseFloat(numberStr);

    if (!isNaN(number)) {
      return operation === "+" ? currentValue + number : currentValue - number;
    }
  }

  // If it's just a number, return it
  const directNumber = parseFloat(cleaned);
  if (!isNaN(directNumber)) {
    return directNumber;
  }

  // If we can't parse it, return the current value
  return currentValue;
};

const ExperienceTracker: React.FC<ExperienceTrackerProps> = ({
  character,
  classes,
  onChange,
  onCharacterChange,
  containerProps,
}) => {
  const [inputValue, setInputValue] = useState(character.xp.toString());
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const componentId = useId();
  const inputId = `${componentId}-input`;
  const buttonId = `${componentId}-button`;
  const labelId = `${componentId}-label`;

  // Sync input value with character XP
  useEffect(() => {
    setInputValue(character.xp.toString());
  }, [character.xp]);

  // Check if character can level up using utility function
  const isLevelUpEnabled = canLevelUp(character, classes);

  // Calculate XP needed to reach next level for standard classes
  const xpToNextLevel = !hasCustomClasses(character)
    ? getXPToNextLevel(character, classes)
    : null;
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleInputSubmit();
    }
  };

  const handleInputSubmit = () => {
    const newXP = evaluateExpression(inputValue, character.xp);
    const clampedXP = Math.max(0, newXP); // Ensure XP doesn't go negative

    setInputValue(clampedXP.toString());
    onChange?.(clampedXP);
  };

  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select(); // Highlight the value when clicked
  };

  const handleInputBlur = () => {
    // Submit changes if input value is different, then reset to actual value
    if (inputValue !== character.xp.toString()) {
      handleInputSubmit();
    } else {
      // Ensure input shows current XP value even if no changes were made
      setInputValue(character.xp.toString());
    }
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault(); // Prevent context menu from appearing
  };

  const handleLevelUp = () => {
    setIsLevelUpModalOpen(true);
  };

  const handleLevelUpComplete = async (updatedCharacter: Character) => {
    try {
      // Call the character change callback to update the parent component
      // This should handle both local state update and Firebase save via useFirebaseSheet
      if (onCharacterChange) {
        onCharacterChange(updatedCharacter);
      }

      // DON'T call onChange for level ups - it would overwrite the full character update
      // onChange is only for XP-only changes, not full character updates
    } catch (error) {
      logger.error("Failed to update character after level up:", error);
    } finally {
      setIsLevelUpModalOpen(false);
    }
  };

  return (
    <>
      <div role="group" aria-labelledby={labelId} {...containerProps}>
        {/* Screen reader accessible label */}
        <div id={labelId} className="sr-only">
          Experience Points Tracker
        </div>

        <div className="flex">
          <input
            id={inputId}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onContextMenu={handleContextMenu}
            aria-label="Experience Points"
            aria-describedby={buttonId}
            className="w-full transition-all duration-150 border-2 rounded-l-lg rounded-r-none border-r-0 bg-zinc-800 text-zinc-100 border-zinc-600 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:border-amber-400 focus:bg-zinc-700 px-4 py-3 text-base min-h-[44px] shadow-[0_3px_0_0_#3f3f46] focus:shadow-[0_4px_0_0_#b45309]"
          />
          <Button
            id={buttonId}
            onClick={handleLevelUp}
            disabled={!isLevelUpEnabled}
            aria-label="Level up character"
            aria-describedby={inputId}
            className="rounded-l-none"
          >
            Level Up
          </Button>
        </div>

        {/* Helper text for XP to next level (only for standard classes) */}
        {xpToNextLevel !== null && (
          <div className="mt-2 px-2 text-sm text-zinc-400">
            {xpToNextLevel > 0
              ? `${xpToNextLevel.toLocaleString()} XP needed to reach level ${
                  character.level + 1
                }`
              : `Ready to level up to ${character.level + 1}!`}
          </div>
        )}
      </div>

      <LevelUpModal
        isOpen={isLevelUpModalOpen}
        onClose={() => setIsLevelUpModalOpen(false)}
        character={character}
        classes={classes}
        onLevelUp={handleLevelUpComplete}
      />
    </>
  );
};

export default ExperienceTracker;
