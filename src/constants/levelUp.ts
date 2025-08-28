/**
 * Constants for level up functionality
 */

export const LEVEL_UP_CONSTANTS = {
  SPELL_DESCRIPTION_LIMIT: 150,
  LEVEL_UP_PROCESSING_DELAY: 500,
  FIXED_HP_LEVEL_THRESHOLD: 9,

  // Classes that get +2 HP per level after 9th level
  TWO_HP_CLASSES: [
    "fighter",
    "thief",
    "assassin",
    "barbarian",
    "ranger",
    "paladin",
    "scout",
  ] as const,
} as const;

export type TwoHPClass = (typeof LEVEL_UP_CONSTANTS.TWO_HP_CLASSES)[number];
