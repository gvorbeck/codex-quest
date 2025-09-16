/**
 * Source barrel file
 * Selective exports to avoid naming conflicts
 *
 * Use specific imports where conflicts exist:
 * - Components and Types both have Equipment
 * - Types and Constants have overlapping category types
 */

// Non-conflicting module exports
export * from "./hooks";
export * from "./utils";
export * from "./data";
export * from "./services";
export * from "./lib";
export * from "./validation";

// Specific exports to avoid conflicts
export {
  // Export specific types to avoid conflicts
  type CurrencyKey,
  type Character,
  type Game,
  type Monster,
  type Spell,
} from "./types";

export {
  // Export specific constants to avoid conflicts
  CURRENCY_TO_COPPER_RATES,
  CHARACTER_CLASSES,
  EQUIPMENT_CATEGORIES,
} from "./constants";
