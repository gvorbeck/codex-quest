import { Route, Routes } from "react-router-dom";
import PageLayout from "./components/PageLayout/PageLayout";
// import CharacterList from "./pages/CharacterList/CharacterList";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { Suspense, lazy, useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase.js";
import { ConfigProvider, Spin } from "antd";
// import Welcome from "./pages/Welcome/Welcome";
// import CharacterCreator from "./pages/CharacterCreator/CharacterCreator";
// import Sources from "./pages/Sources/Sources";

// Lazy load all the components that are routed
const CharacterList = lazy(() => import("./pages/CharacterList/CharacterList"));
const Welcome = lazy(() => import("./pages/Welcome/Welcome"));
const CharacterCreator = lazy(
  () => import("./pages/CharacterCreator/CharacterCreator")
);
const Sources = lazy(() => import("./pages/Sources/Sources"));
const CharacterSheet = lazy(
  () => import("./pages/CharacterSheet/CharacterSheet")
);
const GMPortal = lazy(() => import("./pages/GMPortal/GMPortal"));

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
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
        { merge: true }
      ); // Merge the data if document already exists
    } catch (error) {
      console.error("Failed to login and set user doc:", error);
    }
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
              <PageLayout user={user} handleLogin={handleLogin} auth={auth} />
            }
          >
            <Route
              index
              element={
                loading ? (
                  <Spin />
                ) : user ? (
                  <CharacterList user={user} />
                ) : (
                  <Welcome />
                )
              }
            />
            <Route
              path="u/:uid/c/:id"
              element={<CharacterSheet user={user} />}
            />
            <Route path="/create" element={<CharacterCreator />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/gm" element={<GMPortal />} />
          </Route>
        </Routes>
      </Suspense>
    </ConfigProvider>
  );
}

export default App;
