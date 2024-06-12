/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Get character by ID
export const getCharacter = functions.https.onRequest(async (req, res) => {
  const { userId, characterId } = req.params;
  try {
    const characterRef = db
      .collection("users")
      .doc(userId)
      .collection("characters")
      .doc(characterId);
    const doc = await characterRef.get();
    if (!doc.exists) {
      res.status(404).send("Character not found");
    } else {
      res.status(200).json(doc.data());
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});

// List characters for a user
export const listCharacters = functions.https.onRequest(async (req, res) => {
  const { userId } = req.params;
  try {
    const charactersRef = db
      .collection("users")
      .doc(userId)
      .collection("characters");
    const snapshot = await charactersRef.get();
    const characters = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(characters);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
