import { useMemo } from "react";
import type { Character, ScrollCreationProject } from "@/types";
import {
  calculateSpellSuccessRate,
  calculateSpellCost,
  calculateSpellTime,
} from "@/utils";

// Constants for Spellcrafter bonuses and scroll creation rules (BFRPG Core Rules)
export const SCROLL_CREATION_CONSTANTS = {
  // Spellcrafter bonuses
  RESEARCH_ROLL_BONUS: 25, // +25% bonus to magical research rolls
  TIME_REDUCTION_THRESHOLD: 6, // Level at which time reduction kicks in
  TIME_REDUCTION_PERCENT: 50, // 50% time reduction at 6th level
  COST_REDUCTION_THRESHOLD: 9, // Level at which cost reduction kicks in
  COST_REDUCTION_PERCENT: 25, // 25% cost reduction at 9th level

  // BFRPG Core Rules for scroll creation
  BASE_COST_PER_LEVEL: 50, // 50 gp per spell level
  BASE_TIME_PER_LEVEL: 1, // 1 day per spell level
  MIN_TIME_DAYS: 1, // Minimum 1 day for any scroll
} as const;

// Simple ID generation utility
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
};

// Helper to create scroll creation object with proper typing
export const createScrollCreationObject = (
  projects: ScrollCreationProject[],
  totalScrollsCreated?: number,
  bonuses?: {
    researchRollBonus: number;
    timeReduction: number;
    costReduction: number;
  }
): NonNullable<Character["scrollCreation"]> => {
  const result: NonNullable<Character["scrollCreation"]> = { projects };

  if (totalScrollsCreated !== undefined) {
    result.totalScrollsCreated = totalScrollsCreated;
  }

  if (bonuses) {
    result.bonuses = bonuses;
  }

  return result;
};

export const useScrollCreation = (character: Character) => {
  // Check if character is a Spellcrafter and calculate bonuses
  const spellcrafterLevel = useMemo(() => {
    return character.class === "spellcrafter" ? character.level : 0;
  }, [character.class, character.level]);

  const canCreateScrolls = spellcrafterLevel >= 1;

  const scrollCreationBonuses = useMemo(() => {
    if (spellcrafterLevel === 0) return null;

    return {
      researchRollBonus: SCROLL_CREATION_CONSTANTS.RESEARCH_ROLL_BONUS,
      timeReduction:
        spellcrafterLevel >= SCROLL_CREATION_CONSTANTS.TIME_REDUCTION_THRESHOLD
          ? SCROLL_CREATION_CONSTANTS.TIME_REDUCTION_PERCENT
          : 0,
      costReduction:
        spellcrafterLevel >= SCROLL_CREATION_CONSTANTS.COST_REDUCTION_THRESHOLD
          ? SCROLL_CREATION_CONSTANTS.COST_REDUCTION_PERCENT
          : 0,
    };
  }, [spellcrafterLevel]);

  // Get current projects
  const projects = character.scrollCreation?.projects || [];
  const activeProjects = projects.filter((p) => p.status === "in-progress");
  const completedProjects = projects.filter((p) => p.status === "completed");

  // Calculate scroll creation costs and time based on BFRPG Core Rules
  const calculateScrollCost = (spellLevel: number): number => {
    return calculateSpellCost(
      spellLevel,
      SCROLL_CREATION_CONSTANTS.BASE_COST_PER_LEVEL,
      scrollCreationBonuses?.costReduction || 0
    );
  };

  const calculateScrollTime = (spellLevel: number): number => {
    return calculateSpellTime(
      spellLevel,
      SCROLL_CREATION_CONSTANTS.BASE_TIME_PER_LEVEL,
      scrollCreationBonuses?.timeReduction || 0,
      SCROLL_CREATION_CONSTANTS.MIN_TIME_DAYS
    );
  };

  // Success rate calculation
  const calculateSuccessRate = useMemo(() => {
    return (spellLevel: number): number => {
      return calculateSpellSuccessRate(
        spellcrafterLevel,
        character.abilities.intelligence?.value || 10,
        scrollCreationBonuses?.researchRollBonus || 0,
        spellLevel
      );
    };
  }, [
    spellcrafterLevel,
    character.abilities.intelligence?.value,
    scrollCreationBonuses?.researchRollBonus,
  ]);

  return {
    spellcrafterLevel,
    canCreateScrolls,
    scrollCreationBonuses,
    projects,
    activeProjects,
    completedProjects,
    calculateScrollCost,
    calculateScrollTime,
    calculateSuccessRate,
  };
};
