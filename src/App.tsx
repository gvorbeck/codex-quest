import { useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase.js"; // import Firestore instance
import { Layout } from "antd";
import HeaderContent from "./components/HeaderContent";
import CharacterList from "./components/CharacterList";
import FooterContent from "./components/FooterContent";

// TODOS
// GRAND SCHEME:
// done -- MAYBE ONE STATE OBJECT CALLED "CHARACTER" INSTEAD OF 1298239873493587????
// done -- MOVE EQUIPMENT OUT OF FIRESTORE AND INTO JSON

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

const { Header, Footer, Content } = Layout;

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
    <Layout>
      <Header>
        <HeaderContent
          user={user}
          handleLogin={handleLogin}
          auth={auth}
          onCharacterAdded={handleCharacterAdded}
        />
      </Header>
      <Content>
        <CharacterList user={user} refreshCharacters={refreshCharacters} />
      </Content>
      <Footer>
        <FooterContent />
      </Footer>
    </Layout>
  );
}

export default App;
