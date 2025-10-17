/**
 * Equipment-related type definitions
 * Includes equipment items, packs, categories, and restriction validation types
 */

import type { Race, Class } from "./character";

// ============================================================================
// EQUIPMENT CORE TYPES
// ============================================================================

export interface Equipment {
  name: string;
  costValue: number;
  costCurrency: "gp" | "sp" | "cp";
  weight: number;
  category: string;
  subCategory?: string;
  amount: number;
  // Weapon properties
  size?: "S" | "M" | "L";
  damage?: string;
  twoHandedDamage?: string;
  type?: "melee" | "missile" | "both";
  range?: [number, number, number];
  ammo?: string[];
  // Armor properties
  AC?: number | string;
  missileAC?: string;
  // Beast of burden properties
  lowCapacity?: number;
  capacity?: number;
  animalWeight?: number;
  // Equipment with gold amount
  gold?: number;
  wearing?: boolean; // For armor and shields
  description?: string; // Optional description for the equipment
  // Magic item properties for scrolls
  isScroll?: boolean;
  scrollSpell?: string;
  scrollLevel?: number;
}

// ============================================================================
// EQUIPMENT PACK TYPES
// ============================================================================

export interface PackItem {
  /** The unique ID of the equipment item from equipment.json */
  equipmentId: string;
  /** How many of this item to include in the pack */
  quantity: number;
  /** Optional description of why this item is included in the pack */
  description?: string;
}

/** @deprecated Use PackItem with equipmentId instead */
export interface LegacyPackItem {
  /** The exact name of the equipment item as it appears in equipment.json */
  equipmentName: string;
  /** How many of this item to include in the pack */
  quantity: number;
  /** Optional description of why this item is included in the pack */
  description?: string;
}

export interface EquipmentPack {
  /** Unique identifier for the pack */
  id: string;
  /** Display name of the pack */
  name: string;
  /** Description explaining what the pack is for */
  description: string;
  /** Total cost in gold pieces */
  cost: number;
  /** Total weight in pounds */
  weight: number;
  /** List of equipment items included in this pack */
  items: PackItem[];
  /** Array of class types this pack is suitable for. Empty array means suitable for all classes */
  suitableFor: string[];
}

export interface PackApplicationResult {
  /** Whether the pack was successfully applied */
  success: boolean;
  /** Error message if application failed */
  error?: string;
  /** Items that couldn't be found in equipment.json */
  missingItems?: string[];
  /** Total cost of items that were successfully added */
  totalCost?: number;
  /** Total weight of items that were successfully added */
  totalWeight?: number;
}

// ============================================================================
// EQUIPMENT CATEGORY TYPES
// ============================================================================

export type EquipmentCategory =
  | "general-equipment"
  | "swords"
  | "axes"
  | "bows"
  | "daggers"
  | "hammers-and-maces"
  | "chain-and-flail"
  | "spears-and-polearms"
  | "slings-and-hurled-weapons"
  | "other-weapons"
  | "improvised-weapons"
  | "beasts-of-burden"
  | "barding";

// ============================================================================
// EQUIPMENT RESTRICTION TYPES
// ============================================================================

/**
 * Restriction data structure for equipment validation
 * Used to determine if a character can use specific equipment based on their race and classes
 */
export interface RestrictionData {
  race: Race | undefined;
  classes: Class[];
  currency: number;
}

/**
 * Restriction result structure
 * Indicates whether equipment is restricted and provides a reason if it is
 */
export interface RestrictionResult {
  restricted: boolean;
  reason?: string;
}
