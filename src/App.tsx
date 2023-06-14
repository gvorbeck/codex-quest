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
import { Suspense, lazy, useEffect, useState } from "react";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";
import { CharacterData } from "./components/types";
import { ConfigProvider, Spin } from "antd";
import Welcome from "./components/Welcome";
const CharacterSheet = lazy(
  () => import("./components/CharacterSheet/CharacterSheet")
);

// TODOS
// GENERAL:
// - message or toast like component for when character is saved.
// - better reload of character list for all appropriate events (refreshCharacters state var)

// BUILDER:
// - rework weapon options for combination classes
// - desktop styles

// Character Sheet
// - "add equipment" modal
// - BUG: Attack button in  attack modal creates console.error
console.log("THERE ARE STILL TODOS!!!!");

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [refreshCharacters, setRefreshCharacters] = useState(false);
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
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
      <Suspense fallback={<Spin />}>
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
              element={
                loading ? (
                  <Spin />
                ) : user ? (
                  <CharacterList
                    user={user}
                    characters={characters}
                    onCharacterDeleted={handleCharacterAdded}
                  />
                ) : (
                  <Welcome />
                )
              }
            />
            <Route
              path="u/:uid/c/:id"
              element={<CharacterSheet user={user} />}
            />
          </Route>
        </Routes>
      </Suspense>
    </ConfigProvider>
  );
}

export default App;
