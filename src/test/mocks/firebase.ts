// Firebase service mocking for unit tests
// Provides mock implementations of Firebase Auth and Firestore operations

import { vi } from "vitest";

// Mock Firebase Auth
export const mockFirebaseAuth = {
  currentUser: {
    uid: "test-user-123",
    email: "test@example.com",
    displayName: "Test User",
  },

  signInWithEmailAndPassword: vi.fn().mockResolvedValue({
    user: {
      uid: "test-user-123",
      email: "test@example.com",
    },
  }),

  createUserWithEmailAndPassword: vi.fn().mockResolvedValue({
    user: {
      uid: "test-user-123",
      email: "test@example.com",
    },
  }),

  signOut: vi.fn().mockResolvedValue(undefined),

  onAuthStateChanged: vi.fn(),
};

// Mock Firestore
export const mockFirestore = {
  collection: vi.fn(() => ({
    doc: vi.fn(() => ({
      get: vi.fn().mockResolvedValue({
        exists: true,
        data: vi.fn().mockReturnValue({ name: "Test Character" }),
      }),
      set: vi.fn().mockResolvedValue(undefined),
      update: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    })),

    add: vi.fn().mockResolvedValue({
      id: "test-doc-id",
    }),

    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),

    get: vi.fn().mockResolvedValue({
      docs: [
        {
          id: "test-doc-id",
          data: vi.fn().mockReturnValue({ name: "Test Character" }),
        },
      ],
    }),
  })),
};

// Helper to reset all mocks
export const resetFirebaseMocks = () => {
  vi.clearAllMocks();
};
