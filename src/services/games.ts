// Games service for Firebase Firestore operations
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FIREBASE_COLLECTIONS } from "@/constants/firebase";
import type { AuthUser } from "./auth";
import type { Game } from "@/types/game";
import { logger } from "@/utils/logger";
import { handleServiceError } from "@/utils/serviceErrorHandler";

export type { Game };

/**
 * Fetch all games for a specific user
 */
export const getUserGames = async (user: AuthUser): Promise<Game[]> => {
  try {
    // Use the correct Firestore path structure: /users/{userId}/games
    const gamesRef = collection(db, FIREBASE_COLLECTIONS.USERS, user.uid, "games");
    const querySnapshot = await getDocs(gamesRef);

    const games: Game[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      
      games.push({
        id: docSnapshot.id,
        name: data["name"] || "Unnamed Game", // Ensure name is always present
        ...data,
      });
    });

    logger.info(`Fetched ${games.length} games for user ${user.uid}`);
    return games;
  } catch (error) {
    handleServiceError(error, {
      action: "fetching games",
      context: { userId: user.uid }
    });
  }
};

/**
 * Save a game to Firebase
 */
export const saveGame = async (
  userId: string,
  game: Omit<Game, 'id'>,
  gameId?: string
): Promise<string> => {
  try {
    if (gameId) {
      // Update existing game
      const gameRef = doc(db, FIREBASE_COLLECTIONS.USERS, userId, "games", gameId);
      await setDoc(gameRef, game);
      logger.info(`Successfully updated game ${gameId}`);
      return gameId;
    } else {
      // Create new game with auto-generated ID
      const gamesRef = collection(db, FIREBASE_COLLECTIONS.USERS, userId, "games");
      const docRef = doc(gamesRef);
      await setDoc(docRef, game);
      logger.info(`Successfully created game ${docRef.id}`);
      return docRef.id;
    }
  } catch (error) {
    handleServiceError(error, {
      action: "saving game",
      context: { userId, gameId, gameName: game["name"] }
    });
  }
};

/**
 * Delete a game for a specific user
 */
export const deleteGame = async (userId: string, gameId: string): Promise<void> => {
  try {
    const gameRef = doc(db, FIREBASE_COLLECTIONS.USERS, userId, "games", gameId);
    await deleteDoc(gameRef);
    logger.info(`Deleted game ${gameId} for user ${userId}`);
  } catch (error) {
    handleServiceError(error, {
      action: "deleting game",
      context: { userId, gameId }
    });
  }
};