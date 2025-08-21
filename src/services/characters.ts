// Character service for Firebase Firestore operations
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AuthUser } from "./auth";

// Simple interface for listing characters - we don't need the full Character type
export interface CharacterListItem {
  id: string;
  name: string;
  // We'll keep it minimal for now as the data shapes may not match
  [key: string]: unknown; // Allow for flexibility with existing data
}

/**
 * Fetch all characters for a specific user
 */
export const getUserCharacters = async (
  user: AuthUser
): Promise<CharacterListItem[]> => {
  try {
    // Use the correct Firestore path structure: /users/{userId}/characters
    const charactersRef = collection(db, "users", user.uid, "characters");
    const querySnapshot = await getDocs(charactersRef);

    const characters: CharacterListItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      characters.push({
        id: doc.id,
        name: data['name'] || "Unnamed Character",
        ...data, // Include all other data for flexibility
      });
    });

    return characters;
  } catch (error) {
    console.error("Error fetching user characters:", error);
    throw new Error("Failed to fetch characters");
  }
};

/**
 * Fetch a single character by ID (for future use)
 */
export const getCharacterById = async (
  characterId: string
): Promise<CharacterListItem | null> => {
  try {
    const characterRef = doc(db, "characters", characterId);
    const docSnap = await getDoc(characterRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data['name'] || "Unnamed Character",
        ...data,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching character:", error);
    throw new Error("Failed to fetch character");
  }
};
