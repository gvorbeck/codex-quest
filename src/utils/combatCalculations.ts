/**
 * Combat Calculations Utilities
 * Shared BFRPG combat mechanics: attack bonuses, saving throws, etc.
 */

import type { Character } from "@/types";
import { getClassById } from "@/utils/character";
import { CHARACTER_CLASSES } from "@/constants";

/**
 * Calculate base attack bonus from level and class
 * Based on BFRPG attack bonus progression tables
 */
export function getBaseAttackBonus(
  level: number,
  characterClass: string
): number {
  const classLower = characterClass.toLowerCase();
  const classData = getClassById(characterClass);
  const classType = classData?.classType;

  // Combination classes - use best progression per BFRPG rules
  if (classLower === "fighter-magic-user") {
    // Fighter/Magic-User uses Fighter progression (best of the two)
    if (level >= 18) return 10;
    if (level >= 16) return 9;
    if (level >= 13) return 8;
    if (level >= 11) return 7;
    if (level >= 8) return 6;
    if (level >= 7) return 5;
    if (level >= 5) return 4;
    if (level >= 4) return 3;
    if (level >= 2) return 2;
    if (level >= 1) return 1;
    return 0;
  }

  if (classLower === "magic-user-thief") {
    // Magic-User/Thief uses Thief progression (best of the two)
    if (level >= 18) return 8;
    if (level >= 15) return 7;
    if (level >= 12) return 6;
    if (level >= 9) return 5;
    if (level >= 7) return 4;
    if (level >= 5) return 3;
    if (level >= 3) return 2;
    if (level >= 1) return 1;
    return 0;
  }

  // Fighter-type classes (Fighter, Barbarian, Ranger, Paladin)
  if (classType === CHARACTER_CLASSES.FIGHTER) {
    if (level >= 18) return 10;
    if (level >= 16) return 9;
    if (level >= 13) return 8;
    if (level >= 11) return 7;
    if (level >= 8) return 6;
    if (level >= 7) return 5;
    if (level >= 5) return 4;
    if (level >= 4) return 3;
    if (level >= 2) return 2;
    if (level >= 1) return 1;
    return 0;
  }

  // Cleric-type and Thief-type classes
  if (
    classType === CHARACTER_CLASSES.CLERIC ||
    classType === CHARACTER_CLASSES.THIEF
  ) {
    if (level >= 18) return 8;
    if (level >= 15) return 7;
    if (level >= 12) return 6;
    if (level >= 9) return 5;
    if (level >= 7) return 4;
    if (level >= 5) return 3;
    if (level >= 3) return 2;
    if (level >= 1) return 1;
    return 0;
  }

  // Magic-User-type classes
  if (classType === CHARACTER_CLASSES.MAGIC_USER) {
    if (level >= 19) return 7;
    if (level >= 16) return 6;
    if (level >= 13) return 5;
    if (level >= 9) return 4;
    if (level >= 6) return 3;
    if (level >= 4) return 2;
    if (level >= 1) return 1;
    return 0;
  }

  return 0;
}

/**
 * Saving throw table entry
 * [Death Ray, Magic Wands, Paralysis, Dragon Breath, Spells]
 */
type SavingThrowEntry = {
  minLevel: number;
  saves: [number, number, number, number, number];
};

const CLERIC_TYPE_SAVES: SavingThrowEntry[] = [
  { minLevel: 20, saves: [5, 6, 9, 11, 10] },
  { minLevel: 18, saves: [6, 7, 9, 11, 10] },
  { minLevel: 16, saves: [6, 7, 10, 12, 11] },
  { minLevel: 14, saves: [7, 8, 10, 12, 11] },
  { minLevel: 12, saves: [7, 8, 11, 13, 12] },
  { minLevel: 10, saves: [8, 9, 11, 13, 12] },
  { minLevel: 8, saves: [8, 9, 12, 14, 13] },
  { minLevel: 6, saves: [9, 10, 12, 14, 13] },
  { minLevel: 4, saves: [9, 10, 13, 15, 14] },
  { minLevel: 2, saves: [10, 11, 13, 15, 14] },
  { minLevel: 1, saves: [11, 12, 14, 16, 15] },
];

const MAGIC_USER_TYPE_SAVES: SavingThrowEntry[] = [
  { minLevel: 20, saves: [8, 6, 5, 11, 8] },
  { minLevel: 18, saves: [9, 7, 6, 11, 9] },
  { minLevel: 16, saves: [9, 8, 7, 12, 9] },
  { minLevel: 14, saves: [10, 9, 8, 12, 10] },
  { minLevel: 12, saves: [10, 10, 9, 13, 11] },
  { minLevel: 10, saves: [11, 10, 9, 13, 11] },
  { minLevel: 8, saves: [11, 11, 10, 14, 12] },
  { minLevel: 6, saves: [12, 12, 11, 14, 13] },
  { minLevel: 4, saves: [12, 13, 12, 15, 13] },
  { minLevel: 2, saves: [13, 14, 13, 15, 14] },
  { minLevel: 1, saves: [13, 14, 13, 16, 15] },
];

const FIGHTER_TYPE_SAVES: SavingThrowEntry[] = [
  { minLevel: 20, saves: [5, 6, 8, 9, 10] },
  { minLevel: 18, saves: [6, 7, 8, 10, 11] },
  { minLevel: 16, saves: [7, 7, 9, 10, 11] },
  { minLevel: 14, saves: [7, 8, 10, 11, 12] },
  { minLevel: 12, saves: [8, 9, 10, 12, 13] },
  { minLevel: 10, saves: [9, 9, 11, 12, 13] },
  { minLevel: 8, saves: [9, 10, 12, 13, 14] },
  { minLevel: 6, saves: [10, 11, 12, 14, 15] },
  { minLevel: 4, saves: [11, 12, 13, 14, 15] },
  { minLevel: 2, saves: [11, 12, 14, 15, 16] },
  { minLevel: 1, saves: [12, 13, 14, 15, 17] },
];

const THIEF_TYPE_SAVES: SavingThrowEntry[] = [
  { minLevel: 20, saves: [6, 8, 8, 6, 8] },
  { minLevel: 18, saves: [7, 9, 8, 7, 9] },
  { minLevel: 16, saves: [7, 9, 9, 8, 9] },
  { minLevel: 14, saves: [8, 10, 9, 9, 10] },
  { minLevel: 12, saves: [9, 10, 10, 10, 11] },
  { minLevel: 10, saves: [9, 12, 10, 11, 11] },
  { minLevel: 8, saves: [10, 12, 11, 12, 12] },
  { minLevel: 6, saves: [11, 13, 11, 13, 13] },
  { minLevel: 4, saves: [11, 13, 12, 14, 13] },
  { minLevel: 2, saves: [12, 14, 12, 15, 14] },
  { minLevel: 1, saves: [13, 14, 13, 16, 15] },
];

/**
 * Map classes to their saving throw table type
 */
const CLASS_TO_SAVE_TABLE: Record<string, SavingThrowEntry[]> = {
  // Cleric-type classes
  cleric: CLERIC_TYPE_SAVES,
  druid: CLERIC_TYPE_SAVES,
  // Magic-User-type classes
  "magic-user": MAGIC_USER_TYPE_SAVES,
  illusionist: MAGIC_USER_TYPE_SAVES,
  necromancer: MAGIC_USER_TYPE_SAVES,
  spellcrafter: MAGIC_USER_TYPE_SAVES,
  // Fighter-type classes
  fighter: FIGHTER_TYPE_SAVES,
  barbarian: FIGHTER_TYPE_SAVES,
  ranger: FIGHTER_TYPE_SAVES,
  paladin: FIGHTER_TYPE_SAVES,
  // Thief-type classes
  thief: THIEF_TYPE_SAVES,
  assassin: THIEF_TYPE_SAVES,
  scout: THIEF_TYPE_SAVES,
};

/**
 * Get base saving throws for a character before racial modifiers
 */
export function getBaseSavingThrows(
  level: number,
  characterClass: string
): [number, number, number, number, number] {
  const DEFAULT_SAVES: [number, number, number, number, number] = [
    12, 13, 14, 15, 17,
  ];

  const classLower = characterClass.toLowerCase();
  const classTable = CLASS_TO_SAVE_TABLE[classLower] || FIGHTER_TYPE_SAVES;
  const entry = classTable.find((e) => level >= e.minLevel);

  return entry?.saves || DEFAULT_SAVES;
}

/**
 * Get racial saving throw bonuses
 * Returns array of bonuses [Death Ray, Wands, Paralysis, Breath, Spells]
 */
export function getRacialSavingThrowBonuses(
  race: string
): [number, number, number, number, number] {
  const bonuses: [number, number, number, number, number] = [0, 0, 0, 0, 0];

  switch (race.toLowerCase()) {
    case "dwarf":
      bonuses[0] = 4; // Death Ray
      bonuses[1] = 4; // Wands
      bonuses[2] = 4; // Paralysis
      bonuses[3] = 3; // Breath
      bonuses[4] = 4; // Spells
      break;
    case "elf":
      bonuses[1] = 2; // Wands
      bonuses[2] = 1; // Paralysis
      bonuses[4] = 2; // Spells
      break;
    case "halfling":
      bonuses[0] = 4; // Death Ray
      bonuses[1] = 4; // Wands
      bonuses[2] = 4; // Paralysis
      bonuses[3] = 3; // Breath
      bonuses[4] = 4; // Spells
      break;
  }

  return bonuses;
}

/**
 * Calculate final saving throws including racial bonuses
 */
export function getSavingThrows(character: Character): {
  deathRay: number;
  magicWands: number;
  paralysis: number;
  dragonBreath: number;
  spells: number;
} {
  const baseSaves = getBaseSavingThrows(character.level, character.class);
  const racialBonuses = getRacialSavingThrowBonuses(character.race);

  // Apply racial bonuses (bonuses reduce the target number, minimum of 1)
  const finalSaves = baseSaves.map((base, i) =>
    Math.max(1, base - (racialBonuses[i] || 0))
  );

  return {
    deathRay: finalSaves[0] ?? 12,
    magicWands: finalSaves[1] ?? 13,
    paralysis: finalSaves[2] ?? 14,
    dragonBreath: finalSaves[3] ?? 15,
    spells: finalSaves[4] ?? 16,
  };
}
