import { useState, useCallback } from "react";

/**
 * A reusable hook for form validation and state management
 * 
 * @param initialState - The initial form state
 * @param validationRules - A function that takes the form data and returns whether it's valid
 * @param onReset - Optional callback to run when the form is reset
 * @returns Form utilities including data, change handlers, validation state, and reset function
 */
export function useFormValidation<T extends Record<string, unknown>>(
  initialState: T,
  validationRules: (data: T) => boolean,
  onReset?: () => void
) {
  const [formData, setFormData] = useState<T>(initialState);

  const handleFieldChange = useCallback(
    (field: keyof T, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleMultipleFieldsChange = useCallback(
    (updates: Partial<T>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormData(initialState);
    onReset?.();
  }, [initialState, onReset]);

  const isValid = validationRules(formData);

  return {
    formData,
    setFormData,
    handleFieldChange,
    handleMultipleFieldsChange,
    resetForm,
    isValid,
  };
}