/**
 * Enhanced type definitions for improved type safety and validation
 */

// Import existing types to avoid duplication
import type {
  Character,
  AbilityScore,
  Spell,
  Race,
  Class,
  RaceRequirement,
  SpecialAbility,
  SavingThrowBonus,
} from "./character";

// Enhanced validation types
export interface ValidationRule<T> {
  readonly name: string;
  readonly validate: (value: T) => boolean;
  readonly message: string;
}

export interface ValidationSchema<T> {
  readonly rules: ValidationRule<T>[];
  readonly required?: boolean;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

// Re-export existing types for convenience
export type {
  Character,
  AbilityScore,
  Spell,
  Race,
  Class,
  RaceRequirement,
  SpecialAbility,
  SavingThrowBonus,
};
