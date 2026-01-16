/**
 * Equipment utilities - extracted from character.ts for better organization
 */

import type {
  Character,
  Equipment,
  EquipmentPack,
  PackApplicationResult,
  RestrictionData,
  RestrictionResult,
} from "@/types";
import { allClasses } from "@/data";
import {
  convertToGoldFromAbbreviation,
  formatCurrency,
} from "@/utils/currency";
import {
  CURRENCY_TYPES,
  WEAPON_ID_MAPPING,
  ARMOR_ID_MAPPING,
} from "@/constants";
import { logger } from "./data";
import equipmentData from "@/data/equipment/equipment.json";
import equipmentPacks from "@/data/equipment/equipmentPacks.json";

// ============================================================================
// CONSTANTS
// ============================================================================

export const CAPACITY_ROUNDING_FACTOR = 5;
export const WEIGHT_PRECISION = 100;

// Supported currencies for equipment costs
const SUPPORTED_EQUIPMENT_CURRENCIES = [
  CURRENCY_TYPES.GOLD,
  CURRENCY_TYPES.SILVER,
  CURRENCY_TYPES.COPPER,
] as const;

// ============================================================================
// EQUIPMENT TYPE CHECKING
// ============================================================================

export const isArmorItem = (item: Equipment): boolean =>
  item.category?.toLowerCase().includes("armor") ||
  (item.AC !== undefined && !item.category?.toLowerCase().includes("shield"));

export const isShieldItem = (item: Equipment): boolean =>
  item.category?.toLowerCase().includes("shield");

export const isWearableItem = (item: Equipment): boolean =>
  isArmorItem(item) || isShieldItem(item);

export const isWornArmor = (
  item: Equipment
): item is Equipment & { AC: number } =>
  Boolean(
    item.wearing &&
      typeof item.AC === "number" &&
      item.category &&
      !item.category.toLowerCase().includes("shield")
  );

export const isWornShield = (
  item: Equipment
): item is Equipment & { AC: string } =>
  Boolean(
    item.wearing &&
      typeof item.AC === "string" &&
      item.category?.toLowerCase().includes("shield")
  );

// ============================================================================
// EQUIPMENT UTILITY FUNCTIONS
// ============================================================================

export const cleanEquipmentArray = (equipment: Equipment[]): Equipment[] => {
  return equipment.filter((item) => item.amount > 0);
};

export const ensureEquipmentAmount = (equipment: Equipment): Equipment => {
  return { ...equipment, amount: Math.max(1, equipment.amount || 0) };
};

export const formatWeight = (weight: number, amount: number): string => {
  const totalWeight = weight * amount;
  return totalWeight > 0
    ? `${Math.round(totalWeight * WEIGHT_PRECISION) / WEIGHT_PRECISION} lbs`
    : "—";
};

export const formatCost = (
  costValue: number,
  costCurrency: string,
  amount: number
): string => {
  const totalCost = costValue * amount;
  return `${totalCost} ${costCurrency}`;
};

// ============================================================================
// EQUIPMENT LOOKUP AND CACHING
// ============================================================================

// Equipment lookup cache for performance
const equipmentCache = new Map<string, Equipment | null>();

// Lazy-initialized equipment lookup maps for O(1) performance
let equipmentLookupMapByName: Map<string, Record<string, unknown>> | null =
  null;
let equipmentLookupMapById: Map<string, Record<string, unknown>> | null = null;

// Lazy initialization of equipment lookup maps - only when needed
function initializeEquipmentMaps() {
  if (equipmentLookupMapByName && equipmentLookupMapById) {
    return; // Already initialized
  }

  equipmentLookupMapByName = new Map();
  equipmentLookupMapById = new Map();

  equipmentData.forEach((item) => {
    if (
      typeof item === "object" &&
      item &&
      typeof item["name"] === "string" &&
      typeof item["id"] === "string"
    ) {
      const itemRecord = item as Record<string, unknown>;
      equipmentLookupMapByName!.set(item["name"], itemRecord);
      equipmentLookupMapById!.set(item["id"], itemRecord);
    }
  });

  logger.info(
    `Initialized equipment lookup with ${equipmentLookupMapById.size} items`
  );
}

/**
 * Type guard for raw equipment data from JSON
 */
function isValidRawEquipment(item: Record<string, unknown>): boolean {
  return (
    typeof item["name"] === "string" &&
    typeof item["costValue"] === "number" &&
    SUPPORTED_EQUIPMENT_CURRENCIES.includes(
      item["costCurrency"] as (typeof SUPPORTED_EQUIPMENT_CURRENCIES)[number]
    ) &&
    typeof item["weight"] === "number" &&
    typeof item["category"] === "string"
  );
}

/**
 * Copy weapon-related optional properties from raw data to equipment
 */
function copyWeaponProperties(
  equipment: Equipment,
  rawEquipment: Record<string, unknown>
): void {
  if (typeof rawEquipment["size"] === "string") {
    equipment.size = rawEquipment["size"] as "S" | "M" | "L";
  }
  if (typeof rawEquipment["damage"] === "string") {
    equipment.damage = rawEquipment["damage"];
  }
  if (typeof rawEquipment["twoHandedDamage"] === "string") {
    equipment.twoHandedDamage = rawEquipment["twoHandedDamage"];
  }
  if (typeof rawEquipment["type"] === "string") {
    equipment.type = rawEquipment["type"] as "melee" | "missile" | "both";
  }
  if (
    Array.isArray(rawEquipment["range"]) &&
    rawEquipment["range"].length === 3
  ) {
    equipment.range = rawEquipment["range"] as [number, number, number];
  }
  if (Array.isArray(rawEquipment["ammo"])) {
    equipment.ammo = rawEquipment["ammo"] as string[];
  }
}

/**
 * Copy armor and misc optional properties from raw data to equipment
 */
function copyArmorAndMiscProperties(
  equipment: Equipment,
  rawEquipment: Record<string, unknown>
): void {
  if (
    typeof rawEquipment["AC"] === "number" ||
    typeof rawEquipment["AC"] === "string"
  ) {
    equipment.AC = rawEquipment["AC"];
  }
  if (typeof rawEquipment["missileAC"] === "string") {
    equipment.missileAC = rawEquipment["missileAC"];
  }
  if (typeof rawEquipment["lowCapacity"] === "number") {
    equipment.lowCapacity = rawEquipment["lowCapacity"];
  }
  if (typeof rawEquipment["capacity"] === "number") {
    equipment.capacity = rawEquipment["capacity"];
  }
  if (typeof rawEquipment["animalWeight"] === "number") {
    equipment.animalWeight = rawEquipment["animalWeight"];
  }
}

/**
 * Convert raw equipment data to Equipment type with proper type safety
 */
function convertRawToEquipment(
  rawEquipment: Record<string, unknown>
): Equipment {
  const equipment: Equipment = {
    name: rawEquipment["name"] as string,
    costValue: rawEquipment["costValue"] as number,
    costCurrency: rawEquipment["costCurrency"] as "gp" | "sp" | "cp",
    weight: rawEquipment["weight"] as number,
    category: rawEquipment["category"] as string,
    subCategory:
      typeof rawEquipment["subCategory"] === "string"
        ? rawEquipment["subCategory"]
        : "",
    amount: 1, // Default amount, will be overridden by pack quantity
  };

  copyWeaponProperties(equipment, rawEquipment);
  copyArmorAndMiscProperties(equipment, rawEquipment);

  return equipment;
}

/**
 * Find equipment by ID with caching and type safety
 * This is the preferred method for looking up equipment
 */
export function findEquipmentById(id: string): Equipment | null {
  // Ensure maps are initialized
  initializeEquipmentMaps();

  // Check cache first
  const cacheKey = `id:${id}`;
  if (equipmentCache.has(cacheKey)) {
    return equipmentCache.get(cacheKey) || null;
  }

  const rawEquipment = equipmentLookupMapById!.get(id);
  if (!rawEquipment || !isValidRawEquipment(rawEquipment)) {
    equipmentCache.set(cacheKey, null);
    return null;
  }

  const equipment = convertRawToEquipment(rawEquipment);

  // Cache the result
  equipmentCache.set(cacheKey, equipment);
  return equipment;
}

/**
 * Efficient equipment lookup using an array of equipment IDs
 * Returns an array of Equipment items matching the provided IDs
 */
export function equipmentLookup(equipmentIds: string[]): Equipment[] {
  return equipmentIds
    .map((id) => findEquipmentById(id))
    .filter((equipment): equipment is Equipment => equipment !== null);
}

// ============================================================================
// EQUIPMENT PACK UTILITIES
// ============================================================================

/**
 * Process pack items to calculate totals - shared logic for validation and application
 */
function processPackItems(packItems: EquipmentPack["items"]): {
  missingItems: string[];
  totalCost: number;
  totalWeight: number;
  validEquipment: Array<{ equipment: Equipment; quantity: number }>;
} {
  const missingItems: string[] = [];
  const validEquipment: Array<{ equipment: Equipment; quantity: number }> = [];
  let totalCost = 0;
  let totalWeight = 0;

  for (const packItem of packItems) {
    const equipment = findEquipmentById(packItem.equipmentId);

    if (!equipment) {
      missingItems.push(packItem.equipmentId);
      continue;
    }

    validEquipment.push({ equipment, quantity: packItem.quantity });
    totalCost +=
      convertToGoldFromAbbreviation(
        equipment.costValue,
        equipment.costCurrency
      ) * packItem.quantity;
    totalWeight += equipment.weight * packItem.quantity;
  }

  return { missingItems, totalCost, totalWeight, validEquipment };
}

/**
 * Apply an equipment pack to a character (validation only)
 */
export function applyEquipmentPack(
  character: Character,
  pack: EquipmentPack
): PackApplicationResult {
  // Check if character has enough gold
  if (character.currency.gold < pack.cost) {
    return {
      success: false,
      error: `Not enough gold. Need ${
        pack.cost
      } gp but only have ${formatCurrency(character.currency)}.`,
    };
  }

  const { missingItems, totalCost, totalWeight } = processPackItems(pack.items);

  // If there are missing items, return error
  if (missingItems.length > 0) {
    return {
      success: false,
      error: `Could not find equipment items: ${missingItems.join(
        ", "
      )}. Please check that these items exist in the equipment database.`,
      missingItems,
    };
  }

  return {
    success: true,
    totalCost,
    totalWeight,
  };
}

/**
 * Apply equipment pack to character and return updated character
 */
export function applyEquipmentPackToCharacter(
  character: Character,
  pack: EquipmentPack
): { character: Character; result: PackApplicationResult } {
  // Check if character has enough gold
  if (character.currency.gold < pack.cost) {
    return {
      character,
      result: {
        success: false,
        error: `Not enough gold. Need ${
          pack.cost
        } gp but only have ${formatCurrency(character.currency)}.`,
      },
    };
  }

  // Process pack items once
  const { missingItems, totalCost, totalWeight, validEquipment } =
    processPackItems(pack.items);

  // If there are missing items, return error
  if (missingItems.length > 0) {
    return {
      character,
      result: {
        success: false,
        error: `Could not find equipment items: ${missingItems.join(
          ", "
        )}. Please check that these items exist in the equipment database.`,
        missingItems,
      },
    };
  }

  // Build new equipment list by merging with existing equipment
  const newEquipment = [...character.equipment];

  for (const { equipment, quantity } of validEquipment) {
    // Check if equipment already exists in character's inventory
    const existingIndex = newEquipment.findIndex(
      (item) => item.name === equipment.name
    );

    if (existingIndex >= 0 && newEquipment[existingIndex]) {
      // Add to existing quantity
      newEquipment[existingIndex] = {
        ...newEquipment[existingIndex],
        amount: newEquipment[existingIndex].amount + quantity,
      };
    } else {
      // Add new equipment with the specified quantity
      newEquipment.push({ ...equipment, amount: quantity });
    }
  }

  // Deduct gold from character
  const updatedCharacter: Character = {
    ...character,
    equipment: newEquipment,
    currency: {
      ...character.currency,
      gold: character.currency.gold - pack.cost,
    },
  };

  return {
    character: updatedCharacter,
    result: {
      success: true,
      totalCost,
      totalWeight,
    },
  };
}

/**
 * Get equipment packs suitable for a character's class
 * Uses the suitableFor property to match against character's class types
 */
export function getEquipmentPacksByClass(
  character: Character
): EquipmentPack[] {
  // Get the character's class type
  const classType = allClasses.find((cls) => cls.id === character.class)
    ?.classType;

  // Filter packs based on suitableFor property
  return equipmentPacks.filter((pack) => {
    // If suitableFor is empty, pack is suitable for all classes
    if (pack.suitableFor.length === 0) {
      return true;
    }

    // Check if the character's class type matches the pack's suitableFor
    return classType && pack.suitableFor.includes(classType);
  });
}

/**
 * Calculate total cost and weight of a pack
 */
export function calculatePackTotals(pack: EquipmentPack): {
  totalCost: number;
  totalWeight: number;
  missingItems: string[];
} {
  const { missingItems, totalCost, totalWeight } = processPackItems(pack.items);
  return { totalCost, totalWeight, missingItems };
}

// ============================================================================
// EQUIPMENT RESTRICTION UTILITIES
// ============================================================================

/**
 * Creates an equipment ID from the equipment name by converting to lowercase and replacing spaces with hyphens
 */
export function createEquipmentId(name: string): string {
  return name.toLowerCase().replaceAll(/\s+/g, "-");
}

/**
 * Checks if an equipment name matches a restriction ID
 */
export function isEquipmentMatchingRestriction(
  equipmentName: string,
  restrictionId: string
): boolean {
  const equipmentId = createEquipmentId(equipmentName);
  const mappedNames = WEAPON_ID_MAPPING[restrictionId];

  if (mappedNames) {
    return mappedNames.includes(equipmentId);
  }

  // Fallback to direct ID comparison
  return equipmentId === restrictionId;
}

/**
 * Creates a restriction result object
 */
export function createRestriction(entityName: string): RestrictionResult {
  return {
    restricted: true,
    reason: `${entityName} Restriction`,
  };
}

/**
 * Checks if equipment is allowed based on a list of allowed items and mapping
 */
export function isEquipmentInAllowedList(
  equipmentName: string,
  allowedList: string[],
  mapping: Record<string, string[]>
): boolean {
  const equipmentId = createEquipmentId(equipmentName);

  for (const allowedItem of allowedList) {
    const mappedNames = mapping[allowedItem];
    if (mappedNames) {
      if (mappedNames.includes(equipmentId)) {
        return true;
      }
    } else if (equipmentId === allowedItem) {
      // Fallback to direct ID comparison
      return true;
    }
  }

  return false;
}

/**
 * Checks weapon restrictions based on race prohibitions
 */
function checkRaceWeaponRestriction(
  equipment: Equipment,
  restrictionData: RestrictionData
): RestrictionResult | null {
  const prohibitedWeapons = restrictionData.race?.prohibitedWeapons;
  if (!prohibitedWeapons) {
    return null;
  }

  // Check specific prohibited weapons
  for (const prohibitedWeapon of prohibitedWeapons) {
    if (isEquipmentMatchingRestriction(equipment.name, prohibitedWeapon)) {
      return createRestriction(restrictionData.race!.name);
    }
  }

  // Check for size-based restrictions (Large weapons for small races)
  if (equipment.size === "L" && prohibitedWeapons.includes("large")) {
    return createRestriction(restrictionData.race!.name);
  }

  return null;
}

/**
 * Checks weapon restrictions based on class allowedWeapons lists
 * Uses UNION logic: if ANY class allows the weapon, it's usable
 */
function checkClassWeaponRestriction(
  equipment: Equipment,
  classes: RestrictionData["classes"]
): RestrictionResult | null {
  // Empty allowedWeapons array means NO restrictions (can use all weapons)
  const hasUnrestrictedClass = classes.some(
    (cls) => cls?.allowedWeapons?.length === 0
  );

  if (hasUnrestrictedClass) {
    return { restricted: false };
  }

  // Get classes that DO have weapon restrictions (non-empty allowedWeapons)
  const classesWithRestrictions = classes.filter(
    (cls) => cls?.allowedWeapons && cls.allowedWeapons.length > 0
  );

  if (classesWithRestrictions.length === 0) {
    return { restricted: false };
  }

  // Check if ANY class allows this weapon
  const isAllowedByAnyClass = classesWithRestrictions.some((characterClass) =>
    isEquipmentInAllowedList(
      equipment.name,
      characterClass.allowedWeapons,
      WEAPON_ID_MAPPING
    )
  );

  if (!isAllowedByAnyClass) {
    return createRestriction(classesWithRestrictions[0]!.name);
  }

  return null;
}

/**
 * Checks armor restrictions based on class allowedArmor lists
 * Uses UNION logic: if ANY class allows the armor, it's usable
 */
function checkClassArmorRestriction(
  equipment: Equipment,
  classes: RestrictionData["classes"]
): RestrictionResult | null {
  // Empty allowedArmor array means NO restrictions (can use all armor)
  const hasUnrestrictedClass = classes.some(
    (cls) => cls?.allowedArmor?.length === 0
  );

  if (hasUnrestrictedClass) {
    return { restricted: false };
  }

  // Get classes that DO have armor restrictions (non-empty allowedArmor)
  const classesWithRestrictions = classes.filter(
    (cls) => cls?.allowedArmor && cls.allowedArmor.length > 0
  );

  if (classesWithRestrictions.length === 0) {
    return { restricted: false };
  }

  // Check for "none" restriction (absolute prohibition on armor)
  const allClassesProhibitArmor = classesWithRestrictions.every(
    (characterClass) => characterClass.allowedArmor.includes("none")
  );

  if (allClassesProhibitArmor) {
    return createRestriction(classesWithRestrictions[0]!.name);
  }

  // Check if ANY class allows this armor
  const isAllowedByAnyClass = classesWithRestrictions.some(
    (characterClass) =>
      !characterClass.allowedArmor.includes("none") &&
      isEquipmentInAllowedList(
        equipment.name,
        characterClass.allowedArmor,
        ARMOR_ID_MAPPING
      )
  );

  if (!isAllowedByAnyClass) {
    return createRestriction(classesWithRestrictions[0]!.name);
  }

  return null;
}

/**
 * Checks if an equipment item is restricted for the character based on pre-calculated restriction data
 *
 * For combination classes (multi-class characters), uses UNION logic:
 * - If ANY class allows the equipment, the character can use it
 * - This matches BFRPG rules where combination classes get the best of both classes
 *
 * CRITICAL: Empty allowedWeapons/allowedArmor arrays mean NO restrictions!
 * - Fighter has allowedWeapons: [] = can use ALL weapons
 * - Fighter has allowedArmor: [] = can use ALL armor
 *
 * @param equipment - The equipment item to check
 * @param restrictionData - Character's race, classes, and currency data
 * @returns Restriction result with boolean and optional reason
 */
export function isEquipmentRestricted(
  equipment: Equipment,
  restrictionData: RestrictionData
): RestrictionResult {
  // Ammunition is not restricted - only the weapon that fires it is restricted
  // (e.g., clerics can use stones because they can use slings)
  const isAmmunition = equipment.category === "ammunition";
  const isWeapon = !!equipment.damage && !isAmmunition;
  const isArmor = equipment.category === "armor";

  // Check weapon restrictions
  if (isWeapon) {
    const raceRestriction = checkRaceWeaponRestriction(
      equipment,
      restrictionData
    );
    if (raceRestriction) {
      return raceRestriction;
    }

    const classRestriction = checkClassWeaponRestriction(
      equipment,
      restrictionData.classes
    );
    if (classRestriction) {
      return classRestriction;
    }
  }

  // Check armor restrictions
  if (isArmor) {
    const armorRestriction = checkClassArmorRestriction(
      equipment,
      restrictionData.classes
    );
    if (armorRestriction) {
      return armorRestriction;
    }
  }

  return { restricted: false };
}
