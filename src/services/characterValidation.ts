/*
 * Shared validation service to reduce duplication across step components
 * Consolidates common validation patterns and error handling
 */

import type { Character, Race, Class } from "@/types/character";
import type { ValidationResult } from "@/types/enhanced";
import {
  hasValidAbilityScores,
  hasValidHitPoints,
  hasRequiredStartingSpells,
  isRaceEligible,
  isCurrentClassStillValid,
  getEligibleRaces,
} from "@/utils/characterValidation";

/*
 * Centralized validation service for character creation steps
 * Reduces duplication and provides consistent validation across components
 */
export class CharacterValidationService {
  availableRaces: Race[];
  availableClasses: Class[];

  constructor(availableRaces: Race[], availableClasses: Class[]) {
    this.availableRaces = availableRaces;
    this.availableClasses = availableClasses;
  }

  /*
   * Validates ability scores step
   */
  validateAbilitiesStep(character: Character): ValidationResult {
    const isValid = hasValidAbilityScores(character);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!isValid) {
      errors.push("Please roll or set all ability scores before proceeding.");
    }

    // Provide warnings about races that won't be available
    if (isValid) {
      const eligibleRaces = getEligibleRaces(character, this.availableRaces);
      if (eligibleRaces.length === 0) {
        warnings.push(
          "Warning: Current ability scores don't meet requirements for any available races."
        );
      } else if (eligibleRaces.length < this.availableRaces.length) {
        const ineligibleRaces = this.availableRaces.filter(
          (race) => !eligibleRaces.some((eligible) => eligible.id === race.id)
        );
        warnings.push(
          `Note: ${ineligibleRaces
            .map((r) => r.name)
            .join(", ")} won't be available with current scores.`
        );
      }
    }

    return { isValid, errors, warnings };
  }

  /*
   * Validates race selection step
   */
  validateRaceStep(character: Character): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!character.race || character.race.trim().length === 0) {
      return {
        isValid: false,
        errors: ["Please select a race for your character"],
        warnings,
      };
    }

    const selectedRace = this.availableRaces.find(
      (r) => r.id === character.race
    );
    if (!selectedRace) {
      return {
        isValid: false,
        errors: ["Selected race is not available"],
        warnings,
      };
    }

    // Check if character meets race requirements
    const meetsRequirements = isRaceEligible(character, selectedRace);
    if (!meetsRequirements) {
      errors.push(
        `Character doesn't meet ability requirements for ${selectedRace.name}`
      );
    }

    return {
      isValid: meetsRequirements,
      errors,
      warnings,
    };
  }

  /*
   * Validates class selection step
   */
  validateClassStep(character: Character): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!character.class || character.class.length === 0) {
      return {
        isValid: false,
        errors: ["Please select at least one class for your character"],
        warnings,
      };
    }

    // Check if race is selected first
    if (!character.race) {
      return {
        isValid: false,
        errors: ["Please select a race before choosing classes"],
        warnings,
      };
    }

    const selectedRace = this.availableRaces.find(
      (r) => r.id === character.race
    );
    if (!selectedRace) {
      return {
        isValid: false,
        errors: ["Selected race is not available"],
        warnings,
      };
    }

    // Check if all classes are valid for the race
    const classesStillValid = isCurrentClassStillValid(
      character,
      selectedRace,
      this.availableClasses
    );

    if (!classesStillValid) {
      errors.push(`Selected classes are not allowed for ${selectedRace.name}`);
    }

    // Check for required starting spells
    const hasRequiredSpells = hasRequiredStartingSpells(
      character,
      this.availableClasses
    );
    if (!hasRequiredSpells) {
      const isMagicUser = character.class.includes("magic-user");
      if (isMagicUser) {
        errors.push(
          "Magic-Users must select one first level spell (Read Magic is automatically known)."
        );
      } else {
        errors.push("Please select required starting spells for your class.");
      }
    }

    return {
      isValid: classesStillValid && hasRequiredSpells,
      errors,
      warnings,
    };
  }

  /*
   * Validates hit points step
   */
  validateHitPointsStep(character: Character): ValidationResult {
    const isValid = hasValidHitPoints(character);
    const errors: string[] = [];

    if (!isValid) {
      errors.push("Please roll or set your hit points before proceeding.");
    }

    return {
      isValid,
      errors,
      warnings: [],
    };
  }

  /*
   * Validates equipment step (currently optional)
   */
  validateEquipmentStep(): ValidationResult {
    // Equipment is optional, so always valid
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  }

  /*
   * Validates review step (name validation)
   */
  validateReviewStep(character: Character): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!character.name || character.name.trim().length === 0) {
      errors.push("Character must have a name");
    } else if (character.name.trim().length < 2) {
      errors.push("Character name must be at least 2 characters long");
    } else if (character.name.trim().length > 50) {
      errors.push("Character name must be 50 characters or less");
    } else if (!/^[a-zA-Z\s\-'.]+$/.test(character.name.trim())) {
      errors.push(
        "Character name can only contain letters, spaces, hyphens, apostrophes, and periods"
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /*
   * Gets validation message for a specific step
   */
  getStepValidationMessage(step: number, character: Character): string {
    switch (step) {
      case 0: // Abilities step
        return this.validateAbilitiesStep(character).errors[0] || "";
      case 1: // Race step
        return this.validateRaceStep(character).errors[0] || "";
      case 2: // Class step
        return this.validateClassStep(character).errors[0] || "";
      case 3: // Hit Points step
        return this.validateHitPointsStep(character).errors[0] || "";
      case 4: // Equipment step
        return this.validateEquipmentStep().errors[0] || "";
      case 5: // Review step
        return this.validateReviewStep(character).errors[0] || "";
      default:
        return "";
    }
  }

  /*
   * Checks if next step should be disabled
   */
  isStepDisabled(step: number, character: Character): boolean {
    switch (step) {
      case 0: // Abilities step
        return !this.validateAbilitiesStep(character).isValid;
      case 1: // Race step
        return !this.validateRaceStep(character).isValid;
      case 2: // Class step
        return !this.validateClassStep(character).isValid;
      case 3: // Hit Points step
        return !this.validateHitPointsStep(character).isValid;
      case 4: // Equipment step
        return !this.validateEquipmentStep().isValid;
      case 5: // Review step
        return !this.validateReviewStep(character).isValid;
      default:
        return false;
    }
  }
}
