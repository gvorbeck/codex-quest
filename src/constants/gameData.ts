/**
 * Constants for game data - character classes, races, equipment, etc.
 */

/**
 * Standard character classes
 */
export const CHARACTER_CLASSES = {
  MAGIC_USER: "magic-user",
  FIGHTER: "fighter",
  CLERIC: "cleric",
  THIEF: "thief",
  ASSASSIN: "assassin",
  BARBARIAN: "barbarian",
  DRUID: "druid",
  ILLUSIONIST: "illusionist",
  NECROMANCER: "necromancer",
  RANGER: "ranger",
  PALADIN: "paladin",
  SCOUT: "scout",
  SPELLCRAFTER: "spellcrafter",
} as const;

/**
 * Equipment categories used throughout the application
 */
export const EQUIPMENT_CATEGORIES = {
  GENERAL: "general-equipment",
  SWORDS: "swords",
  AXES: "axes",
  BOWS: "bows", 
  DAGGERS: "daggers",
  HAMMERS_AND_MACES: "hammers-and-maces",
  CHAIN_AND_FLAIL: "chain-and-flail",
  SPEARS_AND_POLEARMS: "spears-and-polearms",
  SLINGS_AND_HURLED_WEAPONS: "slings-and-hurled-weapons",
  OTHER_WEAPONS: "other-weapons",
  IMPROVISED_WEAPONS: "improvised-weapons",
  BEASTS_OF_BURDEN: "beasts-of-burden",
  BARDING: "barding",
} as const;

/**
 * Currency types
 */
export const CURRENCY_TYPES = {
  GOLD: "gp",
  SILVER: "sp",
  COPPER: "cp",
  ELECTRUM: "ep",
  PLATINUM: "pp",
} as const;

// Removed unused constants: WEAPON_TYPES, EQUIPMENT_SIZES, HIT_DICE_TYPES

export type CharacterClass = (typeof CHARACTER_CLASSES)[keyof typeof CHARACTER_CLASSES];
export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[keyof typeof EQUIPMENT_CATEGORIES];
export type CurrencyType = (typeof CURRENCY_TYPES)[keyof typeof CURRENCY_TYPES];
// Removed unused types: WeaponType, EquipmentSize, HitDiceType