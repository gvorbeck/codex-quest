import React, { useState, useMemo } from "react";
import { Accordion, SimpleRoller, StepWrapper, Button } from "@/components/ui";
import type { Character, Equipment } from "@/types/character";
import equipmentData from "@/data/equipment.json";

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

  // Cast equipment data to Equipment array with index signature for Accordion compatibility
  const allEquipment = equipmentData as EquipmentWithIndex[];

  // Auto-add spellbook for magic-users
  const hasSpellbook = character.equipment.some(
    (item) => item.name === "Spellbook (128 pages)"
  );
  const isMagicUser = character.class.includes("magic-user");

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

  const handleEquipmentAdd = (equipment: EquipmentWithIndex) => {
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
  };

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
    return character.equipment.reduce(
      (total, item) => total + item.weight * item.amount,
      0
    );
  }, [character.equipment]);

  const totalValue = useMemo(() => {
    return character.equipment.reduce((total, item) => {
      let itemValueInGold = item.costValue * item.amount;
      if (item.costCurrency === "sp") {
        itemValueInGold = itemValueInGold / 10;
      } else if (item.costCurrency === "cp") {
        itemValueInGold = itemValueInGold / 100;
      }
      return total + itemValueInGold;
    }, 0);
  }, [character.equipment]);

  const renderEquipmentItem = (equipment: EquipmentWithIndex) => {
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 0",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "500" }}>{equipment.name}</div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#6c757d",
              display: "flex",
              gap: "1rem",
            }}
          >
            <span>Cost: {costDisplay}</span>
            <span>Weight: {weightDisplay}</span>
            {equipment.damage && <span>Damage: {equipment.damage}</span>}
            {equipment.AC && <span>AC: {equipment.AC}</span>}
          </div>
        </div>
        <Button
          onClick={() => handleEquipmentAdd(equipment)}
          disabled={!canAfford}
          style={{
            fontSize: "0.875rem",
            opacity: canAfford ? 1 : 0.5,
          }}
        >
          Add
        </Button>
      </div>
    );
  };

  return (
    <StepWrapper
      title="Equipment"
      description="Roll for starting gold and select your character's equipment."
    >
      {/* Starting Gold Roller */}
      <div style={{ marginBottom: "2rem" }}>
        <h4>Starting Gold</h4>
        <p style={{ marginBottom: "1rem", color: "#6c757d" }}>
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
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "2rem" }}>
          {startingGold !== undefined && (
            <p style={{ fontWeight: "500", margin: 0 }}>
              Current Gold: {character.gold} gp
            </p>
          )}
          {startingGold !== undefined && startingGold !== character.gold && (
            <p style={{ fontWeight: "500", margin: 0, color: "#6c757d" }}>
              Starting Gold: {startingGold} gp
            </p>
          )}
        </div>
      </div>

      {/* Current Equipment Loadout */}
      <div style={{ marginBottom: "2rem" }}>
        <h4>Current Equipment</h4>
        {character.equipment.length === 0 ? (
          <p style={{ color: "#6c757d", fontStyle: "italic" }}>
            No equipment selected yet.
          </p>
        ) : (
          <>
            <div
              style={{
                border: "1px solid #dee2e6",
                borderRadius: "0.25rem",
                backgroundColor: "#f8f9fa",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              {character.equipment.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem 0",
                    borderBottom:
                      index < character.equipment.length - 1
                        ? "1px solid #dee2e6"
                        : "none",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: "500" }}>{item.name}</span>
                    {item.amount > 1 && (
                      <span style={{ color: "#6c757d" }}> × {item.amount}</span>
                    )}
                    <div style={{ fontSize: "0.875rem", color: "#6c757d" }}>
                      {item.weight > 0 && `${item.weight * item.amount} lbs`}
                      {item.costValue > 0 && (
                        <span style={{ marginLeft: "1rem" }}>
                          {item.costValue * item.amount} {item.costCurrency}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleEquipmentRemove(item.name)}
                    style={{
                      padding: "0.25rem 0.5rem",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {/* Equipment Summary */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                padding: "1rem",
                backgroundColor: "#e9ecef",
                borderRadius: "0.25rem",
                fontSize: "0.875rem",
              }}
            >
              <div>
                <strong>Total Weight:</strong> {totalWeight.toFixed(1)} lbs
              </div>
              <div>
                <strong>Total Value:</strong> {totalValue.toFixed(1)} gp
              </div>
            </div>
          </>
        )}
      </div>

      {/* Equipment Selection */}
      <div>
        <h4>Available Equipment</h4>
        <p style={{ marginBottom: "1rem", color: "#6c757d" }}>
          Browse and select equipment for your character. Items are organized by
          category.
        </p>

        <Accordion
          items={allEquipment}
          sortBy="category"
          searchPlaceholder="Search equipment..."
          renderItem={renderEquipmentItem}
          onItemSelect={handleEquipmentAdd}
        />
      </div>
    </StepWrapper>
  );
}

export default EquipmentStep;
