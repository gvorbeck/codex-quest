// Games service for Firebase Firestore operations
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FIREBASE_COLLECTIONS } from "@/constants/firebase";
import type { AuthUser } from "./auth";
import type { Game } from "@/types/game";
import { logger } from "@/utils/logger";

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
    logger.error("Error fetching games:", error);
    throw new Error("Failed to fetch games");
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
    logger.error("Error deleting game:", error);
    throw new Error("Failed to delete game");
  }
};