import { useState, useEffect, useCallback, memo } from "react";
import { Accordion, Card, InfoCardHeader, Typography } from "@/components/ui";
import { Button } from "@/components/ui";
import type { Character, Equipment } from "@/types/character";
import { loadAllEquipment } from "@/services/dataLoader";
import { convertToGold } from "@/utils/currency";

type EquipmentWithIndex = Equipment & {
  [key: string]: unknown;
};

interface EquipmentSelectorProps {
  character: Character;
  onEquipmentAdd: (equipment: Equipment) => void;
}

function EquipmentSelector({ character, onEquipmentAdd }: EquipmentSelectorProps) {
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
              onClick={() => onEquipmentAdd(equipment)}
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
    [character.currency.gold, onEquipmentAdd]
  );

  return (
    <section className="mb-8">
      <Typography variant="sectionHeading">Available Equipment</Typography>

      <Card variant="info" className="mb-6">
        <InfoCardHeader
          icon={
            <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          }
          title="Shopping Guide"
          className="mb-3"
        />
        <p className="text-amber-50 leading-relaxed m-0">
          Browse and select equipment for your character. Items are organized by
          category.
          <span className="hidden sm:inline">
            {" "}
            You can only purchase items you can afford with your current gold.
          </span>
        </p>
      </Card>

      {isLoading ? (
        <Card variant="standard" className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lime-400"></div>
            <span className="ml-3 text-zinc-400">Loading equipment...</span>
          </div>
        </Card>
      ) : (
        <Card variant="standard" className="p-0">
          <Accordion
            items={allEquipment}
            sortBy="category"
            searchPlaceholder="Search equipment..."
            renderItem={renderEquipmentItem}
          />
        </Card>
      )}
    </section>
  );
}

export default memo(EquipmentSelector);
