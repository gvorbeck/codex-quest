/**
 * Mock games service implementation
 * Uses localStorage for persistence and provides sample data for contributor onboarding
 */

import type { Game } from "@/types";
import type { AuthUser } from "./auth";
import { getAllSampleGames } from "@/data/sampleGames";
import { logger } from "@/utils";

const STORAGE_KEY = "mock_games";
const SAMPLE_DATA_INITIALIZED_KEY = "mock_games_sample_initialized";

/**
 * Initialize localStorage with sample games if not already done
 */
const initializeSampleData = (): void => {
  const isInitialized = localStorage.getItem(SAMPLE_DATA_INITIALIZED_KEY);

  if (!isInitialized) {
    const sampleGames = getAllSampleGames();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleGames));
    localStorage.setItem(SAMPLE_DATA_INITIALIZED_KEY, "true");
    logger.info(`🎭 Mock mode: Initialized with ${sampleGames.length} sample games`);
  }
};

/**
 * Get all games from localStorage
 */
const getStoredGames = (): Game[] => {
  initializeSampleData();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    logger.error("Failed to parse stored games:", error);
    return [];
  }
};

/**
 * Save games to localStorage
 */
const saveGames = (games: Game[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (error) {
    logger.error("Failed to save games to localStorage:", error);
    throw new Error("Failed to save games");
  }
};

/**
 * Mock implementation of getUserGames
 * In mock mode, all games belong to the mock user
 */
export const getUserGames = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _user: AuthUser
): Promise<Game[]> => {
  // Simulate network delay for realistic feel
  await new Promise(resolve => setTimeout(resolve, 100));

  const games = getStoredGames();
  logger.info(`🎭 Mock mode: Retrieved ${games.length} games`);

  return games;
};

/**
 * Mock implementation of getGameById
 */
export const getGameById = async (
  _userId: string,
  gameId: string
): Promise<Game | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150));

  const games = getStoredGames();
  const game = games.find(g => g.id === gameId);

  if (!game) {
    throw new Error(`Game with ID ${gameId} not found`);
  }

  return game;
};

/**
 * Mock implementation of saveGame
 * Returns the game ID (generates new one if not provided)
 */
export const saveGame = async (
  _userId: string,
  game: Game,
  gameId?: string
): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const games = getStoredGames();
  const finalGameId = gameId || game.name.toLowerCase().replace(/\s+/g, '-');

  // Ensure game has the correct ID
  const gameToSave: Game = {
    ...game,
    id: finalGameId,
  };

  if (gameId) {
    // Update existing game
    const existingIndex = games.findIndex(g => g.id === gameId);
    if (existingIndex >= 0) {
      games[existingIndex] = gameToSave;
    } else {
      // Game doesn't exist, add as new
      games.push(gameToSave);
    }
  } else {
    // Add new game
    games.push(gameToSave);
  }

  saveGames(games);
  logger.info(`🎭 Mock mode: Saved game "${game.name}" (${finalGameId})`);

  return finalGameId;
};

/**
 * Mock implementation of deleteGame
 */
export const deleteGame = async (
  _userId: string,
  gameId: string
): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const games = getStoredGames();
  const gameIndex = games.findIndex(g => g.id === gameId);

  if (gameIndex === -1) {
    throw new Error(`Game with ID ${gameId} not found`);
  }

  const deletedGame = games[gameIndex];
  games.splice(gameIndex, 1);
  saveGames(games);

  logger.info(`🎭 Mock mode: Deleted game "${deletedGame?.name}" (${gameId})`);
};

/**
 * Mock-specific utility: Reset to sample data
 * Useful for demos and testing
 */
export const resetToSampleData = (): void => {
  localStorage.removeItem(SAMPLE_DATA_INITIALIZED_KEY);
  localStorage.removeItem(STORAGE_KEY);
  initializeSampleData();
  logger.info("🎭 Mock mode: Reset to sample game data");
};

/**
 * Mock-specific utility: Clear all data
 * Useful for testing empty states
 */
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SAMPLE_DATA_INITIALIZED_KEY);
  logger.info("🎭 Mock mode: Cleared all game data");
};

/**
 * Mock-specific utility: Export data for debugging
 */
export const exportMockData = (): Game[] => {
  return getStoredGames();
};