import { Route, Routes } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import CharacterList from "./components/CharacterList";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";
import CharacterSheet from "./components/CharacterSheet/CharacterSheet";
import { CharacterData } from "./components/types";
import { ConfigProvider, theme } from "antd";

console.log("DEV: antd theme", theme);
// TODOS
// GENERAL:
// - TOS, PRIVACY POLICY, COOKIE POLICY: APP.TERMLY.IO
// - GOOGLE ANALYTICS
// - message or toast like component for when character is saved.
// - buying enough equipment to get to 0 gold disables next button.
// - welcome screen with sample sheet
// - Tablet / Mobile styles

// BUILDER:
// - ARMOR NOT COSTING GOLD
// - WEIGHT MAXES AND LABELS
// - TEST IMG UPLOAD ON PROD
// - RESET CHOICES WHEN GOING BACK (HP MAX IS NEW!)
// - limit gold decimal space to 2
// - Class restrictions to weapon choices!

// Character Sheet
// - Thiefs: Have row of thief ability table appropriate to character level with buttons to execute said action
// - make all relevant fields updatable
// - "add equipment" modal
// - "Attack" button
// - "Cast" button?

// NPM RUN BUILD HAD LARGE BUNDLE WARNING:
// - LOOK INTO CODE SPLITTING (like only loading the createcharacter shit if they click the button) https://create-react-app.dev/docs/code-splitting/
// - ANALYZE BUNDLE SIZE: https://create-react-app.dev/docs/analyzing-the-bundle-size/
console.log("THERE ARE STILL TODOS!!!!");

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [refreshCharacters, setRefreshCharacters] = useState(false);
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const auth = getAuth();

  const fetchCharacters = async () => {
    if (user) {
      const uid = user.uid;
      const charactersCollectionRef = collection(db, `users/${uid}/characters`);
      const characterSnapshot = await getDocs(charactersCollectionRef);

      const characters = characterSnapshot.docs.map((doc) => {
        const data = doc.data() as CharacterData;
        data.id = doc.id;
        return data;
      });
      setCharacters(characters);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCharacters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (refreshCharacters) {
      fetchCharacters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCharacters]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create a document for the user in the 'users' collection
      const userDocRef = doc(db, "users", user.uid);

      setDoc(
        userDocRef,
        {
          name: user.displayName,
          email: user.email,
          // add any additional fields here
        },
        { merge: true }
      ); // Merge the data if document already exists
    } catch (error) {
      console.error(error);
    }
  };

  // Handle character added
  const handleCharacterAdded = () => {
    setRefreshCharacters(!refreshCharacters);
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#F9B32A",
        },
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <PageLayout
              user={user}
              handleLogin={handleLogin}
              auth={auth}
              onCharacterAdded={handleCharacterAdded}
            />
          }
        >
          <Route
            index
            element={<CharacterList user={user} characters={characters} />}
          />
          <Route path="u/:uid/c/:id" element={<CharacterSheet user={user} />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}

export default App;
