/**
 * Consolidated game mechanics constants
 * Centralizes constants that were duplicated across multiple utility files
 * Based on official Basic Fantasy Role-Playing Game rules
 */

// Character mechanics constants
export const GAME_MECHANICS = {
  // Armor Class defaults
  DEFAULT_UNARMORED_AC: 11 as number,
  
  // Movement rates (per round)
  DEFAULT_MOVEMENT_RATE: "40'",
  LEATHER_ARMOR_MOVEMENT: "30'", 
  METAL_ARMOR_MOVEMENT: "20'",
  
  // Ability score modifier thresholds (BFRPG system)
  ABILITY_MODIFIERS: [
    { max: 3, modifier: -3 },
    { max: 5, modifier: -2 },
    { max: 8, modifier: -1 },
    { max: 12, modifier: 0 },
    { max: 15, modifier: 1 },
    { max: 17, modifier: 2 }
  ] as const,
  
  // Default modifier for scores above 17
  DEFAULT_HIGH_MODIFIER: 3,
  
  // Starting gold for first level characters
  STARTING_GOLD_DICE: "3d6",
  STARTING_GOLD_MULTIPLIER: 10,
} as const;

// Dice rolling constants
export const DICE_LIMITS = {
  MAX_DICE_COUNT: 100,
  MIN_DICE_SIDES: 1,
} as const;

// Weight and encumbrance
export const ENCUMBRANCE = {
  GOLD_PIECE_WEIGHT: 1/20, // 1/20th of a pound per gold piece
  COINS_PER_CUBIC_INCH: 10, // Storage space estimation
} as const;

// Export individual constants for backward compatibility
export const DEFAULT_UNARMORED_AC = GAME_MECHANICS.DEFAULT_UNARMORED_AC;
export const DEFAULT_MOVEMENT_RATE = GAME_MECHANICS.DEFAULT_MOVEMENT_RATE;
export const LEATHER_ARMOR_MOVEMENT = GAME_MECHANICS.LEATHER_ARMOR_MOVEMENT;
export const METAL_ARMOR_MOVEMENT = GAME_MECHANICS.METAL_ARMOR_MOVEMENT;
export const MODIFIER_THRESHOLDS = GAME_MECHANICS.ABILITY_MODIFIERS;
export const DEFAULT_HIGH_MODIFIER = GAME_MECHANICS.DEFAULT_HIGH_MODIFIER;