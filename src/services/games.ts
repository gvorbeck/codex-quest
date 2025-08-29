// Games service for Firebase Firestore operations
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
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