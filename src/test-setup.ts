import { vi } from "vitest";

// Mock Firebase Analytics to prevent initialization errors during tests
vi.mock("firebase/analytics", () => ({ getAnalytics: vi.fn(() => ({})) }));

// Mock Firebase modules
vi.mock("firebase/app", () => ({ initializeApp: vi.fn(() => ({})) }));

vi.mock("firebase/firestore", () => ({ getFirestore: vi.fn(() => ({})) }));

vi.mock("firebase/auth", () => ({ getAuth: vi.fn(() => ({})) }));

vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(() => ({})),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
}));

// Set up test environment variables
Object.defineProperty(import.meta, "env", {
  value: {
    VITE_FIREBASE_API_KEY: "test-api-key",
    VITE_FIREBASE_AUTH_DOMAIN: "test-auth-domain",
    VITE_FIREBASE_PROJECT_ID: "test-project-id",
    VITE_FIREBASE_STORAGE_BUCKET: "test-storage-bucket",
    VITE_FIREBASE_MESSAGING_SENDER_ID: "test-sender-id",
    VITE_FIREBASE_APP_ID: "test-app-id",
    VITE_FIREBASE_MEASUREMENT_ID: "test-measurement-id",
  },
  writable: true,
});
