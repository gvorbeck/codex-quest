import React, { useState, useMemo, useCallback, memo } from "react";
import { StepWrapper } from "@/components/ui/layout";
import { SimpleRoller } from "@/components/ui/display";
import { Button, Icon } from "@/components/ui";
import { Card, Typography, Badge } from "@/components/ui/design-system";
import { InfoCardHeader, StatGrid } from "@/components/ui/display";
import type { Character, Equipment } from "@/types/character";
import { convertToGold, updateCharacterGold } from "@/utils/currency";
import { cleanEquipmentArray, ensureEquipmentAmount } from "@/utils/gameUtils";
import { EquipmentSelector } from "../management";

interface EquipmentStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

function EquipmentStep({ character, onCharacterChange }: EquipmentStepProps) {
  const [startingGold, setStartingGold] = useState<number | undefined>(
    character.currency.gold > 0 ? character.currency.gold : undefined
  );

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
      currency: {
        ...character.currency,
        gold: value || 0,
      },
    });
  };

  const handleEquipmentAdd = useCallback(
    (equipment: Equipment) => {
      // Calculate the cost in gold pieces using utility function
      const costInGold = convertToGold(
        equipment.costValue,
        equipment.costCurrency
      );

      // Check if character has enough gold
      if (character.currency.gold < costInGold) {
        // Could add a toast notification here in the future
        return;
      }

      // Clean the equipment array first, then work with the clean array
      const cleanedEquipment = cleanEquipmentArray(character.equipment);
      const existingItem = cleanedEquipment.find(
        (item) => item.name === equipment.name
      );

      if (existingItem) {
        // Increase amount of existing item and deduct gold
        const updatedEquipment = cleanedEquipment.map((item) =>
          item.name === equipment.name
            ? { ...item, amount: item.amount + 1 }
            : item
        );
        const updatedCharacter = updateCharacterGold(
          character,
          character.currency.gold - costInGold
        );
        setStartingGold(updatedCharacter.currency.gold);
        onCharacterChange({
          ...updatedCharacter,
          equipment: updatedEquipment,
        });
      } else {
        // Add new item with amount 1 and deduct gold
        const updatedCharacter = updateCharacterGold(
          character,
          character.currency.gold - costInGold
        );
        setStartingGold(updatedCharacter.currency.gold);

        // Clean equipment array and add new item with proper amount
        const cleanedEquipment = cleanEquipmentArray(character.equipment);
        const newEquipment = ensureEquipmentAmount(equipment);

        onCharacterChange({
          ...updatedCharacter,
          equipment: [...cleanedEquipment, newEquipment],
        });
      }
    },
    [character, onCharacterChange, setStartingGold]
  );

  const handleEquipmentRemove = (equipmentName: string) => {
    const existingItem = character.equipment.find(
      (item) => item.name === equipmentName && item.amount > 0
    );

    if (existingItem) {
      // Calculate refund in gold pieces using utility function
      const refundInGold = convertToGold(
        existingItem.costValue,
        existingItem.costCurrency
      );

      if (existingItem.amount > 1) {
        // Decrease amount and refund gold
        const updatedEquipment = character.equipment.map((item) =>
          item.name === equipmentName
            ? { ...item, amount: item.amount - 1 }
            : item
        );
        const updatedCharacter = updateCharacterGold(
          character,
          character.currency.gold + refundInGold
        );
        setStartingGold(updatedCharacter.currency.gold);
        onCharacterChange({
          ...updatedCharacter,
          equipment: updatedEquipment,
        });
      } else {
        // Remove item entirely and refund gold
        const updatedEquipment = character.equipment.filter(
          (item) => item.name !== equipmentName
        );
        const updatedCharacter = updateCharacterGold(
          character,
          character.currency.gold + refundInGold
        );
        setStartingGold(updatedCharacter.currency.gold);
        onCharacterChange({
          ...updatedCharacter,
          equipment: updatedEquipment,
        });
      }
    }
  };

  const totalWeight = useMemo(() => {
    const weight = cleanEquipmentArray(character.equipment).reduce(
      (total, item) => total + item.weight * item.amount,
      0
    );
    // Round to 1 decimal place to avoid floating point precision errors
    return Math.round(weight * 10) / 10;
  }, [character.equipment]);

  const totalValue = useMemo(() => {
    const value = cleanEquipmentArray(character.equipment).reduce(
      (total, item) => {
        const itemValueInGold = convertToGold(
          item.costValue * item.amount,
          item.costCurrency
        );
        return total + itemValueInGold;
      },
      0
    );
    // Round to 2 decimal places to avoid floating point precision errors
    return Math.round(value * 100) / 100;
  }, [character.equipment]);

  const getStatusMessage = () => {
    const itemCount = cleanEquipmentArray(character.equipment).length;
    if (character.currency.gold > 0 && itemCount > 0) {
      return `${itemCount} items, ${character.currency.gold} gp remaining`;
    } else if (character.currency.gold > 0) {
      return `${character.currency.gold} gp available`;
    }
    return "";
  };

  return (
    <StepWrapper
      title="Equipment"
      description="Roll for starting gold and select your character's equipment."
      statusMessage={getStatusMessage()}
    >
      {/* Starting Gold Section */}
      <section className="mb-8">
        <Typography variant="sectionHeading">Starting Gold</Typography>

        <Card variant="info" className="mb-6">
          <InfoCardHeader
            icon={<Icon name="coin" size="md" aria-hidden={true} />}
            title="Gold Information"
            className="mb-4"
          />
          <p className="text-amber-50 leading-relaxed m-0">
            Roll 3d6 × 10 for your character's starting gold pieces. Use this
            gold to purchase equipment and supplies.
          </p>
        </Card>

        <Card variant="standard">
          <SimpleRoller
            formula="3d6*10"
            label="Starting Gold (3d6 × 10)"
            {...(startingGold !== undefined && {
              initialValue: startingGold,
            })}
            onChange={handleGoldRoll}
          />

          {startingGold !== undefined && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-8">
              <div className="flex items-center gap-2">
                <Icon
                  name="coin"
                  size="sm"
                  className="text-lime-400"
                  aria-hidden={true}
                />
                <span className="font-medium text-zinc-100">
                  Current: {character.currency.gold} gp
                </span>
              </div>
              {startingGold !== character.currency.gold && (
                <div className="flex items-center gap-2">
                  <Icon name="clock" size="sm" className="text-zinc-400" />
                  <span className="font-medium text-zinc-400">
                    Started: {startingGold} gp
                  </span>
                </div>
              )}
            </div>
          )}
        </Card>
      </section>

      {/* Current Equipment Section */}
      <section className="mb-8">
        <Typography variant="sectionHeading">Current Equipment</Typography>

        {cleanEquipmentArray(character.equipment).length === 0 ? (
          <Card variant="standard">
            <div className="flex items-center gap-3">
              <Icon name="clipboard" size="md" className="text-zinc-400" />
              <p className="text-zinc-400 italic m-0">
                No equipment selected yet. Browse available equipment below.
              </p>
            </div>
          </Card>
        ) : (
          <Card variant="success" className="p-0">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="clipboard" size="md" className="text-lime-400" />
                <Typography
                  variant="h5"
                  color="zinc"
                  weight="semibold"
                  className="m-0"
                >
                  Equipment Inventory
                </Typography>
              </div>

              <div className="space-y-3 mb-6">
                {cleanEquipmentArray(character.equipment).map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="bg-zinc-800/50 border border-lime-700/30 rounded-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-lime-100">
                            {item.name}
                          </span>
                          {item.amount > 1 && (
                            <Badge variant="status">× {item.amount}</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-lime-200">
                          {item.weight > 0 && (
                            <span>
                              {Math.round(item.weight * item.amount * 10) / 10}{" "}
                              lbs
                            </span>
                          )}
                          {item.costValue > 0 && (
                            <span>
                              {item.costValue * item.amount} {item.costCurrency}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEquipmentRemove(item.name)}
                        className="self-start sm:self-center"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Equipment Summary */}
              <StatGrid
                stats={[
                  {
                    label: "Total Weight",
                    value: `${totalWeight} lbs`,
                    icon: <Icon name="weight" size="sm" aria-hidden={true} />,
                  },
                  {
                    label: "Total Value",
                    value: `${totalValue} gp`,
                    icon: <Icon name="coin" size="sm" aria-hidden={true} />,
                  },
                ]}
                variant="equipment"
                columns={{ base: 1, sm: 2 }}
              />
            </div>
          </Card>
        )}
      </section>

      {/* Available Equipment Section */}
      <EquipmentSelector
        character={character}
        onEquipmentAdd={handleEquipmentAdd}
      />
    </StepWrapper>
  );
}

export default memo(EquipmentStep);
