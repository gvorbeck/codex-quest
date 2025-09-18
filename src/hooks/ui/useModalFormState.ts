import { useState, useCallback } from "react";

interface UseModalFormStateOptions<T> {
  initialData: T;
  onClose?: () => void;
  resetOnClose?: boolean;
}

interface UseModalFormStateReturn<T> {
  formData: T;
  setFormData: (data: T | ((prev: T) => T)) => void;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  resetForm: () => void;
  handleClose: () => void;
  isDirty: boolean;
}

export function useModalFormState<T extends Record<string, unknown>>({
  initialData,
  onClose,
  resetOnClose = true,
}: UseModalFormStateOptions<T>): UseModalFormStateReturn<T> {
  const [formData, setFormData] = useState<T>(initialData);
  const [initialFormData] = useState<T>(initialData);

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleClose = useCallback(() => {
    if (resetOnClose) {
      resetForm();
    }
    onClose?.();
  }, [resetForm, resetOnClose, onClose]);

  // Calculate if form is dirty (has changes)
  const isDirty = Object.keys(formData).some(key =>
    formData[key as keyof T] !== initialFormData[key as keyof T]
  );


  return {
    formData,
    setFormData,
    updateField,
    resetForm,
    handleClose,
    isDirty,
  };
}