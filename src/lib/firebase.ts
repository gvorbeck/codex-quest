// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_ENV_KEYS } from "@/constants";

// Validate required environment variables
const requiredEnvVars = [
  FIREBASE_ENV_KEYS.API_KEY,
  FIREBASE_ENV_KEYS.AUTH_DOMAIN,
  FIREBASE_ENV_KEYS.PROJECT_ID,
  FIREBASE_ENV_KEYS.STORAGE_BUCKET,
  FIREBASE_ENV_KEYS.MESSAGING_SENDER_ID,
  FIREBASE_ENV_KEYS.APP_ID,
] as const;

requiredEnvVars.forEach(varName => {
  if (!import.meta.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const firebaseConfig = {
  apiKey: import.meta.env[FIREBASE_ENV_KEYS.API_KEY],
  authDomain: import.meta.env[FIREBASE_ENV_KEYS.AUTH_DOMAIN],
  projectId: import.meta.env[FIREBASE_ENV_KEYS.PROJECT_ID],
  storageBucket: import.meta.env[FIREBASE_ENV_KEYS.STORAGE_BUCKET],
  messagingSenderId: import.meta.env[FIREBASE_ENV_KEYS.MESSAGING_SENDER_ID],
  appId: import.meta.env[FIREBASE_ENV_KEYS.APP_ID],
  measurementId: import.meta.env[FIREBASE_ENV_KEYS.MEASUREMENT_ID],
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
