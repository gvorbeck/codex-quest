import { useState, useCallback } from "react";
import { LEVEL_UP_CONSTANTS } from "@/constants";
import type { Character, Class, TwoHPClass, HPGainResult } from "@/types";
import {
  hasCustomClasses,
  isCustomClass,
  logger,
  roller,
  getErrorMessage,
} from "@/utils";

interface UseHPGainProps {
  character: Character;
  primaryClass: Class | null;
  hasRequiredXP: boolean;
  isOpen: boolean;
  nextLevel: number;
}

export function useHPGain({
  character,
  primaryClass,
  hasRequiredXP,
  isOpen,
  nextLevel,
}: UseHPGainProps) {
  const [generatedHPGain, setGeneratedHPGain] = useState<HPGainResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevHasRequiredXP, setPrevHasRequiredXP] = useState(hasRequiredXP);
  const [hasGeneratedForSession, setHasGeneratedForSession] = useState(false);

  // Check if this is a custom class
  const isCustomClassCharacter = character.class
    ? isCustomClass(character.class)
    : false;

  // Handle state transitions during render (React docs recommended pattern)
  if (isOpen !== prevIsOpen || hasRequiredXP !== prevHasRequiredXP) {
    setPrevIsOpen(isOpen);
    setPrevHasRequiredXP(hasRequiredXP);

    if (!isOpen || !hasRequiredXP) {
      // Reset when modal closes or requirements not met
      if (generatedHPGain !== null || error !== null) {
        setGeneratedHPGain(null);
        setError(null);
      }
      if (hasGeneratedForSession) {
        setHasGeneratedForSession(false);
      }
    }
  }

  // Generate HP gain when modal opens and conditions are right (one-time per session)
  if (
    isOpen &&
    hasRequiredXP &&
    !generatedHPGain &&
    !hasGeneratedForSession &&
    (isCustomClassCharacter || primaryClass)
  ) {
    setHasGeneratedForSession(true);
    try {
      const result = isCustomClassCharacter
        ? calculateHPGainForCustomClass(character, nextLevel)
        : calculateHPGain(character, primaryClass!, nextLevel);
      setGeneratedHPGain(result);
      setError(null);
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Failed to calculate HP gain");
      setError(errorMessage);
      logger.error("HP gain calculation error:", err);
    }
  }

  // Re-roll HP gain
  const rerollHP = useCallback(() => {
    if (!hasRequiredXP || !isOpen) return;

    if (!isCustomClassCharacter && !primaryClass) return;

    try {
      const result = isCustomClassCharacter
        ? calculateHPGainForCustomClass(character, nextLevel)
        : calculateHPGain(character, primaryClass!, nextLevel);
      setGeneratedHPGain(result);
      setError(null);
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Failed to calculate HP gain");
      setError(errorMessage);
      logger.error("HP gain re-roll error:", err);
    }
  }, [
    character,
    primaryClass,
    hasRequiredXP,
    isOpen,
    nextLevel,
    isCustomClassCharacter,
  ]);

  // Set custom HP value
  const setCustomHP = useCallback(
    (customTotal: number) => {
      if (!generatedHPGain) return;

      // Ensure minimum of 1 HP
      const validTotal = Math.max(1, customTotal);

      setGeneratedHPGain({
        ...generatedHPGain,
        roll: null,
        constitutionBonus: null,
        total: validTotal,
        breakdown: `Manual entry: ${validTotal}`,
      });
    },
    [generatedHPGain]
  );

  return {
    hpGainResult: generatedHPGain,
    error,
    clearError: () => setError(null),
    rerollHP,
    setCustomHP,
  };
}

function calculateHPGainForCustomClass(
  character: Character,
  nextLevel: number
): HPGainResult {
  // For custom classes, get the hit die from the custom class data

  if (!hasCustomClasses(character)) {
    throw new Error("Custom class data not found");
  }

  const hitDie = character.hp.die || "1d6";
  const dieParts = hitDie.split("d");

  if (dieParts.length !== 2) {
    throw new Error(`Invalid hit die format: ${hitDie}`);
  }

  const dieType = parseInt(dieParts[1] || "6", 10);
  const constitutionModifier = character.abilities.constitution.modifier;

  // After level 9, characters get fixed HP (use conservative 1 HP for custom classes)
  if (character.level >= LEVEL_UP_CONSTANTS.FIXED_HP_LEVEL_THRESHOLD) {
    return {
      roll: null,
      constitutionBonus: null,
      total: 1, // Conservative fixed HP gain for custom classes
      max: null,
      breakdown: `Fixed HP gain (level ${nextLevel}): 1`,
      isFixed: true,
    };
  }

  // Levels 1-9: Roll hit die and add Constitution modifier
  const diceResult = roller(hitDie);
  const totalGain = Math.max(1, diceResult.total + constitutionModifier);

  return {
    roll: diceResult.total,
    constitutionBonus: constitutionModifier,
    total: totalGain,
    max: dieType + constitutionModifier,
    breakdown: `${diceResult.breakdown} + ${constitutionModifier} (Con) = ${totalGain}`,
    isFixed: false,
  };
}

function calculateHPGain(
  character: Character,
  primaryClass: Class,
  nextLevel: number
): HPGainResult {
  const hitDie = primaryClass.hitDie;
  const dieParts = hitDie.split("d");

  if (dieParts.length !== 2) {
    throw new Error(`Invalid hit die format: ${hitDie}`);
  }

  const dieType = parseInt(dieParts[1] || "6", 10);
  const constitutionModifier = character.abilities.constitution.modifier;

  // After level 9, characters get fixed HP
  if (character.level >= LEVEL_UP_CONSTANTS.FIXED_HP_LEVEL_THRESHOLD) {
    const classId = primaryClass.id;
    const fixedHpGain = LEVEL_UP_CONSTANTS.TWO_HP_CLASSES.includes(
      classId as TwoHPClass
    )
      ? 2
      : 1;

    return {
      roll: null,
      constitutionBonus: null,
      total: fixedHpGain,
      max: null,
      breakdown: `Fixed HP gain (level ${nextLevel}): ${fixedHpGain}`,
      isFixed: true,
    };
  }

  // Levels 1-9: Roll hit die and add Constitution modifier
  const diceResult = roller(hitDie);
  const totalGain = Math.max(1, diceResult.total + constitutionModifier);

  return {
    roll: diceResult.total,
    constitutionBonus: constitutionModifier,
    total: totalGain,
    max: dieType + constitutionModifier,
    breakdown: `${diceResult.breakdown} + ${constitutionModifier} (Con) = ${totalGain}`,
    isFixed: false,
  };
}
