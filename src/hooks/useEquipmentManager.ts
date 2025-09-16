import { useCallback, useMemo } from "react";
import { cleanEquipmentArray, ensureEquipmentAmount } from "@/utils/characterCalculations";
import { allRaces } from "@/data/races";
import type { Equipment, Character, Race } from "@/types/character";

/**
 * Hook for general equipment operations on existing characters
 * Includes BFRPG-compliant carrying capacity and encumbrance calculations
 * Used in character sheets and inventory management
 *
 * @param character - The current character
 * @param onEquipmentChange - Callback to update the character's equipment
 * @returns Equipment management utilities including carrying capacity and encumbrance
 */
export function useEquipmentManager(
  character: Character | undefined,
  onEquipmentChange?: (equipment: Equipment[]) => void
) {
  // Shared helper function for adding equipment to inventory
  const addEquipmentToInventory = useCallback(
    (newEquipment: Equipment) => {
      if (!onEquipmentChange || !character) return;

      // Clean equipment array first, then work with clean data
      const cleanedEquipment = cleanEquipmentArray(character.equipment);
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
    [character, onEquipmentChange]
  );

  const removeEquipmentFromInventory = useCallback(
    (index: number) => {
      if (!onEquipmentChange || !character) return;

      const updatedEquipment = [...character.equipment];
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
    [character, onEquipmentChange]
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

  // Utility functions for equipment type checking
  const isArmorItem = useCallback(
    (item: Equipment) =>
      item.category?.toLowerCase().includes("armor") ||
      (item.AC !== undefined && !item.category?.toLowerCase().includes("shield")),
    []
  );

  const isShieldItem = useCallback(
    (item: Equipment) => item.category?.toLowerCase().includes("shield"),
    []
  );

  const isWearableItem = useCallback(
    (item: Equipment) => isArmorItem(item) || isShieldItem(item),
    [isArmorItem, isShieldItem]
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
    [character, onEquipmentChange, isWearableItem, isArmorItem, isShieldItem]
  );

  // Calculate carrying capacity using race data from BFRPG rules
  const getCarryingCapacity = useCallback((character: Character) => {
    if (!character) return { light: 60, heavy: 150 };

    // Get race data to determine base carrying capacity
    const raceData = allRaces.find((race: Race) => race.id === character.race);
    const baseCapacity = raceData?.carryingCapacity || {
      light: 60,
      heavy: 150,
      strengthModifier: { positive: 0.1, negative: 0.2 }
    };

    // Apply strength modifier per BFRPG rules
    const strMod = character.abilities?.strength?.modifier || 0;
    const { positive, negative } = baseCapacity.strengthModifier;
    const capacityMultiplier = strMod >= 0
      ? 1 + (strMod * positive)
      : 1 + (strMod * negative);

    return {
      light: Math.round(baseCapacity.light * capacityMultiplier / 5) * 5, // Round to nearest 5
      heavy: Math.round(baseCapacity.heavy * capacityMultiplier / 5) * 5
    };
  }, []);

  // Calculate total equipment weight
  const totalWeight = useMemo(() => {
    if (!character) return 0;
    const cleanedEquipment = cleanEquipmentArray(character.equipment);
    return cleanedEquipment.reduce((total, item) => total + (item.weight * item.amount), 0);
  }, [character]);

  // Get encumbrance status based on BFRPG rules
  const encumbranceStatus = useMemo(() => {
    if (!character) return 'light';
    const capacity = getCarryingCapacity(character);
    if (totalWeight > capacity.heavy) return 'overloaded';
    if (totalWeight > capacity.light) return 'heavy';
    return 'light';
  }, [character, totalWeight, getCarryingCapacity]);

  // Helper functions for formatting
  const formatWeight = useCallback((weight: number, amount: number) => {
    const totalWeight = weight * amount;
    return totalWeight > 0 ? `${Math.round(totalWeight * 100) / 100} lbs` : "—";
  }, []);

  const formatCost = useCallback(
    (costValue: number, costCurrency: string, amount: number) => {
      const totalCost = costValue * amount;
      return `${totalCost} ${costCurrency}`;
    },
    []
  );

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