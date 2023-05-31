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
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase.js";
import CharacterSheet from "./components/CharacterSheet";

// TODOS
// GRAND SCHEME:
// done -- MAYBE ONE STATE OBJECT CALLED "CHARACTER" INSTEAD OF 1298239873493587????
// done -- MOVE EQUIPMENT OUT OF FIRESTORE AND INTO JSON
// TOS, PRIVACY POLICY, COOKIE POLICY: APP.TERMLY.IO
// GOOGLE ANALYTICS
// REACT ROUTER DOM

// BUILDER:
// - ARMOR NOT COSTING GOLD
// - WEIGHT MAXES AND LABELS
// - "DONE" FUNCTION
// - TEST IMG UPLOAD ON PROD

// NPM RUN BUILD HAD LARGE BUNDLE WARNING:
// - LOOK INTO CODE SPLITTING (like only loading the createcharacter shit if they click the button) https://create-react-app.dev/docs/code-splitting/
// - ANALYZE BUNDLE SIZE: https://create-react-app.dev/docs/analyzing-the-bundle-size/

// LIST CHARS
// - CARDS FOR CREATED CHARACTERS

// INTERACTIVE CHARACTER SHEET
console.log("THERE ARE STILL TODOS!!!!");

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [refreshCharacters, setRefreshCharacters] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <CharacterList user={user} refreshCharacters={refreshCharacters} />
          }
        />
        <Route path="/character/:id" element={<CharacterSheet />} />
      </Route>
    </Routes>
  );
}

export default App;
