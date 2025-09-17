/**
 * Unified validation type definitions
 * Consolidates ValidationResult interfaces from multiple files
 */

export interface ValidationRule<T = unknown> {
  readonly name: string;
  readonly validate: (value: T) => boolean;
  readonly message: string;
}

export interface ValidationSchema<T = unknown> {
  readonly rules: ValidationRule<T>[];
  readonly required?: boolean;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

export interface ValidationContext {
  readonly isDevelopment: boolean;
  readonly skipTypeGuards?: boolean;
}

// Character-specific validation types
export interface CharacterValidationStep {
  readonly step: number;
  readonly name: string;
  readonly validate: (character: unknown) => ValidationResult;
}

export interface CharacterValidationPipeline {
  readonly steps: readonly CharacterValidationStep[];
  readonly validateStep: (step: number, character: unknown) => ValidationResult;
  readonly isStepDisabled: (step: number, character: unknown) => boolean;
}