/**
 * Components barrel file
 * Centralized exports for all components in the application
 */

// UI components (reusable design system)
export * from "./ui";

// Feature components
export * from "./features/character";
export * from "./features/game";

// Domain components
export * from "./domain/dice";
export * from "./domain/spells";
export * from "./domain/equipment";

// App components
export * from "./app";

// Game components removed - use features/game directly

// Modal components
export * from "./modals";

// Page components
export * from "./pages";
