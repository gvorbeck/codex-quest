import React, { useState, useMemo, useEffect, useCallback, memo } from "react";
import { Accordion, StepWrapper } from "@/components/ui/layout";
import { SimpleRoller } from "@/components/ui/display";
import { Button } from "@/components/ui";
import { Card, Typography, Badge } from "@/components/ui/design-system";
import { InfoCardHeader, StatGrid } from "@/components/ui/display";
import type { Character, Equipment } from "@/types/character";
import { loadAllEquipment } from "@/services/dataLoader";
import { convertToGold, updateCharacterGold } from "@/utils/currency";
import { EquipmentSelector } from "../management";

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
    character.currency.gold > 0 ? character.currency.gold : undefined
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
      currency: {
        ...character.currency,
        gold: value || 0,
      },
    });
  };

  const handleEquipmentAdd = useCallback(
    (equipment: EquipmentWithIndex) => {
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
        onCharacterChange({
          ...updatedCharacter,
          equipment: [...character.equipment, { ...equipment, amount: 1 }],
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
    const weight = character.equipment.reduce(
      (total, item) => total + item.weight * item.amount,
      0
    );
    // Round to 1 decimal place to avoid floating point precision errors
    return Math.round(weight * 10) / 10;
  }, [character.equipment]);

  const totalValue = useMemo(() => {
    const value = character.equipment.reduce((total, item) => {
      const itemValueInGold = convertToGold(
        item.costValue * item.amount,
        item.costCurrency
      );
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
      const costInGold = convertToGold(
        equipment.costValue,
        equipment.costCurrency
      );

      const canAfford = character.currency.gold >= costInGold;

      return (
        <div className="bg-zinc-800/50 border border-zinc-600 rounded-lg p-4 hover:bg-zinc-800/70 transition-colors">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex-1">
              <div className="font-medium text-zinc-100 mb-2">
                {equipment.name}
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {costDisplay}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {weightDisplay}
                </span>
                {equipment.damage && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    {equipment.damage}
                  </span>
                )}
                {equipment.AC && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v5.5a1 1 0 00.496.868l7 4a1 1 0 00.992 0l7-4A1 1 0 0018 13.5V8a1 1 0 00-.496-.868l-7-4zM6 9a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    AC {equipment.AC}
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={() => handleEquipmentAdd(equipment)}
              disabled={!canAfford}
              variant={canAfford ? "primary" : "secondary"}
              size="sm"
              className="self-start sm:self-center"
            >
              Add {!canAfford && "(Can't Afford)"}
            </Button>
          </div>
        </div>
      );
    },
    [character.currency.gold, handleEquipmentAdd]
  );

  const getStatusMessage = () => {
    if (character.currency.gold > 0 && character.equipment.length > 0) {
      return `${character.equipment.length} items, ${character.currency.gold} gp remaining`;
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
            icon={
              <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            }
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
                <svg
                  className="w-4 h-4 text-lime-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-zinc-100">
                  Current: {character.currency.gold} gp
                </span>
              </div>
              {startingGold !== character.currency.gold && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-zinc-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
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

        {character.equipment.length === 0 ? (
          <Card variant="standard">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-zinc-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-zinc-400 italic m-0">
                No equipment selected yet. Browse available equipment below.
              </p>
            </div>
          </Card>
        ) : (
          <Card variant="success" className="p-0">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg
                  className="w-5 h-5 text-lime-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                <h5 className="font-semibold text-lime-100 m-0">
                  Equipment Inventory
                </h5>
              </div>

              <div className="space-y-3 mb-6">
                {character.equipment.map((item, index) => (
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
                    icon: (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: "Total Value",
                    value: `${totalValue} gp`,
                    icon: (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ),
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
      <EquipmentSelector />
    </StepWrapper>
  );
}

export default memo(EquipmentStep);
