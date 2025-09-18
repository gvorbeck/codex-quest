// Authentication service for Firebase
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Convert Firebase User to our AuthUser interface
const convertFirebaseUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
});

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return convertFirebaseUser(result.user);
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return convertFirebaseUser(result.user);
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<AuthUser> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return convertFirebaseUser(result.user);
};

// Send password reset email
export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Sign out
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

// Listen to auth state changes
export const onAuthStateChange = (
  callback: (user: AuthUser | null) => void
) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? convertFirebaseUser(user) : null);
  });
};
