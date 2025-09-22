import { useCallback, useMemo } from "react";
import type { Equipment, Character } from "@/types";
import { getRaceById } from "@/utils";
import {
  cleanEquipmentArray,
  ensureEquipmentAmount,
  isArmorItem,
  isShieldItem,
  isWearableItem,
  formatWeight,
  formatCost,
  CAPACITY_ROUNDING_FACTOR,
} from "@/utils/equipment";
import { calculateTotalWeight } from "@/utils/currency";

/**
 * Core hook for equipment operations on existing characters
 * Includes BFRPG-compliant carrying capacity and encumbrance calculations
 * Used in character sheets and inventory management
 *
 * @param character - The current character (can be undefined)
 * @param onEquipmentChange - Callback to update the character's equipment
 * @returns Equipment management utilities including carrying capacity and encumbrance
 */
function useEquipmentManagerCore(
  character: Character | undefined,
  onEquipmentChange?: (equipment: Equipment[]) => void
) {
  // Memoized clean equipment array to avoid repeated calculations
  const cleanedEquipment = useMemo(() => {
    return character ? cleanEquipmentArray(character.equipment) : [];
  }, [character]);
  // Shared helper function for adding equipment to inventory
  const addEquipmentToInventory = useCallback(
    (newEquipment: Equipment) => {
      if (!onEquipmentChange || !character) return;

      const existingIndex = cleanedEquipment.findIndex(
        (item) => item.name === newEquipment.name
      );

      if (existingIndex >= 0) {
        // Increase amount of existing item
        const updatedEquipment = [...cleanedEquipment];
        const existingItem = updatedEquipment[existingIndex];

        if (existingItem) {
          updatedEquipment[existingIndex] = {
            ...existingItem,
            amount: existingItem.amount + newEquipment.amount,
          };
        }
        onEquipmentChange(updatedEquipment);
      } else {
        // Add new item with proper amount to cleaned equipment array
        const equipmentToAdd = ensureEquipmentAmount(newEquipment);
        onEquipmentChange([...cleanedEquipment, equipmentToAdd]);
      }
    },
    [cleanedEquipment, onEquipmentChange, character]
  );

  const removeEquipmentFromInventory = useCallback(
    (index: number) => {
      if (!onEquipmentChange || !character) return;

      const updatedEquipment = [...cleanedEquipment];
      const item = updatedEquipment[index];

      if (!item) return;

      if (item.amount > 1) {
        // Decrease amount by 1
        updatedEquipment[index] = {
          ...item,
          amount: item.amount - 1,
        };
      } else {
        // Remove item completely if amount is 1 or less
        updatedEquipment.splice(index, 1);
      }

      onEquipmentChange(updatedEquipment);
    },
    [cleanedEquipment, onEquipmentChange, character]
  );

  const updateEquipmentInInventory = useCallback(
    (index: number, updates: Partial<Equipment>) => {
      if (!onEquipmentChange || !character) return;

      const updatedEquipment = [...character.equipment];
      const currentItem = updatedEquipment[index];
      if (currentItem) {
        updatedEquipment[index] = { ...currentItem, ...updates };
        onEquipmentChange(updatedEquipment);
      }
    },
    [character, onEquipmentChange]
  );


  const toggleWearing = useCallback(
    (index: number) => {
      if (!onEquipmentChange || !character) return;

      const updatedEquipment = [...character.equipment];
      const item = updatedEquipment[index];

      if (!item) return;

      if (isWearableItem(item)) {
        const newWearingState = !item.wearing;

        if (newWearingState) {
          // If we're equipping this item, unequip any other item of the same type
          if (isArmorItem(item)) {
            // Unequip any currently worn armor
            updatedEquipment.forEach((equipItem, i) => {
              if (i !== index && equipItem.wearing && isArmorItem(equipItem)) {
                updatedEquipment[i] = { ...equipItem, wearing: false };
              }
            });
          } else if (isShieldItem(item)) {
            // Unequip any currently worn shield
            updatedEquipment.forEach((equipItem, i) => {
              if (i !== index && equipItem.wearing && isShieldItem(equipItem)) {
                updatedEquipment[i] = { ...equipItem, wearing: false };
              }
            });
          }
        }

        // Toggle the current item's wearing state
        updatedEquipment[index] = {
          ...item,
          wearing: newWearingState,
        };

        onEquipmentChange(updatedEquipment);
      }
    },
    [character, onEquipmentChange]
  );

  // Calculate carrying capacity using race data from BFRPG rules
  const getCarryingCapacity = useCallback((character: Character) => {
    if (!character) return { light: 60, heavy: 150 };

    // Get race data to determine base carrying capacity
    const raceData = getRaceById(character.race);
    const baseCapacity = raceData?.carryingCapacity || {
      light: 60,
      heavy: 150,
      strengthModifier: { positive: 0.1, negative: 0.2 },
    };

    // Apply strength modifier per BFRPG rules
    const strMod = character.abilities?.strength?.modifier || 0;
    const { positive, negative } = baseCapacity.strengthModifier;
    const capacityMultiplier =
      strMod >= 0 ? 1 + strMod * positive : 1 + strMod * negative;

    return {
      light: Math.round((baseCapacity.light * capacityMultiplier) / CAPACITY_ROUNDING_FACTOR) * CAPACITY_ROUNDING_FACTOR,
      heavy: Math.round((baseCapacity.heavy * capacityMultiplier) / CAPACITY_ROUNDING_FACTOR) * CAPACITY_ROUNDING_FACTOR,
    };
  }, []);

  // Calculate total equipment weight
  const totalWeight = useMemo(() => {
    return calculateTotalWeight(cleanedEquipment);
  }, [cleanedEquipment]);

  // Get encumbrance status based on BFRPG rules
  const encumbranceStatus = useMemo(() => {
    if (!character) return "light";
    const capacity = getCarryingCapacity(character);
    if (totalWeight > capacity.heavy) return "overloaded";
    if (totalWeight > capacity.light) return "heavy";
    return "light";
  }, [character, totalWeight, getCarryingCapacity]);


  return {
    addEquipmentToInventory,
    removeEquipmentFromInventory,
    updateEquipmentInInventory,
    toggleWearing,
    isArmorItem,
    isShieldItem,
    isWearableItem,
    getCarryingCapacity,
    totalWeight,
    encumbranceStatus,
    formatWeight,
    formatCost,
  };
}

/**
 * Public hook for equipment operations that handles optional characters
 * Provides safer operations when character is undefined
 *
 * @param character - The current character (optional)
 * @param onEquipmentChange - Callback to update the character's equipment
 * @returns Equipment management utilities including carrying capacity and encumbrance
 */
export function useEquipmentManager(
  character: Character | undefined,
  onEquipmentChange?: (equipment: Equipment[]) => void
) {
  // Use the core hook but with safer guard clauses
  const result = useEquipmentManagerCore(character, onEquipmentChange);

  // Return the result with null object pattern applied for undefined character
  return character ? result : {
    addEquipmentToInventory: () => {},
    removeEquipmentFromInventory: () => {},
    updateEquipmentInInventory: () => {},
    toggleWearing: () => {},
    isArmorItem,
    isShieldItem,
    isWearableItem,
    getCarryingCapacity: () => ({ light: 60, heavy: 150 }),
    totalWeight: 0,
    encumbranceStatus: "light" as const,
    formatWeight,
    formatCost,
  };
}
