import { useMemo } from "react";
import type { ValidationResult, ValidationSchema } from "@/types/enhanced";
import { logger } from "@/utils/logger";

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
        logger.error(`Validation rule "${rule.name}" failed:`, error);
      }
    }

    return {
      isValid,
      errors: Object.freeze(errors),
      warnings: Object.freeze(warnings),
    };
  }, [value, schema]);
}
