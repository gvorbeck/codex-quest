// Character service for Firebase Firestore operations
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FIREBASE_COLLECTIONS } from "@/constants";
import type { AuthUser } from "./auth";
import type { Character } from "@/types";
import { processCharacterData, isLegacyCharacter } from "./characterMigration";
import { handleServiceError, logger } from "@/utils";

// Simple interface for listing characters - we don't need the full Character type
export interface CharacterListItem {
  id: string;
  name: string;
  race?: string;
  class?: string | string[];
  level?: number;
  hp?: { current?: number; max?: number } | number;
  xp?: number;
  // Custom race support - deprecated, use race field directly
  // This field is kept temporarily for migration compatibility
  customRace?: {
    name?: string;
  };
  // Allow for additional properties that might exist
  [key: string]: unknown;
}

/**
 * Fetch all characters for a specific user
 */
export const getUserCharacters = async (
  user: AuthUser
): Promise<CharacterListItem[]> => {
  try {
    // Use the correct Firestore path structure: /users/{userId}/characters
    const charactersRef = collection(
      db,
      FIREBASE_COLLECTIONS.USERS,
      user.uid,
      FIREBASE_COLLECTIONS.CHARACTERS
    );
    const querySnapshot = await getDocs(charactersRef);

    const characters: CharacterListItem[] = [];
    const migrationPromises: Promise<void>[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const wasLegacy = isLegacyCharacter(data);
      const processedData = processCharacterData(data);

      characters.push({
        id: docSnapshot.id,
        name: processedData.name || "Unnamed Character", // Ensure name is always present
        ...processedData,
      });

      // If this was a legacy character, save the migrated data back to Firebase
      if (wasLegacy) {
        const docRef = doc(
          db,
          FIREBASE_COLLECTIONS.USERS,
          user.uid,
          FIREBASE_COLLECTIONS.CHARACTERS,
          docSnapshot.id
        );
        const migrationPromise = setDoc(docRef, processedData).catch(
          (error) => {
            logger.error(
              `Failed to persist migration for character ${docSnapshot.id}:`,
              error
            );
          }
        );
        migrationPromises.push(migrationPromise);
      }
    });

    // Wait for all migrations to complete before returning
    if (migrationPromises.length > 0) {
      try {
        await Promise.all(migrationPromises);
        logger.info(
          `Successfully persisted ${migrationPromises.length} character migrations to Firebase`
        );
      } catch {
        logger.warn(
          "Some character migrations failed to persist, but continuing with fetched data"
        );
      }
    }

    return characters;
  } catch (error) {
    handleServiceError(error, {
      action: "fetching user characters",
      context: { userId: user.uid },
    });
  }
};

/**
 * Fetch a single character by ID (for future use)
 */
export const getCharacterById = async (
  userId: string,
  characterId: string
): Promise<CharacterListItem | null> => {
  try {
    const characterRef = doc(
      db,
      FIREBASE_COLLECTIONS.USERS,
      userId,
      FIREBASE_COLLECTIONS.CHARACTERS,
      characterId
    );
    const docSnap = await getDoc(characterRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const wasLegacy = isLegacyCharacter(data);
      const processedData = processCharacterData(data);

      // If this was a legacy character, save the migrated data back to Firebase
      if (wasLegacy) {
        try {
          await setDoc(characterRef, processedData);
          logger.info(
            `Successfully persisted migration for character ${characterId}`
          );
        } catch (error) {
          logger.error(
            `Failed to persist migration for character ${characterId}:`,
            error
          );
        }
      }

      return {
        id: docSnap.id,
        name: processedData.name || "Unnamed Character", // Ensure name is always present
        ...processedData,
      };
    } else {
      return null;
    }
  } catch (error) {
    handleServiceError(error, {
      action: "fetching character",
      context: { userId, characterId },
    });
  }
};

/**
 * Save a character to Firebase
 */
export const saveCharacter = async (
  userId: string,
  character: Character,
  characterId?: string
): Promise<string> => {
  try {
    // Ensure character has current version
    const dataToSave = {
      ...character,
      settings: {
        ...character.settings,
        version: 2.4, // Current version
      },
    };

    if (characterId) {
      // Update existing character
      const characterRef = doc(
        db,
        FIREBASE_COLLECTIONS.USERS,
        userId,
        FIREBASE_COLLECTIONS.CHARACTERS,
        characterId
      );
      await setDoc(characterRef, dataToSave);
      logger.info(`Successfully updated character ${characterId}`);
      return characterId;
    } else {
      // Create new character with auto-generated ID
      const charactersRef = collection(
        db,
        FIREBASE_COLLECTIONS.USERS,
        userId,
        FIREBASE_COLLECTIONS.CHARACTERS
      );
      const docRef = doc(charactersRef);
      await setDoc(docRef, dataToSave);
      logger.info(`Successfully created character ${docRef.id}`);
      return docRef.id;
    }
  } catch (error) {
    handleServiceError(error, {
      action: "saving character",
      context: { userId, characterId, characterName: character.name },
    });
  }
};

/**
 * Delete a character from Firebase
 */
export const deleteCharacter = async (
  userId: string,
  characterId: string
): Promise<void> => {
  try {
    const characterRef = doc(
      db,
      FIREBASE_COLLECTIONS.USERS,
      userId,
      FIREBASE_COLLECTIONS.CHARACTERS,
      characterId
    );
    await deleteDoc(characterRef);
    logger.info(`Successfully deleted character ${characterId}`);
  } catch (error) {
    handleServiceError(error, {
      action: "deleting character",
      context: { userId, characterId },
    });
  }
};
