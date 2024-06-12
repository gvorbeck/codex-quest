import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

admin.initializeApp();
const db = admin.firestore();
const corsHandler = cors({ origin: true });

// Get character by ID
export const getCharacter = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    const { userId, characterId } = req.query;
    try {
      const characterRef = db
        .collection("users")
        .doc(userId as string)
        .collection("characters")
        .doc(characterId as string);
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
});

// List characters for a user
export const listCharacters = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    const { userId } = req.query;
    try {
      const charactersRef = db
        .collection("users")
        .doc(userId as string)
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
});
