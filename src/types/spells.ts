/**
 * Shared type definitions for spell data (extends character types)
 */

import type { Spell } from "./character";

export interface SpellWithCategory extends Spell {
  category: string;
  [key: string]: unknown; // For Accordion compatibility
}

// Magic system types
export interface SpellTypeInfo {
  type: "orisons" | "cantrips";
  singular: "orison" | "cantrip";
  capitalized: "Orisons" | "Cantrips";
  capitalizedSingular: "Orison" | "Cantrip";
  abilityScore: "Intelligence" | "Wisdom" | "Intelligence/Wisdom";
}
