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

// Utility types for better type safety
export type NonEmptyArray<T> = [T, ...T[]];

// Character creation step types
export type CharacterCreationStep =
  | "abilities"
  | "race"
  | "class"
  | "equipment"
  | "review";

export interface StepValidation {
  readonly step: CharacterCreationStep;
  readonly isValid: boolean;
  readonly message?: string;
}

// localStorage management types
export interface StorageOperationResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

// Component prop types for better type safety
export interface BaseComponentProps {
  readonly className?: string;
  readonly "data-testid"?: string;
}

export interface FormComponentProps extends BaseComponentProps {
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly "aria-describedby"?: string;
}

// Performance monitoring types
export interface PerformanceMetrics {
  readonly componentName: string;
  readonly renderCount: number;
  readonly averageRenderTime: number;
  readonly lastRenderTime: number;
}

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

// Character creation state machine types
export type CharacterCreationState =
  | { readonly step: "abilities"; readonly character: Partial<Character> }
  | {
      readonly step: "race";
      readonly character: Partial<Character> & {
        abilities: Character["abilities"];
      };
    }
  | {
      readonly step: "class";
      readonly character: Partial<Character> & {
        abilities: Character["abilities"];
        race: string;
      };
    }
  | {
      readonly step: "equipment";
      readonly character: Partial<Character> & {
        abilities: Character["abilities"];
        race: string;
        class: NonEmptyArray<string>;
      };
    }
  | { readonly step: "review"; readonly character: Character };

export type CharacterCreationAction =
  | {
      readonly type: "SET_ABILITIES";
      readonly abilities: Character["abilities"];
    }
  | { readonly type: "SET_RACE"; readonly race: string }
  | { readonly type: "SET_CLASS"; readonly classes: string[] }
  | { readonly type: "SET_EQUIPMENT"; readonly equipment: unknown[] }
  | { readonly type: "NEXT_STEP" }
  | { readonly type: "PREVIOUS_STEP" }
  | { readonly type: "GOTO_STEP"; readonly step: CharacterCreationStep }
  | { readonly type: "RESET" };

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
