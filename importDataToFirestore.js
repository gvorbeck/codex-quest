const db = require("./initializeFirebase");

const data = require("./equipment-items.json");

data.forEach(async (item) => {
  try {
    await db.collection("equipment").doc().set(item);
    console.log(`Added item: ${item.name}`);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});

// to run this in terminal `node importDataToFirestore.js`
