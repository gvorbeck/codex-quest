import type { Character, Equipment } from "@/types/character";

// Constants for game mechanics
const DEFAULT_UNARMORED_AC = 11;
const DEFAULT_MOVEMENT_RATE = "40'";
const LEATHER_ARMOR_MOVEMENT = "30'";
const METAL_ARMOR_MOVEMENT = "20'";

/**
 * Calculate the armor class for a character based on their worn equipment
 */
export function calculateArmorClass(
  character: Character | Record<string, unknown>
): number {
  // Handle both full Character objects and CharacterListItem objects
  const equipment = (character as Record<string, unknown>)["equipment"];

  if (!Array.isArray(equipment)) {
    // If no equipment array, return default AC
    return DEFAULT_UNARMORED_AC;
  }

  // Check for worn armor
  const wornArmor = equipment.find(
    (item: Record<string, unknown>) =>
      item["wearing"] && item["AC"] !== undefined
  );

  if (wornArmor && typeof wornArmor["AC"] === "number") {
    return wornArmor["AC"];
  }

  // Default AC (unarmored)
  return DEFAULT_UNARMORED_AC;
}

/**
 * Calculate movement rate for a character based on their worn equipment
 */
export function calculateMovementRate(character: Character): string {
  // Find worn armor to determine armor type
  const wornArmor = character.equipment?.find(
    (item) => item.wearing && item.AC !== undefined
  );

  // TODO: Implement encumbrance calculation
  // For now, just return movement based on armor type
  if (!wornArmor) {
    return DEFAULT_MOVEMENT_RATE; // No armor or magic leather
  }

  const armorName = wornArmor.name.toLowerCase();

  if (armorName.includes("leather") || armorName.includes("magic")) {
    return LEATHER_ARMOR_MOVEMENT; // Leather armor or magic metal
  }

  if (
    armorName.includes("chain") ||
    armorName.includes("plate") ||
    armorName.includes("mail")
  ) {
    return METAL_ARMOR_MOVEMENT; // Metal armor
  }

  return DEFAULT_MOVEMENT_RATE; // Default
}

/**
 * Calculate ability score modifier using BFRPG system
 */
export const calculateModifier = (score: number): number => {
  if (score <= 3) return -3;
  if (score <= 5) return -2;
  if (score <= 8) return -1;
  if (score <= 12) return 0;
  if (score <= 15) return 1;
  if (score <= 17) return 2;
  return 3;
};

/**
 * Format ability modifier with proper +/- sign
 */
export const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

/**
 * Get color class for ability score display based on relative values
 */
export const getAbilityScoreColor = (
  score: number,
  allScores: number[]
): string => {
  const highestScore = Math.max(...allScores);
  const lowestScore = Math.min(...allScores);

  if (score === highestScore) return "text-lime-400"; // Highest score(s)
  if (score === lowestScore) return "text-red-400"; // Lowest score(s)
  return "text-zinc-400"; // Default
};

// Equipment utilities

/**
 * Remove equipment items with zero or negative amounts
 */
export const cleanEquipmentArray = (equipment: Equipment[]): Equipment[] => {
  return equipment.filter((item) => item.amount > 0);
};

/**
 * Ensure equipment item has at least amount of 1
 */
export const ensureEquipmentAmount = (equipment: Equipment): Equipment => {
  return { ...equipment, amount: Math.max(1, equipment.amount || 0) };
};
