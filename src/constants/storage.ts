/**
 * Constants for localStorage keys used throughout the application
 * Centralizes key management and prevents typos
 */
export const STORAGE_KEYS = {
  NEW_CHARACTER: "newCharacter",
  DRAFT_GAME: "draftGame",
  INCLUDE_SUPPLEMENTAL_RACE: "includeSupplemental",
  INCLUDE_SUPPLEMENTAL_CLASS: "includeSupplementalClass",
  USE_COMBINATION_CLASS: "useCombinationClass",
} as const;

/**
 * Cache keys used in data loading
 */
export const CACHE_KEYS = {
  EQUIPMENT_ALL: "equipment-all",
} as const;

// Type for storage keys to ensure type safety
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
export type CacheKey = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS];
