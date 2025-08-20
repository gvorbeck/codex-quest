import type {
  Character,
  Race,
  RaceRequirement,
  Class,
} from "@/types/character";

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
  const allClassesAllowed = character.class.every((classId) =>
    selectedRace.allowedClasses.includes(classId)
  );

  // Check if all classes exist in available classes (for supplemental content filtering)
  const allClassesExist = character.class.every((classId) =>
    availableClasses.some((cls) => cls.id === classId)
  );

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
    const classData = availableClasses.find((cls) => cls.id === classId);
    return classData?.spellcasting;
  });

  // If no spellcasting classes, spells should be cleared
  if (spellcastingClassIds.length === 0) {
    return false;
  }

  // Check if all selected spells are valid for at least one of the spellcasting classes
  return character.spells.every((spell) => {
    return spellcastingClassIds.some((classId) => {
      const spellLevel = spell.level[classId as keyof typeof spell.level];
      return spellLevel === 1; // For now, we only support 1st level spells
    });
  });
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

    // Only elves and dokkalfar can have combination classes
    const raceAllowsCombinations = ["elf", "dokkalfar"].includes(
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
      spells: undefined, // Clear spells when race becomes invalid
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
        spells: undefined, // Clear spells when classes become invalid
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
      spells: undefined, // Clear spells when they become invalid
    };
  }

  return updatedCharacter;
}
