import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase.js"; // import your Firestore instance
import { Layout } from "antd";
import Header from "./components/Header";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState<User | null>(null);
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

  return (
    <Layout>
      <Header user={user} handleLogin={handleLogin} auth={auth} />
    </Layout>
  );
}

export default App;
