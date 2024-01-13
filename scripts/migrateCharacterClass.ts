import firebase from "firebase/compat/app";

const db = firebase.firestore();

// Step 1: Get all users
const usersRef = db.collection("users");
usersRef.get().then((userSnapshot) => {
  userSnapshot.forEach((userDoc) => {
    const userId = userDoc.id;

    // Step 2: For each user, get all characters
    const charactersRef = db.collection(`users/${userId}/characters`);
    charactersRef.get().then((characterSnapshot) => {
      characterSnapshot.forEach((characterDoc) => {
        const characterData = characterDoc.data();

        // Step 3: Check & Update
        if (typeof characterData.class === "string") {
          const newClassArray = characterData.class.split(" ");
          characterData.class = newClassArray;

          // Step 4: Update Firestore
          charactersRef.doc(characterDoc.id).update({
            class: newClassArray,
          });
        }
      });
    });
  });
});
