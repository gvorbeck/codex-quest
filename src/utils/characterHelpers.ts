import type { Character, Class } from "@/types/character";
import { allClasses } from "@/data/classes";
import { CHARACTER_CLASSES } from "@/constants/gameData";

/**
 * Returns true if the character has one or more spells.
 * @param character Character object
 */
export function hasSpells(character: Character): boolean {
  return !!(character.spells && character.spells.length > 0);
}

/**
 * Returns true if the character has one or more cantrips.
 * @param character Character object
 */
export function hasCantrips(character: Character): boolean {
  return !!(character.cantrips && character.cantrips.length > 0);
}

/**
 * Utility to get a class by ID from a list (defaults to allClasses)
 */
export function getClassById(
  classId: string,
  classes: Class[] = allClasses
): Class | undefined {
  return classes.find((c) => c.id === classId);
}

/**
 * Utility to get a class by ID from availableClasses (deduplication helper)
 */
export function getClassFromAvailable(
  classId: string,
  availableClasses: Class[]
): Class | undefined {
  return availableClasses.find((c) => c.id === classId);
}

/**
 * Utility functions for working with custom classes and races
 */

/**
 * Spell system types for character classification
 */
export type SpellSystemType = "magic-user" | "cleric" | "custom" | "none";

/**
 * Determine the spell system type for a character based on their classes
 * Handles both standard classes (via classType) and custom classes (via character data)
 *
 * @param character - The character object
 * @returns The type of spell system the character uses
 */
export function getCharacterSpellSystemType(
  character: Character
): SpellSystemType {
  if (!character.class.length) return "none";
  if (hasCustomClasses(character)) {
    return "custom";
  }

  // For standard classes, use classType property
  const spellcastingClass = character.class.find((classId) => {
    const classData = getClassById(classId);
    return (
      classData?.classType === CHARACTER_CLASSES.MAGIC_USER ||
      classData?.classType === CHARACTER_CLASSES.CLERIC
    );
  });

  if (!spellcastingClass) return "none";

  const classData = getClassById(spellcastingClass);
  return classData?.classType === CHARACTER_CLASSES.MAGIC_USER
    ? "magic-user"
    : classData?.classType === CHARACTER_CLASSES.CLERIC
    ? "cleric"
    : "none";
}

/**
 * Consolidated spellcasting detection - checks if any character class has spellcasting
 * Works for both standard classes (checks spellcasting property) and custom classes
 */
export function canCastSpells(character: Character): boolean {
  return character.class.some((classId) => {
    // Check if it's a custom class
    if (isCustomClass(classId)) {
      return hasSpells(character);
    }

    // Standard class - check spellcasting property
    const standardClass = getClassById(classId);
    return standardClass?.spellcasting !== undefined;
  });
}

/**
 * Get the first spellcasting class from a character's classes
 */
export function getFirstSpellcastingClass(character: Character): string | null {
  for (const classId of character.class) {
    // Check if it's a custom class
    if (isCustomClass(classId)) {
      if (hasSpells(character)) {
        return classId;
      }
      continue;
    }

    // Standard class - check spellcasting property
    const standardClass = getClassById(classId);
    if (standardClass?.spellcasting) {
      return classId;
    }
  }
  return null;
}

/**
 * Check if a character has any custom classes (not found in allClasses)
 * (simplified)
 */
export function hasCustomClasses(character: Character): boolean {
  return character.class.some((classId) => isCustomClass(classId));
}

/**
 * Check if a class ID represents a custom class (not found in allClasses)
 * This is the consolidated pattern for detecting custom classes
 * (simplified)
 */
export function isCustomClass(classId: string): boolean {
  return !getClassById(classId);
}

/**
 * Get custom class data for a given class ID
 * Currently uses character.customClasses, but will eventually work with
 * custom classes stored directly in character.class array
 */
export function getCustomClass(character: Character, classId: string) {
  if (!isCustomClass(classId)) {
    return null;
  }
  return character.class[0] || null;
}

/**
 * Get class name by ID, handling both standard and custom classes
 */
export function getClassName(character: Character, classId: string): string {
  // Check if it's a custom class first
  if (isCustomClass(classId)) {
    const customClass = getCustomClass(character, classId);
    return customClass || classId;
  }

  // Standard class
  const classData = getClassById(classId);
  return classData?.name || classId;
}

/**
 * Check if character has any classes of a specific type (magic-user or cleric)
 */
export function hasClassType(character: Character, classType: string): boolean {
  return character.class.some((classId) => {
    // Custom classes are handled separately by spell system type
    if (isCustomClass(classId)) {
      return false; // Custom class type checking handled elsewhere
    }

    const classData = getClassById(classId);
    return classData?.classType === classType;
  });
}

/**
 * Check if a character uses a custom race
 */
export function isCustomRace(character: Character): boolean {
  return character.race === "custom";
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

  // Find standard class first
  const standardClass = getClassFromAvailable(primaryClassId, availableClasses);

  if (standardClass) {
    return {
      ...standardClass,
      isCustom: false,
    };
  }

  // Must be custom class (not found in allClasses)
  return isCustomClass(primaryClassId || "")
    ? {
        id: primaryClassId,
        name: primaryClassId,
        hitDie: character.hp.die || "1d6",
        usesSpells: hasSpells(character),
        isCustom: true,
      }
    : null;
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
  if (!primaryClassInfo.id) return false;
  const standardClass = getClassFromAvailable(
    primaryClassInfo.id,
    availableClasses
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

/**
 * Calculate spell slots for a character based on their class and level
 */
export function getSpellSlots(
  character: Character,
  availableClasses: Class[]
): Record<number, number> {
  const spellSlots: Record<number, number> = {};

  for (const classId of character.class) {
    // Skip custom classes for now - they would need custom spell slot implementation
    if (isCustomClass(classId)) {
      if (hasSpells(character)) {
        // For custom classes, we could provide basic spell slot progression
        // For now, assume they get spell slots like a magic-user
        const magicUserClass = getClassFromAvailable(
          "magic-user",
          availableClasses
        );
        if (magicUserClass?.spellcasting) {
          const slotsForLevel =
            magicUserClass.spellcasting.spellsPerLevel[character.level];
          if (slotsForLevel) {
            slotsForLevel.forEach((slots, spellLevel) => {
              if (slots > 0) {
                const level = spellLevel + 1; // spellLevel is 0-indexed, actual spell levels are 1-indexed
                spellSlots[level] = Math.max(spellSlots[level] || 0, slots);
              }
            });
          }
        }
      }
      continue;
    }

    // Find the class data
    const classData = getClassFromAvailable(classId, availableClasses);
    if (!classData?.spellcasting) continue;

    const slotsForLevel =
      classData.spellcasting.spellsPerLevel[character.level];
    if (slotsForLevel) {
      slotsForLevel.forEach((slots, spellLevel) => {
        if (slots > 0) {
          const level = spellLevel + 1; // spellLevel is 0-indexed, actual spell levels are 1-indexed
          spellSlots[level] = Math.max(spellSlots[level] || 0, slots);
        }
      });
    }
  }

  return spellSlots;
}
