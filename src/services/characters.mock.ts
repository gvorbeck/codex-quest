/**
 * Mock character service implementation
 * Uses localStorage for persistence and provides sample data for contributor onboarding
 */

import type { Character } from "@/types";
/**
 * Mock Character Service
 * Simulates Firebase operations for development and testing
 */

import type { AuthUser } from "./auth";
import type { CharacterListItem } from "./characters";
import { getAllSampleCharacters } from "@/data/sampleCharacters";
import { processCharacterData } from "./characterMigration";
import { logger } from "@/utils";
// Mock service constants
const MOCK_NETWORK_DELAY_MS = 100;
const STORAGE_KEY = "mock_characters";
const SAMPLE_DATA_INITIALIZED_KEY = "mock_characters_sample_initialized";

/**
 * Initialize localStorage with sample characters if not already done
 */
const initializeSampleData = (): void => {
  const isInitialized = localStorage.getItem(SAMPLE_DATA_INITIALIZED_KEY);

  if (!isInitialized) {
    const sampleCharacters = getAllSampleCharacters();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleCharacters));
    localStorage.setItem(SAMPLE_DATA_INITIALIZED_KEY, "true");
    logger.info(
      `🎭 Mock mode: Initialized with ${sampleCharacters.length} sample characters`
    );
  }
};

/**
 * Get all characters from localStorage
 */
const getStoredCharacters = (): Character[] => {
  initializeSampleData();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    logger.error("Failed to parse stored characters:", error);
    return [];
  }
};

/**
 * Save characters to localStorage
 */
const saveCharacters = (characters: Character[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  } catch (error) {
    logger.error("Failed to save characters to localStorage:", error);
    throw new Error("Failed to save characters");
  }
};

/**
 * Mock implementation of getUserCharacters
 * In mock mode, all characters belong to the mock user
 */
export const getUserCharacters = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _user: AuthUser
): Promise<CharacterListItem[]> => {
  // Simulate network delay for realistic feel
  await new Promise((resolve) => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));

  const characters = getStoredCharacters();

  // Transform to CharacterListItem format (matching Firebase service interface)
  return characters.map((character): CharacterListItem => {
    return {
      id: character.name.toLowerCase().replace(/\s+/g, "-"),
      name: character.name,
      race: character.race,
      class: character.class || "",
      level: character.level || 1,
      hp: {
        current: character.hp?.current || 0,
        max: character.hp?.max || 0,
      },
      xp: character.xp,
    };
  });
};

/**
 * Mock implementation of getCharacterById
 */
export const getCharacterById = async (
  _userId: string,
  characterId: string
): Promise<Character | null> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  const characters = getStoredCharacters();
  const character = characters.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === characterId
  );

  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }

  // Run migration to match Firebase service behavior
  // Cast to unknown first since processCharacterData accepts legacy format
  return processCharacterData(character as unknown as Parameters<typeof processCharacterData>[0]);
};

/**
 * Mock implementation of saveCharacter
 * Returns the character ID (generates new one if not provided)
 */
export const saveCharacter = async (
  _userId: string,
  character: Character,
  characterId?: string
): Promise<string> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const characters = getStoredCharacters();
  const finalCharacterId =
    characterId || character.name.toLowerCase().replace(/\s+/g, "-");

  // Character to save
  const characterToSave: Character = character;

  if (characterId) {
    // Update existing character
    const existingIndex = characters.findIndex(
      (c) => c.name.toLowerCase().replace(/\s+/g, "-") === characterId
    );
    if (existingIndex >= 0) {
      characters[existingIndex] = characterToSave;
    } else {
      // Character doesn't exist, add as new
      characters.push(characterToSave);
    }
  } else {
    // Add new character
    characters.push(characterToSave);
  }

  saveCharacters(characters);
  logger.info(
    `🎭 Mock mode: Saved character "${character.name}" (${finalCharacterId})`
  );

  return finalCharacterId;
};

/**
 * Mock implementation of deleteCharacter
 */
export const deleteCharacter = async (
  _userId: string,
  characterId: string
): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));

  const characters = getStoredCharacters();
  const characterIndex = characters.findIndex(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === characterId
  );

  if (characterIndex === -1) {
    throw new Error(`Character with ID ${characterId} not found`);
  }

  const deletedCharacter = characters[characterIndex];
  characters.splice(characterIndex, 1);
  saveCharacters(characters);

  logger.info(
    `🎭 Mock mode: Deleted character "${deletedCharacter?.name}" (${characterId})`
  );
};

/**
 * Mock-specific utility: Reset to sample data
 * Useful for demos and testing
 */
export const resetToSampleData = (): void => {
  localStorage.removeItem(SAMPLE_DATA_INITIALIZED_KEY);
  localStorage.removeItem(STORAGE_KEY);
  initializeSampleData();
  logger.info("🎭 Mock mode: Reset to sample data");
};

/**
 * Mock-specific utility: Clear all data
 * Useful for testing empty states
 */
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SAMPLE_DATA_INITIALIZED_KEY);
  logger.info("🎭 Mock mode: Cleared all character data");
};

/**
 * Mock-specific utility: Export data for debugging
 */
export const exportMockData = (): Character[] => {
  return getStoredCharacters();
};
