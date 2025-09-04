import type { Character, Class } from "@/types/character";

/**
 * Utility functions for working with custom classes and races
 */

/**
 * Check if a class ID represents a custom class
 */
export function isCustomClass(classId: string): boolean {
  return classId.startsWith("custom-");
}

/**
 * Check if a character uses a custom race
 */
export function isCustomRace(character: Character): boolean {
  return character.race === "custom";
}

/**
 * Check if a character has any custom classes
 */
export function hasCustomClasses(character: Character): boolean {
  return (
    character.class.some((classId) => isCustomClass(classId)) &&
    !!character.customClasses
  );
}

/**
 * Get custom class data for a given class ID
 */
export function getCustomClass(character: Character, classId: string) {
  if (!isCustomClass(classId) || !character.customClasses) {
    return null;
  }
  return character.customClasses[classId] || null;
}

/**
 * Get the primary class information (standard or custom)
 */
export function getPrimaryClassInfo(
  character: Character,
  availableClasses: Class[]
) {
  const primaryClassId = character.class[0];
  if (!primaryClassId) return null;

  // Check for custom class first
  if (isCustomClass(primaryClassId)) {
    const customClass = getCustomClass(character, primaryClassId);
    return customClass
      ? {
          id: primaryClassId,
          name: customClass.name,
          hitDie: customClass.hitDie || "1d6",
          usesSpells: customClass.usesSpells || false,
          isCustom: true,
        }
      : null;
  }

  // Find standard class
  const standardClass = availableClasses.find(
    (c) =>
      c.id === primaryClassId ||
      c.id.toLowerCase() === primaryClassId.toLowerCase() ||
      c.name.toLowerCase() === primaryClassId.toLowerCase()
  );

  return standardClass
    ? {
        ...standardClass,
        isCustom: false,
      }
    : null;
}

/**
 * Check if a character can cast spells (including custom spellcasting classes)
 */
export function canCastSpells(
  character: Character,
  availableClasses: Class[]
): boolean {
  return character.class.some((classId) => {
    // Check custom classes first
    if (isCustomClass(classId)) {
      const customClass = getCustomClass(character, classId);
      return customClass?.usesSpells || false;
    }

    // Check standard classes
    const classData = availableClasses.find((c) => c.id === classId);
    return classData?.spellcasting !== undefined;
  });
}

/**
 * Get the appropriate hit die for level up calculations
 */
export function getHitDie(
  character: Character,
  availableClasses: Class[]
): string {
  const primaryClassInfo = getPrimaryClassInfo(character, availableClasses);
  return primaryClassInfo?.hitDie || "1d6";
}

/**
 * Check if character can level up (handles both standard and custom classes)
 */
export function canLevelUp(
  character: Character,
  availableClasses: Class[]
): boolean {
  const primaryClassInfo = getPrimaryClassInfo(character, availableClasses);
  if (!primaryClassInfo) return false;

  // Custom classes can always level up
  if (primaryClassInfo.isCustom) {
    return true;
  }

  // Standard classes need to meet XP requirements
  const standardClass = availableClasses.find(
    (c) => c.id === primaryClassInfo.id
  );
  if (!standardClass) return false;

  const nextLevel = character.level + 1;
  const requiredXP = standardClass.experienceTable[nextLevel];
  return requiredXP !== undefined && character.xp >= requiredXP;
}

/**
 * Get spell level for a spell considering custom classes
 */
export function getSpellLevel(
  spell: { level: Record<string, number | null> },
  characterClasses: string[]
): number {
  for (const classId of characterClasses) {
    // For custom classes, use the minimum level of the spell from any valid class
    if (isCustomClass(classId)) {
      const validLevels = Object.values(spell.level).filter(
        (level) => level !== null && level !== undefined
      );
      if (validLevels.length > 0) {
        return Math.min(...(validLevels as number[]));
      }
      return 1; // Default to level 1 for custom classes if no valid levels found
    }

    const mappedClassId =
      classId === "magic-user"
        ? "magic-user"
        : (classId as keyof typeof spell.level);
    const level = spell.level[mappedClassId];
    if (level !== null && level !== undefined) {
      return level;
    }
  }
  return 0;
}
