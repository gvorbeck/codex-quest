import type { GameCombatant } from "@/types/game";

// Encounter-specific constants
export const ENCOUNTER_CONSTANTS = {
  ENCOUNTER_CHANCE: 1, // 1 in 6 chance
  DICE_SIDES: 6,
  GENERATION_DELAY: 500,
  RESULT_DELAY: 300,
} as const;

/**
 * Roll 1d6 for encounter check (1 = encounter occurs)
 */
export function rollForEncounter(): boolean {
  const roll = Math.floor(Math.random() * ENCOUNTER_CONSTANTS.DICE_SIDES) + 1;
  return roll === ENCOUNTER_CONSTANTS.ENCOUNTER_CHANCE;
}

/**
 * Get a random result from an encounter table
 */
export function getRandomTableResult<T>(table: readonly T[]): T | null {
  if (!table.length) return null;
  const index = Math.floor(Math.random() * table.length);
  return table[index] ?? null;
}

/**
 * Parse creature name from encounter result (remove special notations)
 */
export function parseCreatureName(encounterName: string): string {
  // Remove asterisk notation for special abilities
  return encounterName.replace(/\*$/, '').trim();
}

/**
 * Generate a default AC for creatures (placeholder implementation)
 */
export function generateDefaultAC(): number {
  // Simple random AC between 10-18 for now
  // In a real implementation, this would lookup the creature's actual AC
  return Math.floor(Math.random() * 9) + 10;
}

/**
 * Create a delay for UX purposes
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a combatant from an encounter result
 */
export function createCombatantFromEncounter(encounterName: string): GameCombatant {
  return {
    name: parseCreatureName(encounterName),
    ac: generateDefaultAC(),
    initiative: 0, // Will be rolled during combat
    isPlayer: false,
  };
}