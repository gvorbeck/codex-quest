import { useState, useEffect, useRef, useCallback } from "react";

interface UseDebouncedUpdateOptions {
  delay?: number;
  onUpdate: (value: string) => void;
}

interface UseDebouncedUpdateReturn {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  isSaving: boolean;
}

/**
 * Hook for debounced updates that prevents infinite re-render loops
 *
 * @param initialValue - The initial value from external source
 * @param options - Configuration options
 * @returns Object containing the current value, change handler, blur handler, and saving state
 */
export function useDebouncedUpdate(
  initialValue: string,
  options: UseDebouncedUpdateOptions
): UseDebouncedUpdateReturn {
  const { delay = 500, onUpdate } = options;

  const [localValue, setLocalValue] = useState(initialValue || "");
  const [isSaving, setIsSaving] = useState(false);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef(initialValue || "");

  // Sync with external value during render when it changes
  // This pattern is recommended by React docs for adjusting state based on props
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    if (initialValue !== localValue) {
      setLocalValue(initialValue || "");
    }
  }

  // Sync lastSavedRef when external value changes (effect can write to refs)
  useEffect(() => {
    lastSavedRef.current = initialValue || "";
  }, [initialValue]);

  // Handle text changes with debouncing
  const onChange = useCallback(
    (value: string) => {
      setLocalValue(value);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Don't set saving state or timeout if value hasn't actually changed
      if (value === lastSavedRef.current) {
        setIsSaving(false);
        return;
      }

      setIsSaving(true);

      // Set new timeout for saving
      timeoutRef.current = setTimeout(() => {
        if (onUpdate && value !== lastSavedRef.current) {
          lastSavedRef.current = value;
          onUpdate(value);
        }
        setIsSaving(false);
        timeoutRef.current = null;
      }, delay);
    },
    [onUpdate, delay]
  );

  // Handle blur to save immediately
  const onBlur = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (localValue !== lastSavedRef.current && onUpdate) {
      lastSavedRef.current = localValue;
      onUpdate(localValue);
    }
    setIsSaving(false);
  }, [localValue, onUpdate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    value: localValue,
    onChange,
    onBlur,
    isSaving,
  };
}