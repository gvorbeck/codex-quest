import { useMemo } from "react";
import type { ValidationResult, ValidationSchema } from "@/types/enhanced";

/**
 * Enhanced validation hook with type safety and detailed feedback
 */
export function useValidation<T>(
  value: T,
  schema: ValidationSchema<T>
): ValidationResult {
  return useMemo(() => {
    // Use mutable arrays for building the result
    const errors: string[] = [];
    const warnings: string[] = [];
    let isValid = true;

    // Check if value is required
    if (
      schema.required &&
      (value === null || value === undefined || value === "")
    ) {
      errors.push("This field is required");
      isValid = false;
      return {
        isValid,
        errors: Object.freeze(errors),
        warnings: Object.freeze(warnings),
      };
    }

    // Skip validation if value is empty and not required
    if (
      !schema.required &&
      (value === null || value === undefined || value === "")
    ) {
      return {
        isValid,
        errors: Object.freeze(errors),
        warnings: Object.freeze(warnings),
      };
    }

    // Run validation rules
    for (const rule of schema.rules) {
      try {
        if (!rule.validate(value)) {
          errors.push(rule.message);
          isValid = false;
        }
      } catch (error) {
        errors.push(`Validation error: ${rule.name}`);
        isValid = false;
        console.error(`Validation rule "${rule.name}" failed:`, error);
      }
    }

    return {
      isValid,
      errors: Object.freeze(errors),
      warnings: Object.freeze(warnings),
    };
  }, [value, schema]);
}

/**
 * Hook for validating multiple fields with type safety
 * Uses individual validation calls to avoid hook rule violations
 */
export function useMultiValidation<T extends Record<string, unknown>>(
  values: T,
  schemas: { [K in keyof T]?: ValidationSchema<T[K]> }
): { [K in keyof T]: ValidationResult } & { isFormValid: boolean } {
  return useMemo(() => {
    const results = {} as Record<string, ValidationResult>;
    let isFormValid = true;

    // Helper function to validate a single value
    const validateValue = <V>(
      value: V,
      schema: ValidationSchema<V>
    ): ValidationResult => {
      const errors: string[] = [];
      const warnings: string[] = [];
      let fieldIsValid = true;

      // Check if value is required
      if (
        schema.required &&
        (value === null || value === undefined || value === "")
      ) {
        errors.push("This field is required");
        fieldIsValid = false;
      } else if (
        schema.required ||
        (value !== null && value !== undefined && value !== "")
      ) {
        // Run validation rules if value exists or is required
        for (const rule of schema.rules) {
          try {
            if (!rule.validate(value)) {
              errors.push(rule.message);
              fieldIsValid = false;
            }
          } catch (error) {
            errors.push(`Validation error: ${rule.name}`);
            fieldIsValid = false;
            console.error(`Validation rule "${rule.name}" failed:`, error);
          }
        }
      }

      return {
        isValid: fieldIsValid,
        errors: Object.freeze(errors),
        warnings: Object.freeze(warnings),
      };
    };

    for (const key in values) {
      const schema = schemas[key];
      if (schema) {
        results[key] = validateValue(values[key], schema);
        if (!results[key]!.isValid) {
          isFormValid = false;
        }
      } else {
        // Default valid result for fields without schema
        results[key] = {
          isValid: true,
          errors: Object.freeze([]),
          warnings: Object.freeze([]),
        };
      }
    }

    return {
      ...results,
      isFormValid,
    } as { [K in keyof T]: ValidationResult } & { isFormValid: boolean };
  }, [values, schemas]);
}
