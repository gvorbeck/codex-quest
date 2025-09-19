/**
 * Mock authentication service implementation
 * Provides a fake user session for contributor onboarding and development
 */

import type { AuthUser } from "./auth";
import { logger } from "@/utils";

const STORAGE_KEY = "mock_auth_user";

/**
 * Mock user data for development and demos
 */
const MOCK_USER: AuthUser = {
  uid: "mock-user-123",
  email: "developer@localhost",
  displayName: "Mock Developer",
};

/**
 * Get the current mock user from localStorage or create one
 */
const getMockUser = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    logger.error("Failed to parse stored mock user:", error);
  }

  // Auto-sign in the mock user on first access
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USER));
  logger.info("🎭 Mock mode: Auto-signed in mock user:", MOCK_USER);
  return MOCK_USER;
};

/**
 * Save mock user to localStorage
 */
const saveMockUser = (user: AuthUser | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

/**
 * Mock implementation of signInWithEmail
 * Always succeeds and returns the mock user
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simple validation for demo purposes
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = { ...MOCK_USER, email };
  saveMockUser(user);
  logger.info("🎭 Mock mode: Signed in with email:", email);

  return user;
};

/**
 * Mock implementation of signUpWithEmail
 * Always succeeds and returns the mock user
 */
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Simple validation for demo purposes
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const user = { ...MOCK_USER, email };
  saveMockUser(user);
  logger.info("🎭 Mock mode: Signed up with email:", email);

  return user;
};

/**
 * Mock implementation of signInWithGoogle
 * Always succeeds and returns the mock user
 */
export const signInWithGoogle = async (): Promise<AuthUser> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const user = { ...MOCK_USER, email: "developer@gmail.com", displayName: "Mock Google User" };
  saveMockUser(user);
  logger.info("🎭 Mock mode: Signed in with Google");

  return user;
};

/**
 * Mock implementation of sendPasswordReset
 * Always succeeds (no actual email sent)
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));

  if (!email) {
    throw new Error("Email is required");
  }

  logger.info("🎭 Mock mode: Password reset email 'sent' to:", email);
};

/**
 * Mock implementation of signOut
 * Clears the mock user from localStorage
 */
export const signOut = async (): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));

  saveMockUser(null);
  logger.info("🎭 Mock mode: Signed out");
};

/**
 * Mock implementation of onAuthStateChange
 * Returns the current mock user state
 */
export const onAuthStateChange = (
  callback: (user: AuthUser | null) => void
): (() => void) => {
  // Immediately call with current state
  const currentUser = getMockUser();
  callback(currentUser);

  // Listen for localStorage changes (for multi-tab support)
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      try {
        const user = event.newValue ? JSON.parse(event.newValue) : null;
        callback(user);
      } catch (error) {
        logger.error("Failed to parse user from storage event:", error);
        callback(null);
      }
    }
  };

  window.addEventListener("storage", handleStorageChange);

  // Return unsubscribe function
  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
};

/**
 * Mock-specific utility: Get current user synchronously
 * Useful for components that need immediate access to user state
 */
export const getCurrentMockUser = (): AuthUser | null => {
  return getMockUser();
};

/**
 * Mock-specific utility: Force sign in as different user
 * Useful for testing different user scenarios
 */
export const signInAsUser = (userData: Partial<AuthUser>): AuthUser => {
  const user: AuthUser = {
    ...MOCK_USER,
    ...userData,
  };

  saveMockUser(user);
  logger.info("🎭 Mock mode: Forced sign in as:", user);

  return user;
};

/**
 * Mock-specific utility: Clear all auth data
 * Useful for testing signed-out states
 */
export const clearAuthData = (): void => {
  saveMockUser(null);
  logger.info("🎭 Mock mode: Cleared all auth data");
};