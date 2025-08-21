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
 * Gets the total gold value of a character's currency
 * @param character - The character object
 * @returns Total currency value in gold pieces
 */
export function getTotalGoldValue(character: Character): number {
  const { currency } = character;
  let total = currency.gold;

  if (currency.silver) total += convertToGold(currency.silver, "sp");
  if (currency.copper) total += convertToGold(currency.copper, "cp");
  if (currency.electrum) total += convertToGold(currency.electrum, "ep");
  if (currency.platinum) total += convertToGold(currency.platinum, "pp");

  return Math.round(total * 100) / 100; // Round to 2 decimal places
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

/**
 * Checks if a character can afford a purchase
 * @param character - The character object
 * @param cost - The cost amount
 * @param currency - The currency type of the cost
 * @returns True if the character can afford the purchase
 */
export function canAfford(
  character: Character,
  cost: number,
  currency: "gp" | "sp" | "cp" | "ep" | "pp"
): boolean {
  const costInGold = convertToGold(cost, currency);
  return getTotalGoldValue(character) >= costInGold;
}
