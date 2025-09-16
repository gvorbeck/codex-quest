import { useState, useMemo, useCallback } from "react";
import type { Equipment, Character } from "@/types/character";
import { convertToGoldFromAbbreviation, updateCharacterCurrency } from "@/utils/currency";
import {
  cleanEquipmentArray,
  ensureEquipmentAmount,
} from "@/utils/characterCalculations";

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
        equipment.costCurrency as "gp" | "sp" | "cp" | "ep" | "pp"
      );

      if (character.currency.gold < costInGold) {
        return;
      }

      const cleanedEquipment = cleanEquipmentArray(character.equipment);
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
          'gold',
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
          'gold',
          character.currency.gold - costInGold
        );
        setStartingGold(updatedCharacter.currency.gold);

        const cleanedEquipment = cleanEquipmentArray(character.equipment);
        const newEquipment = ensureEquipmentAmount(equipment);

        onCharacterChange({
          ...updatedCharacter,
          equipment: [...cleanedEquipment, newEquipment],
        });
      }
    },
    [character, onCharacterChange]
  );

  const handleEquipmentRemove = useCallback(
    (equipmentName: string) => {
      const existingItem = character.equipment.find(
        (item) => item.name === equipmentName && item.amount > 0
      );

      if (existingItem) {
        const refundInGold = convertToGoldFromAbbreviation(
          existingItem.costValue,
          existingItem.costCurrency as "gp" | "sp" | "cp" | "ep" | "pp"
        );

        if (existingItem.amount > 1) {
          const updatedEquipment = character.equipment.map((item) =>
            item.name === equipmentName
              ? { ...item, amount: item.amount - 1 }
              : item
          );
          const updatedCharacter = updateCharacterCurrency(
            character,
            'gold',
            character.currency.gold + refundInGold
          );
          setStartingGold(updatedCharacter.currency.gold);
          onCharacterChange({
            ...updatedCharacter,
            equipment: updatedEquipment,
          });
        } else {
          const updatedEquipment = character.equipment.filter(
            (item) => item.name !== equipmentName
          );
          const updatedCharacter = updateCharacterCurrency(
            character,
            'gold',
            character.currency.gold + refundInGold
          );
          setStartingGold(updatedCharacter.currency.gold);
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
    const weight = cleanEquipmentArray(character.equipment).reduce(
      (total, item) => total + item.weight * item.amount,
      0
    );
    return Math.round(weight * 10) / 10;
  }, [character.equipment]);

  const totalValue = useMemo(() => {
    const value = cleanEquipmentArray(character.equipment).reduce(
      (total, item) => {
        const itemValueInGold = convertToGoldFromAbbreviation(
          item.costValue * item.amount,
          item.costCurrency as "gp" | "sp" | "cp" | "ep" | "pp"
        );
        return total + itemValueInGold;
      },
      0
    );
    return Math.round(value * 100) / 100;
  }, [character.equipment]);

  const cleanedEquipment = useMemo(
    () => cleanEquipmentArray(character.equipment),
    [character.equipment]
  );

  const getStatusMessage = useCallback(() => {
    const itemCount = cleanedEquipment.length;
    if (character.currency.gold > 0 && itemCount > 0) {
      return `${itemCount} items, ${character.currency.gold} gp remaining`;
    } else if (character.currency.gold > 0) {
      return `${character.currency.gold} gp available`;
    }
    return "";
  }, [cleanedEquipment.length, character.currency.gold]);

  return {
    startingGold,
    handleGoldRoll,
    handleEquipmentAdd,
    handleEquipmentRemove,
    totalWeight,
    totalValue,
    cleanedEquipment,
    getStatusMessage,
  };
}