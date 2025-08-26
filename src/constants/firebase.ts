/**
 * Firebase-related constants for collection names and paths
 */
export const FIREBASE_COLLECTIONS = {
  USERS: "users",
  CHARACTERS: "characters",
  GAMES: "games",
} as const;

/**
 * Firebase environment variable keys
 */
export const FIREBASE_ENV_KEYS = {
  API_KEY: "VITE_FIREBASE_API_KEY",
  AUTH_DOMAIN: "VITE_FIREBASE_AUTH_DOMAIN",
  PROJECT_ID: "VITE_FIREBASE_PROJECT_ID",
  STORAGE_BUCKET: "VITE_FIREBASE_STORAGE_BUCKET",
  MESSAGING_SENDER_ID: "VITE_FIREBASE_MESSAGING_SENDER_ID",
  APP_ID: "VITE_FIREBASE_APP_ID",
  MEASUREMENT_ID: "VITE_FIREBASE_MEASUREMENT_ID",
} as const;

export type FirebaseCollection = (typeof FIREBASE_COLLECTIONS)[keyof typeof FIREBASE_COLLECTIONS];
export type FirebaseEnvKey = (typeof FIREBASE_ENV_KEYS)[keyof typeof FIREBASE_ENV_KEYS];