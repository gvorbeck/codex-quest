/**
 * Configuration & Infrastructure Types
 * Type definitions for app configuration, Firebase, storage, and caching
 */

// Firebase types - derived from infrastructure constants
export type FirebaseCollection = "users" | "characters" | "games";
export type FirebaseEnvKey =
  | "VITE_FIREBASE_API_KEY"
  | "VITE_FIREBASE_AUTH_DOMAIN"
  | "VITE_FIREBASE_PROJECT_ID"
  | "VITE_FIREBASE_STORAGE_BUCKET"
  | "VITE_FIREBASE_MESSAGING_SENDER_ID"
  | "VITE_FIREBASE_APP_ID"
  | "VITE_FIREBASE_MEASUREMENT_ID";

// Storage and cache types
export type StorageKey =
  | "newCharacter"
  | "draftGame"
  | "includeSupplemental"
  | "includeSupplementalClass"
  | "useCombinationClass"
  | "customClassMagicToggle";

export type CacheKey =
  | "appData"
  | "monsters"
  | "equipment"
  | "spells"
  | "cantrips"
  | "classes"
  | "races";

// Service types
export interface ServiceErrorOptions {
  action: string;
  context?: Record<string, unknown>;
  fallbackMessage?: string;
}
