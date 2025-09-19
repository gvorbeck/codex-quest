import { useState, useCallback, useMemo } from "react";
import { useNotificationContext } from "@/hooks";

export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'format' | 'range' | 'custom';
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: unknown) => string | null;
}

export interface ValidationSchema {
  [fieldName: string]: ValidationRule;
}

export interface FormValidationState {
  errors: ValidationError[];
  isValid: boolean;
  touched: Set<string>;
  isSubmitting: boolean;
}

/**
 * Enhanced form validation hook with real-time feedback and notifications
 */
export function useEnhancedFormValidation<T extends Record<string, unknown>>(
  initialValues: T,
  schema: ValidationSchema,
  options?: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    showSuccessNotification?: boolean;
    submitNotificationText?: string;
  }
) {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    showSuccessNotification = true,
    submitNotificationText = "Form submitted successfully!",
  } = options || {};

  const notifications = useNotificationContext();

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = useCallback(
    (fieldName: string, value: unknown): ValidationError | null => {
      const rule = schema[fieldName];
      if (!rule) return null;

      // Required validation
      if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        return {
          field: fieldName,
          message: `${fieldName} is required`,
          type: 'required',
        };
      }

      // Skip other validations if field is empty and not required
      if (!value && !rule.required) return null;

      // String validations
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          return {
            field: fieldName,
            message: `${fieldName} must be at least ${rule.minLength} characters`,
            type: 'range',
          };
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          return {
            field: fieldName,
            message: `${fieldName} cannot exceed ${rule.maxLength} characters`,
            type: 'range',
          };
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          return {
            field: fieldName,
            message: `${fieldName} format is invalid`,
            type: 'format',
          };
        }
      }

      // Number validations
      if (typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          return {
            field: fieldName,
            message: `${fieldName} must be at least ${rule.min}`,
            type: 'range',
          };
        }

        if (rule.max !== undefined && value > rule.max) {
          return {
            field: fieldName,
            message: `${fieldName} cannot exceed ${rule.max}`,
            type: 'range',
          };
        }
      }

      // Custom validation
      if (rule.custom) {
        const customError = rule.custom(value);
        if (customError) {
          return {
            field: fieldName,
            message: customError,
            type: 'custom',
          };
        }
      }

      return null;
    },
    [schema]
  );

  // Validate all fields
  const validateAll = useCallback((): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    Object.keys(schema).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors.push(error);
      }
    });

    return newErrors;
  }, [schema, values, validateField]);

  // Update field value with optional validation
  const setValue = useCallback(
    (fieldName: keyof T, value: unknown) => {
      setValues((prev) => ({ ...prev, [fieldName]: value }));

      if (validateOnChange) {
        const error = validateField(fieldName as string, value);
        setErrors((prev) => {
          const filtered = prev.filter((e) => e.field !== fieldName);
          return error ? [...filtered, error] : filtered;
        });
      }
    },
    [validateField, validateOnChange]
  );

  // Mark field as touched with optional validation
  const setFieldTouched = useCallback(
    (fieldName: keyof T) => {
      setTouched((prev) => new Set([...prev, fieldName as string]));

      if (validateOnBlur) {
        const error = validateField(fieldName as string, values[fieldName]);
        setErrors((prev) => {
          const filtered = prev.filter((e) => e.field !== fieldName);
          return error ? [...filtered, error] : filtered;
        });
      }
    },
    [validateField, validateOnBlur, values]
  );

  // Get errors for a specific field
  const getFieldError = useCallback(
    (fieldName: keyof T): string | null => {
      const error = errors.find((e) => e.field === fieldName);
      return error ? error.message : null;
    },
    [errors]
  );

  // Check if field has been touched
  const isFieldTouched = useCallback(
    (fieldName: keyof T): boolean => {
      return touched.has(fieldName as string);
    },
    [touched]
  );

  // Submit handler with validation and notifications
  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void> | void) => {
      setIsSubmitting(true);

      try {
        // Mark all fields as touched
        setTouched(new Set(Object.keys(schema)));

        // Validate all fields
        const validationErrors = validateAll();
        setErrors(validationErrors);

        if (validationErrors.length > 0) {
          // Show validation error notification
          const errorCount = validationErrors.length;
          const errorMessage = errorCount === 1
            ? "Please fix the validation error"
            : `Please fix ${errorCount} validation errors`;

          notifications.showError(errorMessage, {
            title: "Validation Failed",
            duration: 5000,
          });

          return;
        }

        // Submit the form
        await onSubmit(values);

        // Show success notification
        if (showSuccessNotification) {
          notifications.showSuccess(submitNotificationText, {
            duration: 4000,
          });
        }

        // Reset form state on successful submission
        setErrors([]);
        setTouched(new Set());
      } catch {
        // Error handling is done by the mutation handlers
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      schema,
      validateAll,
      values,
      notifications,
      showSuccessNotification,
      submitNotificationText,
    ]
  );

  // Reset form to initial state
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors([]);
    setTouched(new Set());
    setIsSubmitting(false);
  }, [initialValues]);

  // Computed validation state
  const validationState: FormValidationState = useMemo(
    () => ({
      errors,
      isValid: errors.length === 0,
      touched,
      isSubmitting,
    }),
    [errors, touched, isSubmitting]
  );

  return {
    values,
    setValue,
    setFieldTouched,
    getFieldError,
    isFieldTouched,
    handleSubmit,
    reset,
    validationState,
  };
}

/**
 * Common validation rules for reuse
 */
export const commonValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 6,
  },
  characterName: {
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  gameName: {
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  positiveNumber: {
    required: true,
    min: 0,
  },
  abilityScore: {
    required: true,
    min: 3,
    max: 18,
  },
} as const;