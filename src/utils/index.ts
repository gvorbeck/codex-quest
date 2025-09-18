/**
 * Utils barrel file - exports all utility functions from consolidated files
 * Import everything from here: import { functionName } from "@/utils"
 */

// Character utilities
export * from "./character";

// Game mechanics (dice, combat, constants)
export * from "./mechanics";

// Magic (spells, cantrips, encounters)
export * from "./magic";

// UI utilities (formatting, styling, positioning, validation)
export * from "./ui";

// Currency utilities (BFRPG currency conversion, weights, normalization)
export * from "./currency";

// Data utilities (sanitization, logging, errors, GMBinder)
export * from "./data";

// Game content (monsters, treasure generation)
export * from "./content";

// Re-export validation utilities from validation module
export { Rules, ABILITY_NAMES } from '@/validation';