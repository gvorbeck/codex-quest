/**
 * Application Configuration Constants
 * Consolidates environment, upload, DOM, and level-up related constants
 */

// File Upload Configuration
export const FILE_UPLOAD = {
  AVATAR_MAX_SIZE_BYTES: 1 * 1024 * 1024, // 1MB
  AVATAR_MAX_SIZE_MB: 1,
} as const;

// Firebase Configuration
export const FIREBASE_COLLECTIONS = {
  USERS: "users",
  CHARACTERS: "characters",
  GAMES: "games",
} as const;

export const FIREBASE_ENV_KEYS = {
  API_KEY: "VITE_FIREBASE_API_KEY",
  AUTH_DOMAIN: "VITE_FIREBASE_AUTH_DOMAIN",
  PROJECT_ID: "VITE_FIREBASE_PROJECT_ID",
  STORAGE_BUCKET: "VITE_FIREBASE_STORAGE_BUCKET",
  MESSAGING_SENDER_ID: "VITE_FIREBASE_MESSAGING_SENDER_ID",
  APP_ID: "VITE_FIREBASE_APP_ID",
  MEASUREMENT_ID: "VITE_FIREBASE_MEASUREMENT_ID",
} as const;

// DOM Element Configuration
export const DOM_IDS = {
  MAIN_CONTENT: "main-content",
  MOBILE_MENU: "mobile-menu",
  ROOT: "root",
} as const;

export const CSS_CLASSES = {
  SKIP_LINK: "skip-link",
  SR_ONLY: "sr-only",
} as const;

export const HTML_ROLES = {
  BANNER: "banner",
  NAVIGATION: "navigation",
  MAIN: "main",
  CONTENTINFO: "contentinfo",
  STATUS: "status",
} as const;

// Level Up Mechanics Configuration
export const LEVEL_UP_CONSTANTS = {
  LEVEL_UP_PROCESSING_DELAY: 500,
  FIXED_HP_LEVEL_THRESHOLD: 9,

  // Classes that get +2 HP per level after 9th level
  TWO_HP_CLASSES: [
    "fighter",
    "thief",
    "assassin",
    "barbarian",
    "ranger",
    "paladin",
    "scout",
  ] as const,
} as const;

// Type exports
export type FirebaseCollection = (typeof FIREBASE_COLLECTIONS)[keyof typeof FIREBASE_COLLECTIONS];
export type FirebaseEnvKey = (typeof FIREBASE_ENV_KEYS)[keyof typeof FIREBASE_ENV_KEYS];
export type TwoHPClass = (typeof LEVEL_UP_CONSTANTS.TWO_HP_CLASSES)[number];

// Legacy exports for backward compatibility
export const AVATAR_MAX_SIZE_BYTES = FILE_UPLOAD.AVATAR_MAX_SIZE_BYTES;
export const AVATAR_MAX_SIZE_MB = FILE_UPLOAD.AVATAR_MAX_SIZE_MB;