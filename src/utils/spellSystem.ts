/**
 * Shared utilities for spell and encounter systems
 */

// Constants for spell-related calculations
export const SPELL_CONSTANTS = {
  // Success rate calculations
  BASE_SUCCESS_RATE: 15,
  SUCCESS_RATE_PER_LEVEL: 5,
  SPELL_LEVEL_PENALTY: 10,
  MIN_SUCCESS_RATE: 5,
  MAX_SUCCESS_RATE: 95,
  
  // Encounter constants
  ENCOUNTER_CHANCE: 1, // 1 in 6
  DICE_SIDES: 6,
  TABLE_DICE: "1d12",
  
  // Timing constants
  GENERATION_DELAY: 500,
  RESULT_DELAY: 300,
} as const;

/**
 * Calculate spell success rate based on caster level, intelligence, and bonuses
 */
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

/**
 * Calculate spell creation costs based on level and modifiers
 */
export function calculateSpellCost(
  spellLevel: number,
  baseCostPerLevel: number = 50,
  costReductionPercent: number = 0
): number {
  const baseCost = spellLevel * baseCostPerLevel;
  return Math.floor(baseCost * (1 - costReductionPercent / 100));
}

/**
 * Calculate spell creation time based on level and modifiers
 */
export function calculateSpellTime(
  spellLevel: number,
  baseTimePerLevel: number = 1,
  timeReductionPercent: number = 0,
  minTimeDays: number = 1
): number {
  const baseDays = spellLevel * baseTimePerLevel;
  return Math.max(minTimeDays, Math.floor(baseDays * (1 - timeReductionPercent / 100)));
}

/**
 * Generate a random roll for encounter checks
 */
export function rollForEncounter(): boolean {
  return Math.floor(Math.random() * SPELL_CONSTANTS.DICE_SIDES) + 1 === SPELL_CONSTANTS.ENCOUNTER_CHANCE;
}

/**
 * Get a random item from a table/array
 */
export function getRandomTableResult<T>(table: readonly T[]): T | null {
  if (table.length === 0) return null;
  
  // Roll 1d12 but cap to table length
  const roll = Math.floor(Math.random() * 12) + 1;
  const index = Math.min(roll - 1, table.length - 1);
  
  return table[index] || null;
}

/**
 * Format spell level with proper ordinal suffix
 */
export function formatSpellLevel(level: number): string {
  const suffix = 
    level === 1 ? "st" :
    level === 2 ? "nd" :
    level === 3 ? "rd" :
    "th";
  
  return `${level}${suffix}`;
}

/**
 * Parse creature names to handle special formatting
 */
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

/**
 * Generate default AC for encounters based on creature type
 */
export function generateDefaultAC(): number {
  // Default AC for most creatures is around 12-16, with some variation
  return 12 + Math.floor(Math.random() * 4) + 1; // AC 13-16
}

/**
 * Delay execution for UX purposes
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}