/**
 * Service factory with auto-detection for mock vs Firebase mode
 * Automatically switches between Firebase and mock services based on configuration
 */

import { isMockMode, logCurrentMode } from "@/lib/mockMode";
import { logger } from "@/utils";

// Log the current mode for debugging
logCurrentMode();

// Character services
import * as firebaseCharacterService from "./characters";
import * as mockCharacterService from "./characters.mock";

// Game services
import * as firebaseGameService from "./games";
import * as mockGameService from "./games.mock";

// Auth services
import * as firebaseAuthService from "./auth";
import * as mockAuthService from "./auth.mock";

/**
 * Character service factory
 * Automatically switches between Firebase and mock implementations
 */
export const characterService = isMockMode()
  ? mockCharacterService
  : firebaseCharacterService;

/**
 * Game service factory
 * Automatically switches between Firebase and mock implementations
 */
export const gameService = isMockMode()
  ? mockGameService
  : firebaseGameService;

/**
 * Auth service factory
 * Automatically switches between Firebase and mock implementations
 */
export const authService = isMockMode()
  ? mockAuthService
  : firebaseAuthService;

// Re-export service functions with consistent names
export const {
  getUserCharacters,
  getCharacterById,
  saveCharacter,
  deleteCharacter,
} = characterService;

export const {
  getUserGames,
  getGameById,
  saveGame,
  deleteGame,
} = gameService;

export const {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  sendPasswordReset,
  signOut,
  onAuthStateChange,
} = authService;

// Legacy exports for backward compatibility
export * from "./characterMigration";
export * from "./dataLoader";

// Re-export types
export type { AuthUser } from "./auth";
export type { CharacterListItem } from "./characters";
export type { Game } from "./games";

// Export mode information for debugging
export { isMockMode, getCurrentMode } from "@/lib/mockMode";

/**
 * Development utilities (only available in mock mode)
 */
export const devUtils = isMockMode() ? {
  // Character utilities
  resetCharacterData: mockCharacterService.resetToSampleData,
  clearCharacterData: mockCharacterService.clearAllData,
  exportCharacterData: mockCharacterService.exportMockData,

  // Game utilities
  resetGameData: mockGameService.resetToSampleData,
  clearGameData: mockGameService.clearAllData,
  exportGameData: mockGameService.exportMockData,

  // Auth utilities
  getCurrentUser: mockAuthService.getCurrentMockUser,
  signInAsUser: mockAuthService.signInAsUser,
  clearAuthData: mockAuthService.clearAuthData,

  // Global utilities
  resetAllData: () => {
    mockCharacterService.resetToSampleData();
    mockGameService.resetToSampleData();
    mockAuthService.clearAuthData();
    logger.info("🎭 Mock mode: Reset all data to samples");
  },

  clearAllData: () => {
    mockCharacterService.clearAllData();
    mockGameService.clearAllData();
    mockAuthService.clearAuthData();
    logger.info("🎭 Mock mode: Cleared all data");
  },
} : null;

// Log available development utilities in mock mode
if (isMockMode() && devUtils) {
  logger.info("🛠️ Development utilities available on window.devUtils:");
  logger.info("  - resetAllData() - Reset to sample data");
  logger.info("  - clearAllData() - Clear all data");
  logger.info("  - signInAsUser(userData) - Sign in as custom user");
  logger.info("  - exportCharacterData() - Export character data");
  logger.info("  - exportGameData() - Export game data");

  // Make utilities available globally for development
  (window as unknown as Record<string, unknown>)["devUtils"] = devUtils;
}
