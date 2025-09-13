import type { Character, Equipment } from "@/types/character";
import { logger } from "@/utils/logger";
import {
  DEFAULT_UNARMORED_AC,
  DEFAULT_MOVEMENT_RATE,
  LEATHER_ARMOR_MOVEMENT,
  METAL_ARMOR_MOVEMENT,
  MODIFIER_THRESHOLDS,
  DEFAULT_HIGH_MODIFIER,
} from "@/utils/gameConstants";

// Equipment type guards
export const isWornArmor = (
  item: Equipment
): item is Equipment & { AC: number } =>
  Boolean(
    item.wearing &&
      typeof item.AC === "number" &&
      item.category &&
      !item.category.toLowerCase().includes("shield")
  );

export const isWornShield = (
  item: Equipment
): item is Equipment & { AC: string } =>
  Boolean(
    item.wearing &&
      typeof item.AC === "string" &&
      item.category?.toLowerCase().includes("shield")
  );

/**
 * Parse shield AC bonus value with error handling
 * @param shieldAC - The AC value from shield equipment (e.g., "+1", "+2")
 * @param itemName - Name of the shield for error logging
 * @returns Parsed bonus value or 0 if invalid
 */
const parseShieldBonus = (
  shieldAC: string | number,
  itemName: string
): number => {
  if (typeof shieldAC === "string" && shieldAC.startsWith("+")) {
    const bonusValue = parseInt(shieldAC.substring(1), 10);
    if (isNaN(bonusValue)) {
      logger.warn(`Invalid shield AC value for ${itemName}: ${shieldAC}`);
      return 0;
    }
    return bonusValue;
  } else if (typeof shieldAC === "number" && shieldAC > 0) {
    return shieldAC;
  }
  return 0;
};

// Flexible equipment item interface for calculations
interface EquipmentLike {
  name: string;
  wearing?: boolean;
  AC?: number | string;
  category?: string;
}

/**
 * Calculate the armor class for a character based on their worn equipment
 * @param character - The character object with equipment array
 * @returns Total AC including base armor and shield bonuses
 * @example
 * const character = { equipment: [
 *   { name: "Leather Armor", wearing: true, AC: 12, category: "armor" },
 *   { name: "Shield", wearing: true, AC: "+1", category: "shields" }
 * ]};
 * calculateArmorClass(character) // returns 13 (12 base + 1 shield bonus)
 */
export function calculateArmorClass(
  character: Character | { equipment?: EquipmentLike[] }
): number {
  const equipment = character.equipment;
  if (!Array.isArray(equipment)) {
    return DEFAULT_UNARMORED_AC;
  }

  // Ensure equipment is Equipment[] for type guards
  const eqArr = equipment as Equipment[];

  let baseAC = DEFAULT_UNARMORED_AC;
  let shieldBonus = 0;

  // Use isWornArmor type guard to find worn armor
  const wornArmor = eqArr.find(isWornArmor);
  if (wornArmor && typeof wornArmor.AC === "number") {
    baseAC = wornArmor.AC;
  }

  // Use isWornShield type guard to find all worn shields
  const wornShields = eqArr.filter(isWornShield);
  wornShields.forEach((shield) => {
    // Defensive: fallback to 0 if AC or name is undefined
    shieldBonus += parseShieldBonus(
      shield.AC ?? 0,
      shield.name ?? "Unknown Shield"
    );
  });

  return baseAC + shieldBonus;
}

/**
 * Calculate movement rate for a character based on their worn equipment
 *
 * BFRPG Movement Rules:
 * - Unarmored/Leather: 40' per round
 * - Chain/Scale/Splint: 30' per round
 * - Plate: 20' per round
 *
 * Note: This implementation uses simplified armor-based movement.
 * Full BFRPG encumbrance rules (based on total weight vs strength)
 * are not yet implemented. See BFRPG Core Rules p.44 for complete rules.
 *
 * @param character - The character object with equipment
 * @returns Movement rate string (e.g., "40'", "30'", "20'")
 */
export function calculateMovementRate(character: Character): string {
  if (!character.equipment) {
    return DEFAULT_MOVEMENT_RATE;
  }

  // Find worn armor to determine movement rate
  const wornArmor = character.equipment.find(isWornArmor);

  if (!wornArmor) {
    return DEFAULT_MOVEMENT_RATE; // No armor worn
  }

  const armorName = wornArmor.name.toLowerCase();

  // Leather armor and magic armor (typically allows faster movement)
  if (armorName.includes("leather") || armorName.includes("magic")) {
    return LEATHER_ARMOR_MOVEMENT;
  }

  // Heavy metal armors (chain, scale, splint, plate)
  if (
    armorName.includes("chain") ||
    armorName.includes("scale") ||
    armorName.includes("splint") ||
    armorName.includes("plate") ||
    armorName.includes("mail")
  ) {
    return METAL_ARMOR_MOVEMENT;
  }

  // Default for unrecognized armor types
  return DEFAULT_MOVEMENT_RATE;
}

/**
 * Calculate ability score modifier using BFRPG system
 * @param score - The ability score (3-18 typically)
 * @returns The modifier value (-3 to +3)
 * last simplified
 */
export const calculateModifier = (score: number): number => {
  const threshold = MODIFIER_THRESHOLDS.find((t) => score <= t.max);
  return threshold?.modifier ?? DEFAULT_HIGH_MODIFIER;
};

/**
 * Format ability modifier with proper +/- sign for display
 * @param modifier - The numeric modifier value (-3 to +3 typically)
 * @returns Formatted string with + or - prefix
 * @example
 * formatModifier(2) // returns "+2"
 * formatModifier(-1) // returns "-1"
 * formatModifier(0) // returns "+0"
 */
export const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

/**
 * Get semantic category for ability score display based on relative values
 * Useful for applying different UI styling to highlight character strengths/weaknesses
 * @param score - The ability score to categorize
 * @param allScores - Array of all ability scores for comparison
 * @returns Semantic category for UI styling
 * @example
 * const scores = [15, 12, 14, 10, 16, 8];
 * getAbilityScoreCategory(16, scores) // returns "highest"
 * getAbilityScoreCategory(8, scores) // returns "lowest"
 * getAbilityScoreCategory(12, scores) // returns "normal"
 */
export const getAbilityScoreCategory = (
  score: number,
  allScores: number[]
): "highest" | "lowest" | "normal" => {
  const highestScore = Math.max(...allScores);
  const lowestScore = Math.min(...allScores);

  if (score === highestScore) return "highest";
  if (score === lowestScore) return "lowest";
  return "normal";
};

// Equipment utilities

/**
 * Remove equipment items with zero or negative amounts
 * Useful for cleaning up inventory after item usage or removal
 * @param equipment - Array of equipment items that may include empty/depleted items
 * @returns Filtered array containing only items with positive amounts
 * @example
 * const items = [
 *   { name: "Sword", amount: 1 },
 *   { name: "Arrows", amount: 0 },
 *   { name: "Shield", amount: 1 }
 * ];
 * cleanEquipmentArray(items) // returns [{ name: "Sword", amount: 1 }, { name: "Shield", amount: 1 }]
 */
export const cleanEquipmentArray = (equipment: Equipment[]): Equipment[] => {
  return equipment.filter((item) => item.amount > 0);
};

/**
 * Ensure equipment item has at least amount of 1
 * Prevents equipment from having invalid zero/negative quantities
 * @param equipment - Equipment item that may have invalid amount
 * @returns Equipment item with amount guaranteed to be at least 1
 * @example
 * ensureEquipmentAmount({ name: "Sword", amount: 0 }) // returns { name: "Sword", amount: 1 }
 * ensureEquipmentAmount({ name: "Shield", amount: 3 }) // returns { name: "Shield", amount: 3 }
 */
export const ensureEquipmentAmount = (equipment: Equipment): Equipment => {
  return { ...equipment, amount: Math.max(1, equipment.amount || 0) };
};
