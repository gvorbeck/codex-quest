/**
 * Magic utilities - consolidated from spells.ts, cantrips.ts, spellSystem.ts, and encounterUtils.ts
 * Contains spell management, cantrip handling, and encounter generation
 */

import type { Character, Cantrip, Spell } from "@/types";
import type { GameCombatant } from "@/types";
import type { SpellTypeInfo } from "@/types";
import { cantripData } from "@/data";
import { CHARACTER_CLASSES } from "@/constants";
import {
  loadSpellsForClass,
  loadAllFirstLevelSpells,
  loadAllSpells,
} from "@/services/dataLoader";
// Note: Using direct import here to avoid circular dependency with barrel file
import { roller } from "./mechanics";
import { canCastSpells, getSpellcastingAbilityModifier } from "./character";
import { allClasses } from "@/data/classes";

// ============================================================================
// SPELL CONSTANTS
// ============================================================================

export const SPELL_CONSTANTS = {
  // Success rate calculations
  BASE_SUCCESS_RATE: 15,
  SUCCESS_RATE_PER_LEVEL: 5,
  SPELL_LEVEL_PENALTY: 10,
  MIN_SUCCESS_RATE: 5,
  MAX_SUCCESS_RATE: 95,

  // Encounter constants
  ENCOUNTER_CHANCE: 1, // 1 in 6
  TABLE_DICE: "1d12",

  // Timing constants
  GENERATION_DELAY: 500,
  RESULT_DELAY: 300,
} as const;

// ============================================================================
// SPELL LOADING
// ============================================================================

export async function getFirstLevelSpellsForClass(
  classId: string
): Promise<Spell[]> {
  if (classId === "all") {
    return await loadAllFirstLevelSpells();
  }
  return await loadSpellsForClass(classId, 1);
}

export async function getAllSpellsForCustomClass(): Promise<Spell[]> {
  return await loadAllSpells();
}

// ============================================================================
// SPELL CALCULATIONS
// ============================================================================

export function calculateSpellSuccessRate(
  casterLevel: number,
  intelligenceScore: number,
  bonusModifier: number = 0,
  spellLevel: number = 1
): number {
  const baseRate =
    SPELL_CONSTANTS.BASE_SUCCESS_RATE +
    SPELL_CONSTANTS.SUCCESS_RATE_PER_LEVEL * casterLevel +
    intelligenceScore;

  const spellPenalty = spellLevel * SPELL_CONSTANTS.SPELL_LEVEL_PENALTY;
  const totalRate = baseRate - spellPenalty + bonusModifier;

  return Math.max(
    SPELL_CONSTANTS.MIN_SUCCESS_RATE,
    Math.min(SPELL_CONSTANTS.MAX_SUCCESS_RATE, totalRate)
  );
}

export function calculateSpellCost(
  spellLevel: number,
  baseCostPerLevel: number = 50,
  costReductionPercent: number = 0
): number {
  const baseCost = spellLevel * baseCostPerLevel;
  return Math.floor(baseCost * (1 - costReductionPercent / 100));
}

export function calculateSpellTime(
  spellLevel: number,
  baseTimePerLevel: number = 1,
  timeReductionPercent: number = 0,
  minTimeDays: number = 1
): number {
  const baseDays = spellLevel * baseTimePerLevel;
  return Math.max(
    minTimeDays,
    Math.floor(baseDays * (1 - timeReductionPercent / 100))
  );
}

export function formatSpellLevel(level: number): string {
  const suffix =
    level === 1 ? "st" : level === 2 ? "nd" : level === 3 ? "rd" : "th";

  return `${level}${suffix}`;
}

// ============================================================================
// CANTRIP UTILITIES
// ============================================================================

export function getAvailableCantrips(character: Character): Cantrip[] {
  // Note: Import moved to avoid circular dependency
  const isCustomClass = (classId: string): boolean => {
    return !allClasses.find((cls: { id: string }) => cls.id === classId);
  };

  const hasSpells = (char: Character): boolean => {
    return !!(char.spells && char.spells.length > 0);
  };

  const mappedClasses = character.class.map((classId) => {
    // For custom spellcasting classes, default to magic-user cantrips
    if (isCustomClass(classId) && hasSpells(character)) {
      return "magic-user";
    }

    // Standard classes (and non-spellcasting custom classes) keep their original names
    return classId;
  });

  return cantripData.filter((cantrip) =>
    cantrip.classes.some((cantripClass) => mappedClasses.includes(cantripClass))
  );
}

export function getSpellTypeInfo(character: Character): SpellTypeInfo {
  // Note: Minimal duplicate functions to avoid circular dependency
  const hasCustomClasses = (char: Character): boolean => {
    return char.class.some(
      (classId) => !allClasses.find((cls: { id: string }) => cls.id === classId)
    );
  };

  const hasSpells = (char: Character): boolean => {
    return !!(char.spells && char.spells.length > 0);
  };

  const hasClassType = (char: Character, classType: string): boolean => {
    return char.class.some((classId) => {
      const classData = allClasses.find(
        (cls: { id: string; classType?: string }) => cls.id === classId
      );
      return classData?.classType === classType;
    });
  };

  // Check for custom classes first - default to arcane (Intelligence)
  const hasCustomSpellcaster =
    hasCustomClasses(character) && hasSpells(character);

  // Use consolidated class type checking
  const hasDivineClasses = hasClassType(character, CHARACTER_CLASSES.CLERIC);
  const hasArcaneClasses =
    hasCustomSpellcaster ||
    hasClassType(character, CHARACTER_CLASSES.MAGIC_USER);

  const isOrisons = hasDivineClasses && !hasArcaneClasses;

  let abilityScore: SpellTypeInfo["abilityScore"];
  if (hasDivineClasses && hasArcaneClasses) {
    abilityScore = "Intelligence/Wisdom";
  } else if (hasDivineClasses) {
    abilityScore = "Wisdom";
  } else {
    abilityScore = "Intelligence";
  }

  return {
    type: isOrisons ? "orisons" : "cantrips",
    singular: isOrisons ? "orison" : "cantrip",
    capitalized: isOrisons ? "Orisons" : "Cantrips",
    capitalizedSingular: isOrisons ? "Orison" : "Cantrip",
    abilityScore,
  };
}

export function getCantripOptions(
  availableCantrips: Cantrip[],
  knownCantrips: Cantrip[]
) {
  const availableToAdd = availableCantrips.filter(
    (cantrip) => !knownCantrips.some((known) => known.name === cantrip.name)
  );

  return availableToAdd.map((cantrip) => ({
    value: cantrip.name,
    label: cantrip.name,
  }));
}

export function assignStartingCantrips(character: Character): Cantrip[] {
  // Don't auto-assign if character already has cantrips (manual selection)
  if (character.cantrips && character.cantrips.length > 0) {
    return character.cantrips;
  }

  // Check if any class can cast spells
  const hasSpellcaster = canCastSpells(character);
  if (!hasSpellcaster) {
    return [];
  }

  // Get relevant ability modifier
  const abilityBonus = getSpellcastingAbilityModifier(character);

  // Roll 1d4 + ability bonus for number of starting cantrips
  const rollResult = roller("1d4");
  const numCantrips = Math.max(0, rollResult.total + abilityBonus);

  if (numCantrips === 0) {
    return [];
  }

  // Get available cantrips and randomly select
  const availableCantrips = getAvailableCantrips(character);
  const selectedCantrips: Cantrip[] = [];

  // Shuffle available cantrips and pick the first numCantrips
  const shuffled = [...availableCantrips].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(numCantrips, shuffled.length); i++) {
    const cantrip = shuffled[i];
    if (cantrip) {
      selectedCantrips.push(cantrip);
    }
  }

  return selectedCantrips;
}

// ============================================================================
// ENCOUNTER UTILITIES
// ============================================================================

export function rollForEncounter(): boolean {
  return roller("1d6").total === SPELL_CONSTANTS.ENCOUNTER_CHANCE;
}

export function getRandomTableResult<T>(table: readonly T[]): T | null {
  if (table.length === 0) return null;

  // Use consistent approach from spellSystem.ts - roll 1d12 but cap to table length
  const roll = roller(SPELL_CONSTANTS.TABLE_DICE).total;
  const index = Math.min(roll - 1, table.length - 1);

  return table[index] || null;
}

export function parseCreatureName(encounterName: string): string {
  let baseName = encounterName;

  // Handle "NPC Party" encounters
  if (baseName.includes("NPC Party:")) {
    baseName = baseName.replace("NPC Party: ", "");
  }

  // Remove special ability indicators (*)
  baseName = baseName.replace(/\*/g, "");

  return baseName.trim();
}

export function generateDefaultAC(): number {
  // Default AC for most creatures is around 12-16, with some variation
  return 12 + roller("1d4").total; // AC 13-16
}

export function createCombatantFromEncounter(
  encounterName: string
): GameCombatant {
  return {
    name: parseCreatureName(encounterName),
    ac: generateDefaultAC(),
    initiative: 0, // Will be rolled during combat
    isPlayer: false,
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
