import { useState, useEffect, useCallback } from "react";
import { logger } from "@/utils/logger";

/**
 * Custom hook for managing localStorage with automatic JSON serialization/deserialization
 * Provides error handling and type safety for localStorage operations
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, () => void] {
  // Initialize state with lazy evaluation to get value from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      logger.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Setter function that updates both state and localStorage
  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        logger.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  // Function to remove item from localStorage and reset to default
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      logger.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // Sync with localStorage when the key changes
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      logger.warn(`Error syncing localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
}
