import type { Spell } from "@/types/character";
import spellsData from "@/data/spells.json";

export const allSpells: Spell[] = spellsData as Spell[];

/**
 * Get all spells available to a specific class at a given level
 */
export function getSpellsForClass(classId: string, level: number): Spell[] {
  return allSpells.filter((spell) => {
    const spellLevel = spell.level[classId as keyof typeof spell.level];
    return spellLevel === level;
  });
}

/**
 * Get all first level spells available to a class (excluding Read Magic for magic-users)
 */
export function getFirstLevelSpellsForClass(classId: string): Spell[] {
  const firstLevelSpells = getSpellsForClass(classId, 1);

  // For magic-users, exclude Read Magic since they automatically know it
  if (classId === "magic-user") {
    return firstLevelSpells.filter((spell) => spell.name !== "Read Magic");
  }

  return firstLevelSpells;
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
