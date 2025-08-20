import React, { useState, useMemo } from "react";
import { Accordion, SimpleRoller, StepWrapper } from "@/components/ui";
import type { Character, Equipment } from "@/types/character";
import equipmentData from "@/data/equipment.json";

interface EquipmentStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

function EquipmentStep({ character, onCharacterChange }: EquipmentStepProps) {
  const [startingGold, setStartingGold] = useState<number | undefined>(
    character.gold > 0 ? character.gold : undefined
  );

  // Cast equipment data to Equipment array
  const allEquipment = equipmentData as Equipment[];

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

  const handleEquipmentAdd = (equipment: Equipment) => {
    const existingItem = character.equipment.find(
      (item) => item.name === equipment.name
    );

    if (existingItem) {
      // Increase amount of existing item
      const updatedEquipment = character.equipment.map((item) =>
        item.name === equipment.name
          ? { ...item, amount: item.amount + 1 }
          : item
      );
      onCharacterChange({
        ...character,
        equipment: updatedEquipment,
      });
    } else {
      // Add new item with amount 1
      onCharacterChange({
        ...character,
        equipment: [...character.equipment, { ...equipment, amount: 1 }],
      });
    }
  };

  const handleEquipmentRemove = (equipmentName: string) => {
    const existingItem = character.equipment.find(
      (item) => item.name === equipmentName
    );

    if (existingItem) {
      if (existingItem.amount > 1) {
        // Decrease amount
        const updatedEquipment = character.equipment.map((item) =>
          item.name === equipmentName
            ? { ...item, amount: item.amount - 1 }
            : item
        );
        onCharacterChange({
          ...character,
          equipment: updatedEquipment,
        });
      } else {
        // Remove item entirely
        const updatedEquipment = character.equipment.filter(
          (item) => item.name !== equipmentName
        );
        onCharacterChange({
          ...character,
          equipment: updatedEquipment,
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

  const renderEquipmentItem = (equipment: Equipment) => {
    const costDisplay = `${equipment.costValue} ${equipment.costCurrency}`;
    const weightDisplay =
      equipment.weight > 0 ? `${equipment.weight} lbs` : "—";

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
        <button
          onClick={() => handleEquipmentAdd(equipment)}
          style={{
            padding: "0.25rem 0.5rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Add
        </button>
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
        {startingGold && (
          <p style={{ marginTop: "0.5rem", fontWeight: "500" }}>
            Starting Gold: {startingGold} gp
          </p>
        )}
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
                  <button
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
                  </button>
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
