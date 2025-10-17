/**
 * Equipment utilities - extracted from character.ts for better organization
 */

import type {
  Character,
  Equipment,
  Class,
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
      equipmentLookupMapByName!.set(item["name"] as string, itemRecord);
      equipmentLookupMapById!.set(item["id"] as string, itemRecord);
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

  // Copy optional properties with type safety
  if (rawEquipment["size"] && typeof rawEquipment["size"] === "string") {
    equipment.size = rawEquipment["size"] as "S" | "M" | "L";
  }
  if (rawEquipment["damage"] && typeof rawEquipment["damage"] === "string") {
    equipment.damage = rawEquipment["damage"];
  }
  if (
    rawEquipment["twoHandedDamage"] &&
    typeof rawEquipment["twoHandedDamage"] === "string"
  ) {
    equipment.twoHandedDamage = rawEquipment["twoHandedDamage"];
  }
  if (rawEquipment["type"] && typeof rawEquipment["type"] === "string") {
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
 * Apply an equipment pack to a character
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
  const result = applyEquipmentPack(character, pack);

  if (!result.success) {
    return { character, result };
  }

  const { validEquipment } = processPackItems(pack.items);

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
      const equipmentWithQuantity: Equipment = {
        ...equipment,
        amount: quantity,
      };
      newEquipment.push(equipmentWithQuantity);
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
    result,
  };
}

/**
 * Get equipment packs suitable for a character's class
 * Uses the suitableFor property to match against character's class types
 */
export function getEquipmentPacksByClass(
  character: Character
): EquipmentPack[] {
  // Helper function to get class by ID
  const getClassById = (classId: string): Class | undefined =>
    allClasses.find((cls) => cls.id === classId);

  // Get the character's class types
  const characterClassTypes = new Set<string>();

  for (const classId of character.class) {
    const classData = getClassById(classId);
    if (classData?.classType) {
      characterClassTypes.add(classData.classType);
    }
  }

  // Filter packs based on suitableFor property
  return equipmentPacks.filter((pack) => {
    // If suitableFor is empty, pack is suitable for all classes
    if (pack.suitableFor.length === 0) {
      return true;
    }

    // Check if any of the character's class types match the pack's suitableFor
    return pack.suitableFor.some((classType) =>
      characterClassTypes.has(classType)
    );
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
  return name.toLowerCase().replace(/\s+/g, "-");
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
    } else {
      // Fallback to direct ID comparison
      if (equipmentId === allowedItem) {
        return true;
      }
    }
  }

  return false;
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
  const isWeapon = !!equipment.damage;
  const isArmor = equipment.category === "armor";

  // Check weapon restrictions for items with damage (weapons)
  if (isWeapon) {
    // Check race prohibitions (these apply regardless of class)
    if (restrictionData.race?.prohibitedWeapons) {
      for (const prohibitedWeapon of restrictionData.race.prohibitedWeapons) {
        if (isEquipmentMatchingRestriction(equipment.name, prohibitedWeapon)) {
          return createRestriction(restrictionData.race.name);
        }
      }

      // Check for size-based restrictions (Large weapons for small races)
      if (
        equipment.size === "L" &&
        restrictionData.race.prohibitedWeapons.includes("large")
      ) {
        return createRestriction(restrictionData.race.name);
      }
    }

    // Check class weapon restrictions using UNION logic for multi-class
    // Empty allowedWeapons array means NO restrictions (can use all weapons)
    const hasUnrestrictedClass = restrictionData.classes.some(
      (cls) => cls?.allowedWeapons && cls.allowedWeapons.length === 0
    );

    // If ANY class has no weapon restrictions, all weapons are allowed
    if (hasUnrestrictedClass) {
      return { restricted: false };
    }

    // Get classes that DO have weapon restrictions (non-empty allowedWeapons)
    const classesWithWeaponRestrictions = restrictionData.classes.filter(
      (cls) => cls?.allowedWeapons && cls.allowedWeapons.length > 0
    );

    // If no classes have restrictions, all weapons allowed
    if (classesWithWeaponRestrictions.length === 0) {
      return { restricted: false };
    }

    // For multi-class with restrictions: check if ANY class allows this weapon
    const isAllowedByAnyClass = classesWithWeaponRestrictions.some(
      (characterClass) =>
        isEquipmentInAllowedList(
          equipment.name,
          characterClass.allowedWeapons,
          WEAPON_ID_MAPPING
        )
    );

    // If at least one class allows it, the weapon is usable
    if (!isAllowedByAnyClass) {
      // All classes with restrictions prohibit this weapon
      const restrictingClass = classesWithWeaponRestrictions[0];
      return createRestriction(restrictingClass!.name);
    }
  }

  // Check armor restrictions for armor items
  if (isArmor) {
    // Empty allowedArmor array means NO restrictions (can use all armor)
    const hasUnrestrictedClass = restrictionData.classes.some(
      (cls) => cls?.allowedArmor && cls.allowedArmor.length === 0
    );

    // If ANY class has no armor restrictions, all armor is allowed
    if (hasUnrestrictedClass) {
      return { restricted: false };
    }

    // Get classes that DO have armor restrictions (non-empty allowedArmor)
    const classesWithArmorRestrictions = restrictionData.classes.filter(
      (cls) => cls?.allowedArmor && cls.allowedArmor.length > 0
    );

    // If no classes have restrictions, all armor allowed
    if (classesWithArmorRestrictions.length === 0) {
      return { restricted: false };
    }

    // Check for "none" restriction (absolute prohibition on armor)
    const hasNoArmorClass = classesWithArmorRestrictions.some(
      (characterClass) => characterClass.allowedArmor.includes("none")
    );

    // If ANY class prohibits all armor, check if ALL classes prohibit it
    if (hasNoArmorClass) {
      // Only restrict if ALL classes with armor restrictions say "none"
      const allClassesProhibitArmor = classesWithArmorRestrictions.every(
        (characterClass) => characterClass.allowedArmor.includes("none")
      );

      if (allClassesProhibitArmor) {
        const restrictingClass = classesWithArmorRestrictions[0];
        return createRestriction(restrictingClass!.name);
      }
    }

    // For multi-class: check if ANY class allows this armor
    const isAllowedByAnyClass = classesWithArmorRestrictions.some(
      (characterClass) =>
        !characterClass.allowedArmor.includes("none") &&
        isEquipmentInAllowedList(
          equipment.name,
          characterClass.allowedArmor,
          ARMOR_ID_MAPPING
        )
    );

    if (!isAllowedByAnyClass) {
      // No class allows this armor
      const restrictingClass = classesWithArmorRestrictions[0];
      return createRestriction(restrictingClass!.name);
    }
  }

  return { restricted: false };
}
