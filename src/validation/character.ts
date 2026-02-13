/**
 * Character-specific validation logic
 */

import type { Character, Race, Class } from "@/types";
import type {
  ValidationResult,
  CharacterValidationStep,
  CharacterValidationPipeline,
} from "@/types/validation";
import { validate, createSchema } from "./core";
import { Rules, TypeGuards } from "./rules";
import { CHARACTER_CLASSES } from "@/constants";
import {
  getClassById,
  hasCustomRace,
  hasRequiredStartingSpells,
  hasValidAbilityScores,
  hasValidHitPoints,
  isCurrentClassStillValid,
  isCustomClass,
  isRaceEligible,
} from "@/utils";

/**
 * Character validation steps
 */
export function createCharacterValidationSteps(
  availableRaces: Race[],
  availableClasses: Class[]
): CharacterValidationStep[] {
  return [
    {
      step: 0,
      name: "Abilities",
      validate: (character: unknown) =>
        validateAbilitiesStep(character as Character),
    },
    {
      step: 1,
      name: "Race",
      validate: (character: unknown) =>
        validateRaceStep(character as Character, availableRaces),
    },
    {
      step: 2,
      name: "Class",
      validate: (character: unknown) =>
        validateClassStep(
          character as Character,
          availableRaces,
          availableClasses
        ),
    },
    {
      step: 3,
      name: "Hit Points",
      validate: (character: unknown) =>
        validateHitPointsStep(character as Character),
    },
    {
      step: 4,
      name: "Equipment",
      validate: () => validateEquipmentStep(),
    },
    {
      step: 5,
      name: "Review",
      validate: (character: unknown) =>
        validateReviewStep(character as Character),
    },
  ];
}

/**
 * Create character validation pipeline
 */
export function createCharacterValidationPipeline(
  availableRaces: Race[],
  availableClasses: Class[]
): CharacterValidationPipeline {
  const steps = createCharacterValidationSteps(
    availableRaces,
    availableClasses
  );

  return {
    steps,
    validateStep: (step: number, character: unknown) => {
      const validationStep = steps[step];
      return validationStep
        ? validationStep.validate(character)
        : { isValid: true, errors: [], warnings: [] };
    },
    isStepDisabled: (step: number, character: unknown) => {
      const validationStep = steps[step];
      return validationStep
        ? !validationStep.validate(character).isValid
        : false;
    },
  };
}

/**
 * Step validation functions
 */
function validateAbilitiesStep(character: Character): ValidationResult {
  const isValid = hasValidAbilityScores(character);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isValid) {
    errors.push("Please roll or set all ability scores before proceeding.");
  }

  return { isValid, errors, warnings };
}

function validateRaceStep(
  character: Character,
  availableRaces: Race[]
): ValidationResult {
  const schema = createSchema([Rules.validRace(availableRaces)], true);

  const baseResult = validate(character.race, schema);

  if (!baseResult.isValid) {
    return baseResult;
  }

  // Handle custom races
  if (hasCustomRace(character)) {
    // Custom races have no ability requirements and are always valid
    // The race name is stored directly in character.race
    return { isValid: true, errors: [], warnings: [] };
  }

  const selectedRace = availableRaces.find((r) => r.id === character.race);
  if (!selectedRace) {
    return {
      isValid: false,
      errors: ["Selected race is not available"],
      warnings: [],
    };
  }

  const meetsRequirements = isRaceEligible(character, selectedRace);
  if (!meetsRequirements) {
    return {
      isValid: false,
      errors: [
        `Character doesn't meet ability requirements for ${selectedRace.name}`,
      ],
      warnings: [],
    };
  }

  return { isValid: true, errors: [], warnings: [] };
}

function validateClassStep(
  character: Character,
  availableRaces: Race[],
  availableClasses: Class[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!character.class) {
    return {
      isValid: false,
      errors: ["Please select a class for your character"],
      warnings,
    };
  }

  if (!character.race) {
    return {
      isValid: false,
      errors: ["Please select a race before choosing classes"],
      warnings,
    };
  }

  // Handle custom races - they have no class restrictions
  if (hasCustomRace(character)) {
    // Custom races can use any class, no validation needed for race restrictions
    // Still need to validate that custom classes have names if they exist
    if (isCustomClass(character.class)) {
      if (!character.class || character.class.trim().length === 0) {
        errors.push("Please enter a name for your custom class");
      }
    }
  } else {
    const selectedRace = availableRaces.find((r) => r.id === character.race);
    if (!selectedRace) {
      return {
        isValid: false,
        errors: ["Selected race is not available"],
        warnings,
      };
    }

    const classesStillValid = isCurrentClassStillValid(
      character,
      selectedRace,
      availableClasses
    );
    if (!classesStillValid) {
      errors.push(`Selected class is not allowed for ${selectedRace.name}`);
    }
  }

  const hasRequiredSpells = hasRequiredStartingSpells(
    character,
    availableClasses
  );
  if (!hasRequiredSpells) {
    const classData = getClassById(character.class);
    if (classData?.classType === CHARACTER_CLASSES.MAGIC_USER) {
      const label = classData.id.includes("illusionist") ? "Illusionists" : "Magic-Users";
      errors.push(
        `${label} must select one first level spell (Read Magic is automatically known).`
      );
    } else {
      errors.push("Please select required starting spells for your class.");
    }
  }

  // For custom races, we don't use classesStillValid check
  const isValidClass = hasCustomRace(character)
    ? true
    : availableRaces.find((r) => r.id === character.race)
    ? isCurrentClassStillValid(
        character,
        availableRaces.find((r) => r.id === character.race)!,
        availableClasses
      )
    : false;

  return {
    isValid: errors.length === 0 && isValidClass && hasRequiredSpells,
    errors,
    warnings,
  };
}

function validateHitPointsStep(character: Character): ValidationResult {
  const isValid = hasValidHitPoints(character);
  const errors: string[] = [];

  if (!isValid) {
    errors.push("Please roll or set your hit points before proceeding.");
  }

  return { isValid, errors, warnings: [] };
}

function validateEquipmentStep(): ValidationResult {
  // Equipment is optional
  return { isValid: true, errors: [], warnings: [] };
}

function validateReviewStep(character: Character): ValidationResult {
  if (!character.name || character.name.trim().length === 0) {
    return validate("", createSchema([Rules.characterName], true));
  }

  return validate(character.name, createSchema([Rules.characterName], true));
}

/**
 * Comprehensive character validation
 */
export function validateCharacter(
  character: unknown,
  availableRaces: Race[],
  availableClasses: Class[]
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  // Basic structure validation
  if (typeof character !== "object" || character === null) {
    return {
      isValid: false,
      errors: ["Character must be an object"],
      warnings: [],
    };
  }

  const char = character as Record<string, unknown>;

  // Validate abilities structure
  const abilitiesResult = validate(
    character,
    createSchema([TypeGuards.hasValidAbilitiesStructure])
  );
  if (!abilitiesResult.isValid) {
    return {
      isValid: false,
      errors: ["Invalid abilities structure"],
      warnings: [],
    };
  }

  // Validate race
  if (typeof char["race"] === "string") {
    const raceResult = validate(
      char["race"],
      createSchema([Rules.validRace(availableRaces)])
    );
    if (!raceResult.isValid) {
      return {
        isValid: false,
        errors: ["Invalid race selection"],
        warnings: [],
      };
    }
  }

  // Validate class array
  if (Array.isArray(char["class"])) {
    const classResult = validate(
      char["class"],
      createSchema([Rules.validClassArray(availableClasses)])
    );
    if (!classResult.isValid) {
      return {
        isValid: false,
        errors: ["Invalid class selection"],
        warnings: [],
      };
    }
  }

  return result;
}

/**
 * Validate that imported data has the basic structure of a Character
 * Used for import validation before migration
 */
export function isValidCharacterStructure(data: unknown): data is Character {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Check for required fields
  return (
    typeof obj["name"] === "string" &&
    "abilities" in obj &&
    typeof obj["abilities"] === "object" &&
    obj["abilities"] !== null &&
    typeof obj["race"] === "string" &&
    typeof obj["class"] === "string" &&
    "hp" in obj &&
    typeof obj["hp"] === "object" &&
    obj["hp"] !== null &&
    typeof obj["level"] === "number"
  );
}

/**
 * Validate character data integrity after import
 * Returns detailed validation errors for user feedback
 */
export function validateImportedCharacter(character: Character): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate ability scores
  if (!hasValidAbilityScores(character)) {
    errors.push("Invalid ability scores (must be between 3-18)");
  }

  // Validate HP
  if (!hasValidHitPoints(character)) {
    errors.push("Invalid hit points (must be greater than 0)");
  }

  // Validate name
  if (!character.name || character.name.trim() === "") {
    errors.push("Character name is required");
  }

  // Validate level
  if (character.level < 1 || character.level > 20) {
    errors.push("Character level must be between 1 and 20");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
