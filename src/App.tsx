import { useEffect, useState } from "react";
import { auth } from "./firebase.js";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { Layout } from "antd";
import Header from "./components/Header";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // This observer is triggered when the user logs in or out
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Clean up the observer when the component is unmounted
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
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
