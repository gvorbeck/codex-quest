import React, { useState, useId, useEffect } from "react";
import { Button } from "@/components/ui";
import type { Character, Class } from "@/types/character";
import { useAuth } from "@/hooks/useAuth";
import { saveCharacter } from "@/services/characters";

interface ExperienceTrackerProps {
  /** The character whose XP to track */
  character: Character & { id?: string };
  /** Available classes for level calculation */
  classes: Class[];
  /** Callback when XP changes */
  onChange?: (xp: number) => void;
  /** Additional props for the container div */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

// Simple math expression evaluator
const evaluateExpression = (expr: string, currentValue: number): number => {
  // Remove spaces and convert to lowercase
  const cleaned = expr.trim().toLowerCase();
  
  // Check if it's a simple addition/subtraction expression
  if (cleaned.startsWith('+') || cleaned.startsWith('-')) {
    const operation = cleaned[0];
    const numberStr = cleaned.slice(1);
    const number = parseFloat(numberStr);
    
    if (!isNaN(number)) {
      return operation === '+' ? currentValue + number : currentValue - number;
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
  containerProps,
}) => {
  const [inputValue, setInputValue] = useState(character.xp.toString());
  const { user } = useAuth();
  const componentId = useId();
  const inputId = `${componentId}-input`;
  const buttonId = `${componentId}-button`;
  const labelId = `${componentId}-label`;

  // Sync input value with character XP
  useEffect(() => {
    setInputValue(character.xp.toString());
  }, [character.xp]);

  // Check if character can level up
  const canLevelUp = (): boolean => {
    // Find the character's primary class (first class in array)
    const primaryClassId = character.class[0];
    
    if (!primaryClassId) {
      console.log("Character has no classes");
      return false;
    }
    
    // Try exact match first, then case-insensitive match for legacy data
    let primaryClass = classes.find(c => c.id === primaryClassId);
    
    if (!primaryClass) {
      // Try case-insensitive match (for migrated data that might have 'Cleric' instead of 'cleric')
      primaryClass = classes.find(c => 
        c.id.toLowerCase() === primaryClassId.toLowerCase() ||
        c.name.toLowerCase() === primaryClassId.toLowerCase()
      );
    }
    
    if (!primaryClass) {
      return false;
    }
    
    const currentLevel = character.level;
    const nextLevel = currentLevel + 1;
    const requiredXP = primaryClass.experienceTable[nextLevel];
    
    return requiredXP !== undefined && character.xp >= requiredXP;
  };

  // Save XP to Firebase
  const saveXPToFirebase = async (newXP: number) => {
    if (!user) return;
    
    try {
      // Only save if character has an ID (i.e., it's already saved to Firebase)
      if (character.id) {
        const updatedCharacter = { ...character, xp: newXP };
        await saveCharacter(user.uid, updatedCharacter, character.id);
      }
      // If character doesn't have an ID, it's still in local storage and will be saved when character creation is completed
    } catch (error) {
      console.error("Failed to save XP to Firebase:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleInputSubmit();
    }
  };

  const handleInputSubmit = () => {
    const newXP = evaluateExpression(inputValue, character.xp);
    const clampedXP = Math.max(0, newXP); // Ensure XP doesn't go negative
    
    setInputValue(clampedXP.toString());
    onChange?.(clampedXP);
    saveXPToFirebase(clampedXP);
  };

  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select(); // Highlight the value when clicked
  };

  const handleInputBlur = () => {
    // Reset to actual value if user didn't submit
    setInputValue(character.xp.toString());
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault(); // Prevent context menu from appearing
  };

  const handleLevelUp = () => {
    alert("Level up functionality coming soon!");
  };

  const isLevelUpEnabled = canLevelUp();

  return (
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
    </div>
  );
};

export default ExperienceTracker;