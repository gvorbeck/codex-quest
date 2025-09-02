/**
 * Currency utility functions for handling conversions and calculations
 */

import type { Character } from "@/types/character";

/**
 * Converts any currency to gold pieces for calculations
 * @param value - The currency value
 * @param currency - The currency type ('gp', 'sp', 'cp', 'ep', 'pp')
 * @returns The value converted to gold pieces
 */
export function convertToGold(
  value: number,
  currency: "gp" | "sp" | "cp" | "ep" | "pp"
): number {
  switch (currency) {
    case "gp":
      return value;
    case "sp":
      return value / 10; // 10 sp = 1 gp
    case "cp":
      return value / 100; // 100 cp = 1 gp
    case "ep":
      return value / 2; // 2 ep = 1 gp
    case "pp":
      return value * 10; // 1 pp = 10 gp
    default:
      return value;
  }
}


/**
 * Updates a character's gold amount
 * @param character - The character object
 * @param newGoldAmount - The new gold amount
 * @returns Updated character with new gold amount
 */
export function updateCharacterGold(
  character: Character,
  newGoldAmount: number
): Character {
  return {
    ...character,
    currency: {
      ...character.currency,
      gold: Math.round(newGoldAmount * 100) / 100, // Round to 2 decimal places
    },
  };
}
