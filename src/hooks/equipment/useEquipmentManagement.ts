import { useState, useMemo, useCallback } from "react";
import type { Equipment, Character, CurrencyType } from "@/types";
import { cleanEquipmentArray, ensureEquipmentAmount } from "@/utils";
import {
  updateCharacterCurrency,
  calculateTotalWeight,
  convertToGoldFromAbbreviation,
  formatCurrency,
  getCurrencyTypeFromAbbreviation,
  type CurrencyAmount,
} from "@/utils/currency";

/**
 * Hook for managing equipment during character creation with gold/currency management
 * Used in character creation workflow to handle purchasing equipment with starting gold
 */
export function useEquipmentManagement(
  character: Character,
  onCharacterChange: (character: Character) => void
) {
  const [startingGold, setStartingGold] = useState<number | undefined>(
    character.currency.gold > 0 ? character.currency.gold : undefined
  );

  // Memoize cleaned equipment to avoid recalculation
  const cleanedEquipment = useMemo(
    () => cleanEquipmentArray(character.equipment),
    [character.equipment]
  );

  const handleGoldRoll = useCallback(
    (value: number | undefined) => {
      setStartingGold(value);
      onCharacterChange({
        ...character,
        currency: {
          ...character.currency,
          gold: value || 0,
        },
      });
    },
    [character, onCharacterChange]
  );

  const handleEquipmentAdd = useCallback(
    (equipment: Equipment) => {
      const costInGold = convertToGoldFromAbbreviation(
        equipment.costValue,
        equipment.costCurrency as CurrencyType
      );

      if (character.currency.gold < costInGold) {
        return;
      }
      const existingItem = cleanedEquipment.find(
        (item) => item.name === equipment.name
      );

      if (existingItem) {
        const updatedEquipment = cleanedEquipment.map((item) =>
          item.name === equipment.name
            ? { ...item, amount: item.amount + 1 }
            : item
        );
        const updatedCharacter = updateCharacterCurrency(
          character,
          "gold",
          character.currency.gold - costInGold
        );
        setStartingGold(updatedCharacter.currency.gold);
        onCharacterChange({
          ...updatedCharacter,
          equipment: updatedEquipment,
        });
      } else {
        const updatedCharacter = updateCharacterCurrency(
          character,
          "gold",
          character.currency.gold - costInGold
        );
        setStartingGold(updatedCharacter.currency.gold);

        const newEquipment = ensureEquipmentAmount(equipment);

        onCharacterChange({
          ...updatedCharacter,
          equipment: [...cleanedEquipment, newEquipment],
        });
      }
    },
    [character, onCharacterChange, cleanedEquipment]
  );

  const handleEquipmentRemove = useCallback(
    (equipmentName: string) => {
      const existingItem = character.equipment.find(
        (item) => item.name === equipmentName && item.amount > 0
      );

      if (existingItem) {
        // Determine the refund currency type
        const refundCurrencyType = getCurrencyTypeFromAbbreviation(existingItem.costCurrency);

        if (existingItem.amount > 1) {
          const updatedEquipment = character.equipment.map((item) =>
            item.name === equipmentName
              ? { ...item, amount: item.amount - 1 }
              : item
          );

          // Refund in original currency
          const currentAmount = character.currency[refundCurrencyType as keyof typeof character.currency] || 0;
          const updatedCharacter = updateCharacterCurrency(
            character,
            refundCurrencyType as keyof CurrencyAmount,
            currentAmount + existingItem.costValue
          );

          // Only update starting gold if we're refunding gold
          if (refundCurrencyType === "gold") {
            setStartingGold(updatedCharacter.currency.gold);
          }

          onCharacterChange({
            ...updatedCharacter,
            equipment: updatedEquipment,
          });
        } else {
          const updatedEquipment = character.equipment.filter(
            (item) => item.name !== equipmentName
          );

          // Refund in original currency
          const currentAmount = character.currency[refundCurrencyType as keyof typeof character.currency] || 0;
          const updatedCharacter = updateCharacterCurrency(
            character,
            refundCurrencyType as keyof CurrencyAmount,
            currentAmount + existingItem.costValue
          );

          // Only update starting gold if we're refunding gold
          if (refundCurrencyType === "gold") {
            setStartingGold(updatedCharacter.currency.gold);
          }

          onCharacterChange({
            ...updatedCharacter,
            equipment: updatedEquipment,
          });
        }
      }
    },
    [character, onCharacterChange]
  );

  const totalWeight = useMemo(() => {
    const weight = calculateTotalWeight(cleanedEquipment);
    return Math.round(weight * 10) / 10;
  }, [cleanedEquipment]);

  const totalValue = useMemo(() => {
    const value = cleanedEquipment.reduce(
      (total, item) => {
        const itemValueInGold = convertToGoldFromAbbreviation(
          item.costValue * item.amount,
          item.costCurrency as CurrencyType
        );
        return total + itemValueInGold;
      },
      0
    );
    return Math.round(value * 100) / 100;
  }, [cleanedEquipment]);

  const getStatusMessage = useCallback(() => {
    const itemCount = cleanedEquipment.length;
    const formattedCurrency = formatCurrency(character.currency);
    if (character.currency.gold > 0 && itemCount > 0) {
      return `${itemCount} items, ${formattedCurrency} remaining`;
    } else if (character.currency.gold > 0) {
      return `${formattedCurrency} available`;
    }
    return "";
  }, [cleanedEquipment.length, character.currency]);

  return {
    startingGold,
    setStartingGold,
    handleGoldRoll,
    handleEquipmentAdd,
    handleEquipmentRemove,
    totalWeight,
    totalValue,
    cleanedEquipment,
    getStatusMessage,
  };
}
