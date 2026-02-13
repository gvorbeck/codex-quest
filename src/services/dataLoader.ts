/**
 * Data loading service for lazy loading large datasets
 * Implements chunking and caching for better performance
 */

import type { Equipment, Spell } from "@/types";
import { EQUIPMENT_CATEGORIES, CHARACTER_CLASSES, CACHE_KEYS } from "@/constants";
import { logger, getSpellcastingBaseClass } from "@/utils";

// Constants for excluded spells
const EXCLUDED_SPELLS = {
  READ_MAGIC: "Read Magic",
} as const;

// Valid character class IDs for validation
const VALID_CLASS_IDS = new Set(Object.values(CHARACTER_CLASSES) as string[]);

// Type for raw equipment data from JSON (without amount property)
interface RawEquipmentData {
  id?: string;
  name: string;
  costValue: number;
  costCurrency: "gp" | "sp" | "cp";
  weight: number;
  category: string;
  subCategory?: string;
  // Weapon properties
  size?: "S" | "M" | "L";
  damage?: string;
  range?: [number, number, number];
  type?: string;
  ammo?: string[];
  twoHandedDamage?: string;
  // Armor properties
  AC?: number | string;
  // Animal properties
  animalWeight?: number;
  // Container properties
  lowCapacity?: number;
  capacity?: number;
}

// Cache entry with TTL
interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
}

// Cache for loaded data chunks with TTL (30 minutes)
const dataCache = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Check if cache entry is valid (not expired)
 */
function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_TTL;
}

/**
 * Get data from cache if valid
 */
function getCachedData<T>(key: string): T | null {
  const entry = dataCache.get(key) as CacheEntry<T> | undefined;
  if (entry && isCacheValid(entry)) {
    return entry.data;
  }
  if (entry) {
    dataCache.delete(key); // Remove expired entry
  }
  return null;
}

/**
 * Set data in cache with timestamp
 */
function setCachedData<T>(key: string, data: T): void {
  dataCache.set(key, { data, timestamp: Date.now() });
}

// Equipment categories for chunking - using centralized constants
export const DATA_LOADER_CATEGORIES = {
  WEAPONS: [
    EQUIPMENT_CATEGORIES.SWORDS,
    EQUIPMENT_CATEGORIES.AXES,
    EQUIPMENT_CATEGORIES.BOWS,
    EQUIPMENT_CATEGORIES.DAGGERS,
    EQUIPMENT_CATEGORIES.HAMMERS_AND_MACES,
    EQUIPMENT_CATEGORIES.CHAIN_AND_FLAIL,
    EQUIPMENT_CATEGORIES.SPEARS_AND_POLEARMS,
    EQUIPMENT_CATEGORIES.SLINGS_AND_HURLED_WEAPONS,
    EQUIPMENT_CATEGORIES.OTHER_WEAPONS,
    EQUIPMENT_CATEGORIES.IMPROVISED_WEAPONS,
  ],
  ARMOR: ["armor", "shields"],
  GENERAL: [EQUIPMENT_CATEGORIES.GENERAL],
  AMMUNITION: ["ammunition"],
  ANIMALS: [
    EQUIPMENT_CATEGORIES.BEASTS_OF_BURDEN,
    EQUIPMENT_CATEGORIES.BARDING,
  ],
} as const;

export type EquipmentCategory = keyof typeof DATA_LOADER_CATEGORIES;

/**
 * Lazy load equipment data by category
 */
export async function loadEquipmentByCategory(
  category: EquipmentCategory
): Promise<Equipment[]> {
  const cacheKey = `equipment-${category}`;

  const cached = getCachedData<Equipment[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Import the full equipment data (we'll optimize this further)
    const { default: allEquipment } = await import("@/data/equipment/equipment.json");

    // Filter by category and add default amount
    const categoryItems = (allEquipment as RawEquipmentData[])
      .filter((item) =>
        (DATA_LOADER_CATEGORIES[category] as readonly string[]).includes(
          item.category
        )
      )
      .map((item) => ({ ...item, amount: 0 })) as Equipment[];

    // Cache the result
    setCachedData(cacheKey, categoryItems);
    return categoryItems;
  } catch (error) {
    logger.error(`Error loading equipment category ${category}:`, error);
    return [];
  }
}

/**
 * Load all equipment data (fallback for when all categories are needed)
 */
export async function loadAllEquipment(): Promise<Equipment[]> {
  const cacheKey = CACHE_KEYS.EQUIPMENT_ALL;

  const cached = getCachedData<Equipment[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const { default: allEquipment } = await import("@/data/equipment/equipment.json");
    const equipment = (allEquipment as RawEquipmentData[]).map((item) => ({ ...item, amount: 0 })) as Equipment[];
    setCachedData(cacheKey, equipment);
    return equipment;
  } catch (error) {
    logger.error("Error loading all equipment:", error);
    return [];
  }
}

/**
 * Lazy load spells by class and level
 */
export async function loadSpellsForClass(
  classId: string,
  level?: number
): Promise<Spell[]> {
  // Validate classId for known classes (allow custom classes to pass through)
  if (!VALID_CLASS_IDS.has(classId) && !classId.startsWith('custom-')) {
    logger.warn(`Unknown class ID: ${classId}`);
  }

  // Map combination classes to their base spellcasting class for spell lookups
  const spellKeyToCheck = getSpellcastingBaseClass(classId);

  const cacheKey = level ? `spells-${classId}-${level}` : `spells-${classId}`;

  const cached = getCachedData<Spell[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const { default: allSpells } = await import("@/data/magic/spells.json");

    let filteredSpells = (allSpells as Spell[]).filter((spell) => {
      const spellLevel = spell.level[spellKeyToCheck as keyof typeof spell.level];
      return spellLevel !== null && spellLevel !== undefined;
    });

    if (level !== undefined) {
      filteredSpells = filteredSpells.filter((spell) => {
        const spellLevel = spell.level[spellKeyToCheck as keyof typeof spell.level];
        return spellLevel === level;
      });
    }

    // For magic-users at level 1, exclude Read Magic since they automatically know it
    // This applies to magic-user and combination classes with magic-user type
    if (spellKeyToCheck === CHARACTER_CLASSES.MAGIC_USER && level === 1) {
      filteredSpells = filteredSpells.filter(
        (spell) => spell.name !== EXCLUDED_SPELLS.READ_MAGIC
      );
    }

    setCachedData(cacheKey, filteredSpells);
    return filteredSpells;
  } catch (error) {
    logger.error(`Error loading spells for ${classId}:`, error);
    return [];
  }
}

/**
 * Load all level 1 spells for custom classes
 */
export async function loadAllFirstLevelSpells(): Promise<Spell[]> {
  const cacheKey = "spells-all-level-1";

  const cached = getCachedData<Spell[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const { default: allSpells } = await import("@/data/magic/spells.json");

    // Get all spells that are level 1 for any class
    const level1Spells = (allSpells as Spell[]).filter((spell) => {
      // Check if spell is level 1 for any class
      return Object.values(spell.level).includes(1);
    });

    // Exclude Read Magic since spellcasters automatically know it
    const filteredSpells = level1Spells.filter(
      (spell) => spell.name !== EXCLUDED_SPELLS.READ_MAGIC
    );

    setCachedData(cacheKey, filteredSpells);
    return filteredSpells;
  } catch (error) {
    logger.error("Error loading all first level spells:", error);
    return [];
  }
}

/**
 * Load all spells for custom classes (all levels)
 */
export async function loadAllSpells(): Promise<Spell[]> {
  const cacheKey = "spells-all";

  const cached = getCachedData<Spell[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const { default: allSpells } = await import("@/data/magic/spells.json");

    // Exclude Read Magic since spellcasters automatically know it
    const filteredSpells = (allSpells as Spell[]).filter(
      (spell) => spell.name !== EXCLUDED_SPELLS.READ_MAGIC
    );

    setCachedData(cacheKey, filteredSpells);
    return filteredSpells;
  } catch (error) {
    logger.error("Error loading all spells:", error);
    return [];
  }
}

/**
 * Preload critical data for initial app load
 */
export async function preloadCriticalData(): Promise<void> {
  try {
    // Preload only the most commonly used equipment categories
    await Promise.all([
      loadEquipmentByCategory("WEAPONS"),
      loadEquipmentByCategory("ARMOR"),
      // Load first level spells for common classes
      loadSpellsForClass(CHARACTER_CLASSES.MAGIC_USER, 1),
      loadSpellsForClass(CHARACTER_CLASSES.CLERIC, 1),
    ]);
  } catch (error) {
    logger.error("Error preloading critical data:", error);
  }
}

/**
 * Clear data cache (useful for memory management)
 */
export function clearDataCache(): void {
  dataCache.clear();
}

/**
 * Get cache status for debugging
 */
export function getDataCacheStatus(): { size: number; keys: string[] } {
  return {
    size: dataCache.size,
    keys: Array.from(dataCache.keys()),
  };
}
