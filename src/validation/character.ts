/**
 * Character-specific validation logic
 */

import type { Character, Race, Class } from "@/types/character";
import type {
  ValidationResult,
  CharacterValidationStep,
  CharacterValidationPipeline,
} from "./types";
import { validate, createSchema } from "./core";
import { Rules, TypeGuards } from "./rules";
import { CHARACTER_CLASSES } from "@/constants";
import {
  isCustomClass,
  hasCustomRace,
} from "@/utils/characterHelpers";
import {
  hasValidAbilityScores,
  hasValidHitPoints,
  hasRequiredStartingSpells,
  isRaceEligible,
  isCurrentClassStillValid,
  cascadeValidateCharacter,
} from "@/utils/characterValidation";

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

  if (!character.class || character.class.length === 0) {
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
    for (const classId of character.class) {
      if (isCustomClass(classId)) {
        if (!classId || classId.trim().length === 0) {
          errors.push("Please enter a name for your custom class");
        }
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
      errors.push(`Selected classes are not allowed for ${selectedRace.name}`);
    }
  }

  const hasRequiredSpells = hasRequiredStartingSpells(
    character,
    availableClasses
  );
  if (!hasRequiredSpells) {
    const isMagicUser = character.class.includes(CHARACTER_CLASSES.MAGIC_USER);
    if (isMagicUser) {
      errors.push(
        "Magic-Users must select one first level spell (Read Magic is automatically known)."
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
 * Export cascade validation for backwards compatibility
 */
export { cascadeValidateCharacter };
