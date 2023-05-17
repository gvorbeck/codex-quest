// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9y_8tsKOb2sJ6qj5TYfe_fXw8RZENaa4",
  authDomain: "codex-quest.firebaseapp.com",
  projectId: "codex-quest",
  storageBucket: "codex-quest.appspot.com",
  messagingSenderId: "867283696161",
  appId: "1:867283696161:web:d3bf77fb72d022d25b4160",
  measurementId: "G-N2X49ED4XN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore();

// Initialize Firebase Authentication
const auth = getAuth();

// Initialize Firebase Storage
const storage = getStorage();

export { app, analytics, db, auth, storage };
