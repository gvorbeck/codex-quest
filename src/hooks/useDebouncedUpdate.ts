import { useState, useEffect, useCallback, useRef } from 'react';

interface UseDebouncedUpdateOptions {
  delay?: number;
  onUpdate: (value: string) => void | Promise<void>;
}

interface UseDebouncedUpdateReturn {
  value: string;
  setValue: (newValue: string) => void;
  isPending: boolean;
  flush: () => void;
}

/**
 * Hook for debouncing text input updates to reduce Firebase writes
 * 
 * @param initialValue - The initial value
 * @param options - Configuration options
 * @returns Object containing the current value, setter, pending state, and flush function
 */
export function useDebouncedUpdate(
  initialValue: string,
  options: UseDebouncedUpdateOptions
): UseDebouncedUpdateReturn {
  const { delay = 500, onUpdate } = options;
  
  const [value, setValue] = useState(initialValue);
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdatedValueRef = useRef(initialValue);

  // Update internal value when external value changes
  useEffect(() => {
    if (initialValue !== lastUpdatedValueRef.current) {
      setValue(initialValue);
      lastUpdatedValueRef.current = initialValue;
      setIsPending(false);
    }
  }, [initialValue]);

  // Flush pending updates immediately
  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (value !== lastUpdatedValueRef.current) {
      setIsPending(false);
      lastUpdatedValueRef.current = value;
      onUpdate(value);
    }
  }, [value, onUpdate]);

  // Handle value changes with debouncing
  const handleValueChange = useCallback((newValue: string) => {
    setValue(newValue);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Don't set pending or create timeout if value hasn't actually changed
    if (newValue === lastUpdatedValueRef.current) {
      setIsPending(false);
      return;
    }
    
    setIsPending(true);
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setIsPending(false);
      lastUpdatedValueRef.current = newValue;
      onUpdate(newValue);
      timeoutRef.current = null;
    }, delay);
  }, [delay, onUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Flush on unmount if there are pending changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current && value !== lastUpdatedValueRef.current) {
        // Flush immediately on unmount
        clearTimeout(timeoutRef.current);
        onUpdate(value);
      }
    };
  }, [value, onUpdate]);

  return {
    value,
    setValue: handleValueChange,
    isPending,
    flush,
  };
}