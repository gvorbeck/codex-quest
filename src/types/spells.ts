/**
 * Shared type definitions for spell data (extends character types)
 */

import type { Spell } from "./character";

export interface SpellWithCategory extends Spell {
  category: string;
  [key: string]: unknown; // For Accordion compatibility
}