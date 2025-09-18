import { useState, useEffect, useRef } from 'react';

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef(initialValue || "");

  // Update local state when external value changes (but not when we're typing)
  useEffect(() => {
    if (initialValue !== lastSavedRef.current && initialValue !== localValue) {
      setLocalValue(initialValue || "");
      lastSavedRef.current = initialValue || "";
    }
  }, [initialValue, localValue]);

  // Handle text changes with debouncing
  const onChange = (value: string) => {
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
  };

  // Handle blur to save immediately
  const onBlur = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (localValue !== lastSavedRef.current && onUpdate) {
      lastSavedRef.current = localValue;
      onUpdate(localValue);
    }
    setIsSaving(false);
  };

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