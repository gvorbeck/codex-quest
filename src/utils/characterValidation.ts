import type {
  Character,
  Race,
  RaceRequirement,
  Class,
} from "@/types/character";
import type { ValidationSchema } from "@/validation";
import { Rules } from "@/validation";
import { CHARACTER_CLASSES } from "@/constants";
import { hasSpells, isCustomClass } from "@/utils/characterHelpers";
import { getClassFromAvailable } from "./characterHelpers";

/**
 * Checks if a character can equip a specific item based on their race restrictions
 * @param race - The race of the character
 * @param equipmentId - The ID of the equipment item to check
 * @returns true if the character can equip the item, false otherwise
 */
export function canEquipItem(race: Race, equipmentId: string): boolean {
  return !race.prohibitedWeapons?.includes(equipmentId);
}

/**
 * Checks if a character meets the ability score requirements for a specific race
 * @param character - The character to check
 * @param race - The race to check requirements for
 * @returns true if the character meets all requirements, false otherwise
 */
export function isRaceEligible(character: Character, race: Race): boolean {
  return race.abilityRequirements.every((req: RaceRequirement) => {
    const abilityValue = character.abilities[req.ability].value;
    const meetsMin = req.min ? abilityValue >= req.min : true;
    const meetsMax = req.max ? abilityValue <= req.max : true;
    return meetsMin && meetsMax;
  });
}

/**
 * Gets all races that a character is eligible for based on their ability scores
 * @param character - The character to check
 * @param races - Array of all available races
 * @returns Array of races the character is eligible for
 */
export function getEligibleRaces(character: Character, races: Race[]): Race[] {
  return races.filter((race) => isRaceEligible(character, race));
}

/**
 * Checks if all ability scores are within the valid range (3-18)
 * @param character - The character to validate
 * @returns true if all ability scores are between 3 and 18 (inclusive), false otherwise
 */
export function hasValidAbilityScores(character: Character): boolean {
  const abilities = Object.values(character.abilities);
  return abilities.every(
    (ability) => ability.value >= 3 && ability.value <= 18
  );
}

/**
 * Checks if the current race selection is still valid based on ability scores
 * @param character - The character to check
 * @param race - The race to validate
 * @returns true if the race is still valid, false if it should be cleared
 */
export function isCurrentRaceStillValid(
  character: Character,
  race: Race
): boolean {
  return isRaceEligible(character, race);
}

/**
 * Checks if the current class selection is still valid based on the selected race
 * @param character - The character to check
 * @param selectedRace - The currently selected race
 * @param availableClasses - Array of all available classes
 * @returns true if the classes are still valid, false if they should be cleared
 */
export function isCurrentClassStillValid(
  character: Character,
  selectedRace: Race,
  availableClasses: Class[]
): boolean {
  if (!character.class || character.class.length === 0) return true; // No classes selected

  // Check if all classes are allowed by the race
  const allClassesAllowed = character.class.every((classId) => {
    const custom = isCustomClass(classId);
    return custom || selectedRace.allowedClasses.includes(classId);
  });

  // Check if all classes exist in available classes (for supplemental content filtering)
  const allClassesExist = character.class.every((classId) => {
    const custom = isCustomClass(classId);
    return custom || availableClasses.some((cls) => cls.id === classId);
  });

  return allClassesAllowed && allClassesExist;
}

/**
 * Checks if the current spells are still valid for the selected classes
 * @param character - The character to check
 * @param availableClasses - Array of all available classes
 * @returns true if spells are valid, false if they should be cleared
 */
export function areCurrentSpellsStillValid(
  character: Character,
  availableClasses: Class[]
): boolean {
  // If no spells selected, nothing to validate
  if (!character.spells || character.spells.length === 0) {
    return true;
  }

  // Get spellcasting classes from character's class array
  const spellcastingClassIds = character.class.filter((classId) => {
    // Check if it's a custom class that uses spells
    const custom = isCustomClass(classId);
    if (custom) {
      return hasSpells(character);
    }

    // Check standard classes
    const classData = getClassFromAvailable(classId, availableClasses);
    return classData?.spellcasting;
  });

  // If no spellcasting classes, spells should be cleared
  if (spellcastingClassIds.length === 0) {
    return false;
  }

  // Check if all selected spells are valid for at least one of the spellcasting classes
  return character.spells.every((spell) => {
    return spellcastingClassIds.some((classId) => {
      // For custom classes, we allow all spells since we don't know their progression
      const custom = isCustomClass(classId);
      if (custom) {
        return true;
      }

      const spellLevel = spell.level[classId as keyof typeof spell.level];
      return spellLevel === 1; // For now, we only support 1st level spells
    });
  });
}

/**
 * Checks if spellcasting classes have their required starting spells
 * @param character - The character to validate
 * @param availableClasses - Array of all available classes
 * @returns true if all required starting spells are present, false otherwise
 */
export function hasRequiredStartingSpells(
  character: Character,
  availableClasses: Class[]
): boolean {
  if (character.class.length === 0) return true;

  // Check each class the character has
  for (const classId of character.class) {
    // Handle custom classes
    if (isCustomClass(classId)) {
      if (!hasSpells(character)) continue;

      // Custom spellcasting classes need at least one spell selected
      const spells = character.spells || [];
      if (spells.length < 1) {
        return false;
      }
      continue;
    }

    const charClass = getClassFromAvailable(classId, availableClasses);
    if (!charClass || !charClass.spellcasting) continue;

    // Magic-User-based classes start with "read magic" (automatically included) and one other 1st level spell
    const classData = getClassFromAvailable(classId, availableClasses);
    if (classData?.classType === CHARACTER_CLASSES.MAGIC_USER) {
      const spells = character.spells || [];
      const firstLevelSpells = spells.filter(
        (spell) => spell.level[classId as keyof typeof spell.level] === 1
      );

      // These classes need to select at least one 1st level spell
      // (Read Magic is automatically included and doesn't need to be selected)
      if (firstLevelSpells.length < 1) {
        return false;
      }
    }

    // Add validation for other spellcasting classes as needed
    // Clerics, Paladins, etc. may have different starting spell requirements
  }

  return true;
}

/**
 * Checks if a class combination is valid (e.g., elf/dokkalfar can only have certain combinations)
 * @param classArray - Array of class IDs
 * @param selectedRace - The currently selected race
 * @returns true if the combination is valid, false otherwise
 */
export function isValidClassCombination(
  classArray: string[],
  selectedRace: Race
): boolean {
  // Single class is always valid if allowed by race
  if (classArray.length <= 1) {
    return true;
  }

  // For multi-class combinations, check if it's a valid combination for the race
  // Currently we support fighter/magic-user and magic-user/thief for elves and dokkalfar
  if (classArray.length === 2) {
    const sortedClasses = [...classArray].sort();
    const validCombinations = [
      ["fighter", "magic-user"],
      ["magic-user", "thief"],
    ];

    const isValidCombination = validCombinations.some(
      (combo) =>
        combo.every((cls) => sortedClasses.includes(cls)) &&
        combo.length === sortedClasses.length
    );

    // Only elves, dokkalfar, and half-elves can have combination classes
    const raceAllowsCombinations = ["elf", "dokkalfar", "half-elf"].includes(
      selectedRace.id
    );

    return isValidCombination && raceAllowsCombinations;
  }

  // More than 2 classes is not currently supported
  return false;
}

/**
 * Creates a new character with invalid selections cleared based on cascade validation
 * @param character - The current character
 * @param selectedRace - The currently selected race (if any)
 * @param availableClasses - Array of all available classes
 * @returns A new character object with invalid selections cleared
 */
export function cascadeValidateCharacter(
  character: Character,
  selectedRace: Race | undefined,
  availableClasses: Class[]
): Character {
  let updatedCharacter = { ...character };

  // Step 1: Check if current race is still valid based on ability scores
  if (selectedRace && !isCurrentRaceStillValid(character, selectedRace)) {
    updatedCharacter = {
      ...updatedCharacter,
      race: "",
      class: [], // Clear classes when race becomes invalid
      spells: [], // Clear spells when race becomes invalid
    };
    return updatedCharacter; // If race is invalid, all subsequent selections are also invalid
  }

  // Step 2: If race is valid, check class validity
  if (selectedRace) {
    const classStillValid = isCurrentClassStillValid(
      updatedCharacter,
      selectedRace,
      availableClasses
    );

    const combinationValid = isValidClassCombination(
      updatedCharacter.class,
      selectedRace
    );

    if (!classStillValid || !combinationValid) {
      updatedCharacter = {
        ...updatedCharacter,
        class: [], // Clear classes when they become invalid
        spells: [], // Clear spells when classes become invalid
      };
    }
  }

  // Step 3: Check if current spells are still valid for the selected class(es)
  const spellsStillValid = areCurrentSpellsStillValid(
    updatedCharacter,
    availableClasses
  );

  if (!spellsStillValid) {
    updatedCharacter = {
      ...updatedCharacter,
      spells: [], // Clear spells when they become invalid
    };
  }

  return updatedCharacter;
}

/**
 * Checks if hit points are properly set for the character
 * @param character - The character to validate
 * @returns true if hit points are set and valid, false otherwise
 */
export function hasValidHitPoints(character: Character): boolean {
  return character.hp && character.hp.max > 0 && character.hp.current > 0;
}

// Validation Schemas - moved from validationSchemas.ts

/**
 * Individual ability score validation
 */
export const abilityScoreSchema: ValidationSchema<number> = {
  required: true,
  rules: [Rules.isValidAbilityScore, Rules.isInteger],
};

/**
 * Character name validation
 */
export const characterNameSchema: ValidationSchema<string> = {
  required: true,
  rules: [Rules.characterName],
};

/**
 * Race selection validation
 */
export const raceSelectionSchema: ValidationSchema<string> = {
  required: true,
  rules: [Rules.minLength(1)],
};

/**
 * Class selection validation
 */
export const classSelectionSchema: ValidationSchema<string[]> = {
  required: true,
  rules: [Rules.nonEmptyArray],
};

/**
 * Complete character validation schema
 */
export const characterSchema: ValidationSchema<Partial<Character>> = {
  required: true,
  rules: [
    {
      name: "hasName",
      validate: (char: Partial<Character>) =>
        typeof char.name === "string" && char.name.trim().length > 0,
      message: "Character must have a name",
    },
    {
      name: "hasAbilities",
      validate: (char: Partial<Character>) =>
        char.abilities !== undefined &&
        Object.values(char.abilities).every((ability) =>
          Rules.isValidAbilityScore.validate(ability.value)
        ),
      message: "Character must have valid ability scores",
    },
    {
      name: "hasRace",
      validate: (char: Partial<Character>) =>
        typeof char.race === "string" && char.race.length > 0,
      message: "Character must have a selected race",
    },
    {
      name: "hasClass",
      validate: (char: Partial<Character>) =>
        Array.isArray(char.class) && char.class.length > 0,
      message: "Character must have at least one selected class",
    },
  ],
};
