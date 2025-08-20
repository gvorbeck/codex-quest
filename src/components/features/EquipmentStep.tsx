import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Accordion,
  SimpleRoller,
  StepWrapper,
  Button,
  Callout,
} from "@/components/ui";
import type { Character, Equipment } from "@/types/character";
import { loadAllEquipment } from "@/services/dataLoader";

interface EquipmentStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

// Create a type that extends Equipment to match AccordionItem interface
type EquipmentWithIndex = Equipment & {
  [key: string]: unknown;
};

function EquipmentStep({ character, onCharacterChange }: EquipmentStepProps) {
  const [startingGold, setStartingGold] = useState<number | undefined>(
    character.gold > 0 ? character.gold : undefined
  );
  const [allEquipment, setAllEquipment] = useState<EquipmentWithIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load equipment data on component mount
  useEffect(() => {
    const loadEquipmentData = async () => {
      try {
        const equipment = await loadAllEquipment();
        setAllEquipment(equipment as EquipmentWithIndex[]);
      } catch (error) {
        console.error("Failed to load equipment data:", error);
        setAllEquipment([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEquipmentData();
  }, []);

  // Auto-add spellbook for magic-users
  const isMagicUser = useMemo(
    () => character.class.includes("magic-user"),
    [character.class]
  );

  const hasSpellbook = useMemo(
    () =>
      character.equipment.some((item) => item.name === "Spellbook (128 pages)"),
    [character.equipment]
  );

  // Initialize character with spellbook if they're a magic-user and don't have one
  React.useEffect(() => {
    if (isMagicUser && !hasSpellbook) {
      const spellbook: Equipment = {
        name: "Spellbook (128 pages)",
        costValue: 25,
        costCurrency: "gp",
        weight: 1,
        category: "general-equipment",
        subCategory: "wizards-wares",
        amount: 1,
      };

      onCharacterChange({
        ...character,
        equipment: [...character.equipment, spellbook],
      });
    }
  }, [isMagicUser, hasSpellbook, character, onCharacterChange]);

  const handleGoldRoll = (value: number | undefined) => {
    // The value here is already the final result from 3d6*10
    setStartingGold(value);
    onCharacterChange({
      ...character,
      gold: value || 0,
    });
  };

  const handleEquipmentAdd = useCallback(
    (equipment: EquipmentWithIndex) => {
      // Calculate the cost in gold pieces using proper decimal handling
      let costInGold = equipment.costValue;
      if (equipment.costCurrency === "sp") {
        costInGold = costInGold / 10; // Convert sp to gp: 10 sp = 1 gp
      } else if (equipment.costCurrency === "cp") {
        costInGold = costInGold / 100; // Convert cp to gp: 100 cp = 1 gp
      }

      // Round to 2 decimal places to avoid floating point issues
      costInGold = Math.round(costInGold * 100) / 100;

      // Check if character has enough gold
      if (character.gold < costInGold) {
        // Could add a toast notification here in the future
        return;
      }

      const existingItem = character.equipment.find(
        (item) => item.name === equipment.name
      );

      if (existingItem) {
        // Increase amount of existing item and deduct gold
        const updatedEquipment = character.equipment.map((item) =>
          item.name === equipment.name
            ? { ...item, amount: item.amount + 1 }
            : item
        );
        const newGold = Math.round((character.gold - costInGold) * 100) / 100;
        setStartingGold(newGold);
        onCharacterChange({
          ...character,
          equipment: updatedEquipment,
          gold: newGold,
        });
      } else {
        // Add new item with amount 1 and deduct gold
        const newGold = Math.round((character.gold - costInGold) * 100) / 100;
        setStartingGold(newGold);
        onCharacterChange({
          ...character,
          equipment: [...character.equipment, { ...equipment, amount: 1 }],
          gold: newGold,
        });
      }
    },
    [character, onCharacterChange, setStartingGold]
  );

  const handleEquipmentRemove = (equipmentName: string) => {
    const existingItem = character.equipment.find(
      (item) => item.name === equipmentName
    );

    if (existingItem) {
      // Calculate refund in gold pieces using proper decimal handling
      let refundInGold = existingItem.costValue;
      if (existingItem.costCurrency === "sp") {
        refundInGold = refundInGold / 10; // Convert sp to gp: 10 sp = 1 gp
      } else if (existingItem.costCurrency === "cp") {
        refundInGold = refundInGold / 100; // Convert cp to gp: 100 cp = 1 gp
      }

      // Round to 2 decimal places to avoid floating point issues
      refundInGold = Math.round(refundInGold * 100) / 100;

      if (existingItem.amount > 1) {
        // Decrease amount and refund gold
        const updatedEquipment = character.equipment.map((item) =>
          item.name === equipmentName
            ? { ...item, amount: item.amount - 1 }
            : item
        );
        const newGold = Math.round((character.gold + refundInGold) * 100) / 100;
        setStartingGold(newGold);
        onCharacterChange({
          ...character,
          equipment: updatedEquipment,
          gold: newGold,
        });
      } else {
        // Remove item entirely and refund gold
        const updatedEquipment = character.equipment.filter(
          (item) => item.name !== equipmentName
        );
        const newGold = Math.round((character.gold + refundInGold) * 100) / 100;
        setStartingGold(newGold);
        onCharacterChange({
          ...character,
          equipment: updatedEquipment,
          gold: newGold,
        });
      }
    }
  };

  const totalWeight = useMemo(() => {
    const weight = character.equipment.reduce(
      (total, item) => total + item.weight * item.amount,
      0
    );
    // Round to 1 decimal place to avoid floating point precision errors
    return Math.round(weight * 10) / 10;
  }, [character.equipment]);

  const totalValue = useMemo(() => {
    const value = character.equipment.reduce((total, item) => {
      let itemValueInGold = item.costValue * item.amount;
      if (item.costCurrency === "sp") {
        itemValueInGold = itemValueInGold / 10;
      } else if (item.costCurrency === "cp") {
        itemValueInGold = itemValueInGold / 100;
      }
      return total + itemValueInGold;
    }, 0);
    // Round to 2 decimal places to avoid floating point precision errors
    return Math.round(value * 100) / 100;
  }, [character.equipment]);

  const renderEquipmentItem = useCallback(
    (equipment: EquipmentWithIndex) => {
      const costDisplay = `${equipment.costValue} ${equipment.costCurrency}`;
      const weightDisplay =
        equipment.weight > 0 ? `${equipment.weight} lbs` : "—";

      // Calculate cost in gold pieces for affordability check
      let costInGold = equipment.costValue;
      if (equipment.costCurrency === "sp") {
        costInGold = costInGold / 10; // Convert sp to gp: 10 sp = 1 gp
      } else if (equipment.costCurrency === "cp") {
        costInGold = costInGold / 100; // Convert cp to gp: 100 cp = 1 gp
      }

      // Round to 2 decimal places to avoid floating point issues
      costInGold = Math.round(costInGold * 100) / 100;

      const canAfford = character.gold >= costInGold;

      return (
        <div className="flex justify-between items-center py-2">
          <div className="flex-1">
            <div className="font-medium text-stone-100">{equipment.name}</div>
            <div className="text-sm text-stone-400 flex gap-4">
              <span>Cost: {costDisplay}</span>
              <span>Weight: {weightDisplay}</span>
              {equipment.damage && <span>Damage: {equipment.damage}</span>}
              {equipment.AC && <span>AC: {equipment.AC}</span>}
            </div>
          </div>
          <Button
            onClick={() => handleEquipmentAdd(equipment)}
            disabled={!canAfford}
            className="text-sm opacity-100 disabled:opacity-50"
          >
            Add
          </Button>
        </div>
      );
    },
    [character.gold, handleEquipmentAdd]
  );

  return (
    <StepWrapper
      title="Equipment"
      description="Roll for starting gold and select your character's equipment."
    >
      {/* Starting Gold Roller */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-stone-100 mb-2">
          Starting Gold
        </h4>
        <p className="mb-4 text-stone-400">
          Roll 3d6 × 10 for your character's starting gold pieces.
        </p>
        <SimpleRoller
          formula="3d6*10"
          label="Starting Gold (3d6 × 10)"
          {...(startingGold !== undefined && {
            initialValue: startingGold,
          })}
          onChange={handleGoldRoll}
        />
        <div className="mt-2 flex gap-8">
          {startingGold !== undefined && (
            <p className="font-medium text-stone-100 m-0">
              Current Gold: {character.gold} gp
            </p>
          )}
          {startingGold !== undefined && startingGold !== character.gold && (
            <p className="font-medium text-stone-400 m-0">
              Starting Gold: {startingGold} gp
            </p>
          )}
        </div>
      </div>

      {/* Current Equipment Loadout */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-stone-100 mb-2">
          Current Equipment
        </h4>
        {character.equipment.length === 0 ? (
          <p className="text-stone-400 italic">No equipment selected yet.</p>
        ) : (
          <>
            <div className="border border-zinc-600 rounded-lg bg-zinc-800 p-4 mb-4">
              {character.equipment.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex justify-between items-center py-2 border-b border-zinc-600 last:border-b-0"
                >
                  <div>
                    <span className="font-medium text-stone-100">
                      {item.name}
                    </span>
                    {item.amount > 1 && (
                      <span className="text-stone-400"> × {item.amount}</span>
                    )}
                    <div className="text-sm text-stone-400">
                      {item.weight > 0 &&
                        `${
                          Math.round(item.weight * item.amount * 10) / 10
                        } lbs`}
                      {item.costValue > 0 && (
                        <span className="ml-4">
                          {item.costValue * item.amount} {item.costCurrency}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleEquipmentRemove(item.name)}
                    className="text-sm px-2 py-1"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {/* Equipment Summary */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-700 rounded-lg text-sm">
              <div>
                <strong>Total Weight:</strong> {totalWeight} lbs
              </div>
              <div>
                <strong>Total Value:</strong> {totalValue} gp
              </div>
            </div>
          </>
        )}
      </div>

      {/* Equipment Selection */}
      <div>
        <h4 className="text-lg font-semibold text-stone-100 mb-2">
          Available Equipment
        </h4>
        <Callout variant="info" size="sm">
          Browse and select equipment for your character. Items are organized by
          category.
        </Callout>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-400"></div>
            <span className="ml-3 text-stone-400">Loading equipment...</span>
          </div>
        ) : (
          <Accordion
            items={allEquipment}
            sortBy="category"
            searchPlaceholder="Search equipment..."
            renderItem={renderEquipmentItem}
          />
        )}
      </div>
    </StepWrapper>
  );
}

export default EquipmentStep;
