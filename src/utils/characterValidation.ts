import type {
  Character,
  Race,
  RaceRequirement,
  Class,
  CombinationClass,
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
 * @returns true if the class is still valid, false if it should be cleared
 */
export function isCurrentClassStillValid(
  character: Character,
  selectedRace: Race,
  availableClasses: Class[]
): boolean {
  if (!character.class) return true; // No class selected, so nothing to validate

  // Check if the class is in the race's allowed classes
  const isClassAllowed = selectedRace.allowedClasses.includes(character.class);

  // Check if the class exists in available classes (for supplemental content filtering)
  const classExists = availableClasses.some(
    (cls) => cls.id === character.class
  );

  return isClassAllowed && classExists;
}

/**
 * Checks if the current combination class selection is still valid based on the selected race
 * @param character - The character to check
 * @param selectedRace - The currently selected race
 * @param availableCombinationClasses - Array of all available combination classes
 * @returns true if the combination class is still valid, false if it should be cleared
 */
export function isCurrentCombinationClassStillValid(
  character: Character,
  selectedRace: Race,
  availableCombinationClasses: CombinationClass[]
): boolean {
  if (!character.combinationClass) return true; // No combination class selected

  // Check if the race is eligible for this combination class
  const combClass = availableCombinationClasses.find(
    (cc) => cc.id === character.combinationClass
  );
  if (!combClass) return false;

  return combClass.eligibleRaces.includes(selectedRace.id);
}

/**
 * Creates a new character with invalid selections cleared based on cascade validation
 * @param character - The current character
 * @param selectedRace - The currently selected race (if any)
 * @param availableClasses - Array of all available classes
 * @param availableCombinationClasses - Array of all available combination classes
 * @returns A new character object with invalid selections cleared
 */
export function cascadeValidateCharacter(
  character: Character,
  selectedRace: Race | undefined,
  availableClasses: Class[],
  availableCombinationClasses: CombinationClass[]
): Character {
  let updatedCharacter = { ...character };

  // Step 1: Check if current race is still valid based on ability scores
  if (selectedRace && !isCurrentRaceStillValid(character, selectedRace)) {
    updatedCharacter = {
      ...updatedCharacter,
      race: "",
      class: undefined,
      combinationClass: undefined,
    };
    return updatedCharacter; // If race is invalid, all subsequent selections are also invalid
  }

  // Step 2: If race is valid, check class/combination class validity
  if (selectedRace) {
    const classStillValid = isCurrentClassStillValid(
      updatedCharacter,
      selectedRace,
      availableClasses
    );
    const combClassStillValid = isCurrentCombinationClassStillValid(
      updatedCharacter,
      selectedRace,
      availableCombinationClasses
    );

    if (!classStillValid) {
      updatedCharacter = {
        ...updatedCharacter,
        class: undefined,
      };
    }

    if (!combClassStillValid) {
      updatedCharacter = {
        ...updatedCharacter,
        combinationClass: undefined,
      };
    }
  }

  return updatedCharacter;
}
