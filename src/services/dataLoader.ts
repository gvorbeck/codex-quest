/**
 * Data loading service for lazy loading large datasets
 * Implements chunking and caching for better performance
 */

import type { Equipment, Spell } from "@/types/character";
import { EQUIPMENT_CATEGORIES, CHARACTER_CLASSES } from "@/constants/gameData";
import { CACHE_KEYS } from "@/constants/storage";

// Cache for loaded data chunks
const dataCache = new Map<string, unknown>();

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
  ANIMALS: [EQUIPMENT_CATEGORIES.BEASTS_OF_BURDEN, EQUIPMENT_CATEGORIES.BARDING],
} as const;

export type EquipmentCategory = keyof typeof DATA_LOADER_CATEGORIES;

/**
 * Lazy load equipment data by category
 */
export async function loadEquipmentByCategory(
  category: EquipmentCategory
): Promise<Equipment[]> {
  const cacheKey = `equipment-${category}`;

  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey) as Equipment[];
  }

  try {
    // Import the full equipment data (we'll optimize this further)
    const { default: allEquipment } = await import("@/data/equipment.json");

    // Filter by category
    const categoryItems = (allEquipment as Equipment[]).filter((item) =>
      (DATA_LOADER_CATEGORIES[category] as readonly string[]).includes(
        item.category
      )
    );

    // Cache the result
    dataCache.set(cacheKey, categoryItems);
    return categoryItems;
  } catch (error) {
    console.error(`Failed to load equipment category ${category}:`, error);
    return [];
  }
}

/**
 * Load all equipment data (fallback for when all categories are needed)
 */
export async function loadAllEquipment(): Promise<Equipment[]> {
  const cacheKey = CACHE_KEYS.EQUIPMENT_ALL;

  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey) as Equipment[];
  }

  try {
    const { default: allEquipment } = await import("@/data/equipment.json");
    const equipment = allEquipment as Equipment[];
    dataCache.set(cacheKey, equipment);
    return equipment;
  } catch (error) {
    console.error("Failed to load all equipment:", error);
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
  const cacheKey = level ? `spells-${classId}-${level}` : `spells-${classId}`;

  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey) as Spell[];
  }

  try {
    const { default: allSpells } = await import("@/data/spells.json");

    let filteredSpells = (allSpells as Spell[]).filter((spell) => {
      const spellLevel = spell.level[classId as keyof typeof spell.level];
      return spellLevel !== null && spellLevel !== undefined;
    });

    if (level !== undefined) {
      filteredSpells = filteredSpells.filter((spell) => {
        const spellLevel = spell.level[classId as keyof typeof spell.level];
        return spellLevel === level;
      });
    }

    // For magic-users at level 1, exclude Read Magic since they automatically know it
    if (classId === CHARACTER_CLASSES.MAGIC_USER && level === 1) {
      filteredSpells = filteredSpells.filter(
        (spell) => spell.name !== "Read Magic"
      );
    }

    dataCache.set(cacheKey, filteredSpells);
    return filteredSpells;
  } catch (error) {
    console.error(`Failed to load spells for ${classId}:`, error);
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
    console.error("Failed to preload critical data:", error);
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
