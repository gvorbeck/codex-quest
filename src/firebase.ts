// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// Lazy load analytics only when needed
let analytics: any = null;
const getAnalytics = async () => {
  if (!analytics) {
    const { getAnalytics: loadAnalytics } = await import("firebase/analytics");
    analytics = loadAnalytics();
  }
  return analytics;
};

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore();

// Initialize Firebase Authentication
const auth = getAuth();

// Initialize Firebase Storage
const storage = getStorage();

export { app, getAnalytics, db, auth, storage, ref, uploadBytes };
