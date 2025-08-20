/**
 * Constants for localStorage keys used throughout the application
 * Centralizes key management and prevents typos
 */
export const STORAGE_KEYS = {
  NEW_CHARACTER: "newCharacter",
  INCLUDE_SUPPLEMENTAL_RACE: "includeSupplemental",
  INCLUDE_SUPPLEMENTAL_CLASS: "includeSupplementalClass",
  USE_COMBINATION_CLASS: "useCombinationClass",
} as const;

// Type for storage keys to ensure type safety
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
