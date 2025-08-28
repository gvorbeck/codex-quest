import { useState, useEffect } from "react";
import { roller } from "@/utils/dice";
import { LEVEL_UP_CONSTANTS, type TwoHPClass } from "@/constants/levelUp";
import type { Character, Class } from "@/types/character";
import { logger } from "@/utils/logger";

export interface HPGainResult {
  roll: number | null;
  constitutionBonus: number | null;
  total: number;
  max: number | null;
  breakdown: string;
  isFixed: boolean;
}

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

  // Clear generated HP when modal closes or character becomes ineligible
  useEffect(() => {
    if (!isOpen || !hasRequiredXP) {
      setGeneratedHPGain(null);
      setError(null);
    }
  }, [isOpen, hasRequiredXP]);

  // Generate HP gain once when eligible
  useEffect(() => {
    if (!primaryClass || !hasRequiredXP || !isOpen || generatedHPGain) {
      return;
    }

    try {
      const result = calculateHPGain(character, primaryClass, nextLevel);
      setGeneratedHPGain(result);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to calculate HP gain";
      setError(errorMessage);
      logger.error("HP gain calculation error:", err);
    }
  }, [
    character,
    primaryClass,
    hasRequiredXP,
    isOpen,
    nextLevel,
    generatedHPGain,
  ]);

  return {
    hpGainResult: generatedHPGain,
    error,
    clearError: () => setError(null),
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
    const className = primaryClass.name.toLowerCase();
    const fixedHpGain = LEVEL_UP_CONSTANTS.TWO_HP_CLASSES.includes(
      className as TwoHPClass
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
