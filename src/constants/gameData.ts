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
  PLATINUM: "pp",
  GOLD: "gp",
  ELECTRUM: "ep",
  SILVER: "sp",
  COPPER: "cp",
} as const;

/**
 * Badge variant mapping for special abilities
 */
export const ABILITY_BADGE_VARIANTS = {
  darkvision: "primary",
  "turn undead": "warning",
  "sneak attack": "danger",
  backstab: "danger",
  immunity: "success",
  detect: "supplemental",
  "secret door": "supplemental",
  spellcasting: "status",
  rage: "danger",
  tracking: "supplemental",
  stealth: "status",
  hide: "status",
  climb: "status",
  "move silently": "status",
  "ghoul immunity": "success",
} as const;

export type CharacterClass =
  (typeof CHARACTER_CLASSES)[keyof typeof CHARACTER_CLASSES];
export type EquipmentCategory =
  (typeof EQUIPMENT_CATEGORIES)[keyof typeof EQUIPMENT_CATEGORIES];
export type CurrencyType = (typeof CURRENCY_TYPES)[keyof typeof CURRENCY_TYPES];
export type AbilityBadgeVariant = keyof typeof ABILITY_BADGE_VARIANTS;
// Removed unused types: WeaponType, EquipmentSize, HitDiceType
