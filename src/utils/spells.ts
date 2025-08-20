import type { Spell } from "@/types/character";
import { loadSpellsForClass } from "@/services/dataLoader";

/**
 * Get all spells available to a specific class at a given level
 */
export async function getSpellsForClass(
  classId: string,
  level: number
): Promise<Spell[]> {
  return await loadSpellsForClass(classId, level);
}

/**
 * Get all first level spells available to a class (excluding Read Magic for magic-users)
 */
export async function getFirstLevelSpellsForClass(
  classId: string
): Promise<Spell[]> {
  return await loadSpellsForClass(classId, 1);
}

/**
 * Check if a class has spellcasting ability
 */
export function hasSpellcasting(classData: {
  spellcasting?: unknown;
}): boolean {
  return !!classData.spellcasting;
}

/**
 * Check if any of the character's classes have spellcasting
 */
export function characterHasSpellcasting(
  character: { class: string[] },
  allClasses: Array<{ id: string; spellcasting?: unknown }>
): boolean {
  return character.class.some((classId) => {
    const classData = allClasses.find((cls) => cls.id === classId);
    return classData && hasSpellcasting(classData);
  });
}

/**
 * Get the first spellcasting class from a character's classes
 */
export function getSpellcastingClass(
  character: { class: string[] },
  allClasses: Array<{ id: string; spellcasting?: unknown }>
): string | null {
  for (const classId of character.class) {
    const classData = allClasses.find((cls) => cls.id === classId);
    if (classData && hasSpellcasting(classData)) {
      return classId;
    }
  }
  return null;
}
