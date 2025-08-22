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

/**
 * Equipment weapon types
 */
export const WEAPON_TYPES = {
  MELEE: "melee",
  MISSILE: "missile",
  BOTH: "both",
} as const;

/**
 * Equipment sizes
 */
export const EQUIPMENT_SIZES = {
  SMALL: "S",
  MEDIUM: "M",
  LARGE: "L",
} as const;

/**
 * Hit dice types
 */
export const HIT_DICE_TYPES = {
  D4: "d4",
  D6: "d6",
  D8: "d8",
  D10: "d10",
  D12: "d12",
} as const;

export type CharacterClass = (typeof CHARACTER_CLASSES)[keyof typeof CHARACTER_CLASSES];
export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[keyof typeof EQUIPMENT_CATEGORIES];
export type CurrencyType = (typeof CURRENCY_TYPES)[keyof typeof CURRENCY_TYPES];
export type WeaponType = (typeof WEAPON_TYPES)[keyof typeof WEAPON_TYPES];
export type EquipmentSize = (typeof EQUIPMENT_SIZES)[keyof typeof EQUIPMENT_SIZES];
export type HitDiceType = (typeof HIT_DICE_TYPES)[keyof typeof HIT_DICE_TYPES];