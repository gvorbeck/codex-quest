/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GoogleAuthProvider,
  User,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import DOMPurify from "dompurify";
import { GamePlayer, PlayerListObject } from "../data/definitions";
import { RcFile } from "antd/es/upload";

type DocumentType = "characters" | "games";

type UpdatePayload = {
  collection: string;
  docId: string;
  subCollection?: string;
  subDocId?: string;
  data: any;
};

export const handleLogin = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Add this check for user being null
    if (!user) {
      console.error("User object is null after sign-in");
      return;
    }

    // Create a document for the user in the 'users' collection
    const userDocRef = doc(db, "users", user.uid);

    await setDoc(
      userDocRef,
      {
        name: user.displayName,
        email: user.email,
        // add any additional fields here
      },
      { merge: true },
    ); // Merge the data if document already exists
  } catch (error) {
    console.error("Failed to login and set user doc:", error);
  }
};

export const fetchCollection = async (
  user: User | null,
  collectionName: DocumentType,
  setContent: (content: any) => void,
  setLoading: (loading: boolean) => void,
  pageTitle?: string,
) => {
  try {
    if (user) {
      const uid = user.uid;
      const contentCollectionRef = collection(
        db,
        `users/${uid}/${collectionName}`,
      );

      // Listen to real-time updates
      const unsubscribe = onSnapshot(contentCollectionRef, (snapshot) => {
        const userContent = snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          data.id = doc.id;
          return data;
        });
        setContent(userContent.sort((a, b) => a.name.localeCompare(b.name)));
        document.title = `CODEX.QUEST${!!pageTitle && ` | ${pageTitle}`}`;
        setLoading(false);
      });

      // Return the unsubscribe function to clean up the listener
      return () => unsubscribe();
    }
  } catch (error) {
    console.error(`Failed to fetch ${collectionName}:`, error);
  }
};

export const fetchDocument = (
  uid: string | undefined,
  id: string | undefined,
  setContent: (content: any) => void,
  collectionName: DocumentType,
): (() => void) => {
  const docRef = doc(db, `users/${uid}/${collectionName}/${id}`);

  // Listen to real-time updates
  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      const documentData = snapshot.data();
      setContent(documentData);
      if (collectionName === "characters") {
        document.title = `${documentData.name} | CODEX.QUEST`;
      }
    } else {
      console.error(`${collectionName.slice(0, -1).toUpperCase()} not found`); // Outputs "Character not found" or "Game not found"
    }
  });

  return () => unsubscribe();
};

export const updateDocument = async ({
  collection,
  docId,
  subCollection,
  subDocId,
  data,
}: UpdatePayload) => {
  if (!docId) {
    console.error("Document ID is undefined");
    return;
  }

  let docRef;
  if (subCollection && subDocId) {
    docRef = doc(db, collection, docId, subCollection, subDocId);
  } else {
    docRef = doc(db, collection, docId);
  }

  try {
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

export const createDocument = async (
  user: User | null,
  collectionName: DocumentType,
  data: any,
  successCallback?: (name: string) => void,
  errorCallback?: (error: any) => void,
  navigateCallback?: () => void,
) => {
  try {
    if (user) {
      const uid = user.uid;
      const colRef = collection(db, `users/${uid}/${collectionName}`);

      await addDoc(colRef, data);

      // Callback for successful addition
      if (successCallback) successCallback(data.name);

      // Navigation if needed
      if (navigateCallback) navigateCallback();
    } else {
      console.error("No user is currently logged in.");
      if (errorCallback) errorCallback("No user is currently logged in.");
    }
  } catch (error) {
    console.error("Error writing document: ", error);
    if (errorCallback) errorCallback(error);
  }
};

export const updateGameWithNewPlayer = async (
  gameId: string,
  userId: string,
  newPlayer: GamePlayer,
) => {
  const gameDocRef = doc(db, `users/${userId}/games/${gameId}`);
  const gameDoc = await getDoc(gameDocRef);

  if (gameDoc.exists()) {
    const gameData = gameDoc.data();
    const updatedPlayers = [...(gameData?.players || []), newPlayer];
    await setDoc(gameDocRef, { ...gameData, players: updatedPlayers });
  } else {
    console.error("Game does not exist");
  }
};

export const addPlayerToGame = async (
  url: string,
  gameId: string,
  gmId: string,
) => {
  const sanitizedURL = DOMPurify.sanitize(url);
  const regex = /\/u\/([a-zA-Z0-9]+)\/c\/([a-zA-Z0-9]+)/;
  const match = sanitizedURL.match(regex);
  if (!match) {
    throw new Error("Invalid URL format.");
  }

  const userId = match[1];
  const characterId = match[2];
  const docRef = doc(db, `users/${userId}/characters/${characterId}`);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("No such character exists.");
  }

  const characterData = { user: userId, character: characterId };
  await updateGameWithNewPlayer(gameId, gmId, characterData);
  return characterData;
};

export async function removePlayerFromGame(
  gameId: string,
  userId: string,
  characterId: string,
) {
  const gameDocRef = doc(db, `users/${userId}/games/${gameId}`);
  const gameDoc = await getDoc(gameDocRef);

  if (gameDoc.exists()) {
    const gameData = gameDoc.data();
    const updatedPlayers = gameData.players.filter(
      (player: PlayerListObject) => player.character !== characterId,
    );
    await setDoc(gameDocRef, { ...gameData, players: updatedPlayers });
  } else {
    console.error("Game does not exist");
  }
}

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type DeletePayload = {
  collection: string;
  docId: string;
  uid: string;
};

export const deleteDocument = async ({
  collection,
  docId,
  uid,
}: DeletePayload) => {
  if (!docId) {
    console.error("Document ID is undefined");
    return;
  }

  try {
    const docRef = doc(db, `users/${uid}/${collection}/${docId}`);
    await deleteDoc(docRef);
    console.info(`Document ${docId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

export function debounce(
  func: (...args: any[]) => void,
  wait: number,
): (...args: any[]) => void {
  let timeout: NodeJS.Timeout | null;

  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout as NodeJS.Timeout);
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
