/**
 * Centralized query key factory for TanStack Query
 * Provides consistent, type-safe query keys across the application
 */

export const queryKeys = {
  // Character-related queries
  characters: {
    all: ["characters"] as const,
    user: (userId: string) => ["characters", userId] as const,
    detail: (userId: string, characterId: string) =>
      ["characters", userId, characterId] as const,
    summary: (userId: string, characterId: string) =>
      ["character-summary", userId, characterId] as const,
  },

  // Game-related queries
  games: {
    all: ["games"] as const,
    user: (userId: string) => ["games", userId] as const,
    detail: (userId: string, gameId: string) =>
      ["games", userId, gameId] as const,
  },

  // Application data queries
  appData: {
    all: ["app-data"] as const,
    classes: ["app-data", "classes"] as const,
    races: ["app-data", "races"] as const,
    spells: ["app-data", "spells"] as const,
    equipment: ["app-data", "equipment"] as const,
  },
} as const;

/**
 * Type helpers for query keys
 */
export type QueryKey = readonly string[];
