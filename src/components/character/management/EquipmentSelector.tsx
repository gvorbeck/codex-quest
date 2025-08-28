import { useState, useEffect, useCallback, memo } from "react";
import { Accordion, Card, InfoCardHeader, Typography } from "@/components/ui";
import { Button } from "@/components/ui";
import { Icon } from "@/components/ui/display/Icon";
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

function EquipmentSelector({
  character,
  onEquipmentAdd,
}: EquipmentSelectorProps) {
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
        typeof equipment.weight === "number" && equipment.weight > 0
          ? `${equipment.weight} lbs`
          : "—";

      // Calculate cost in gold pieces for affordability check
      const costInGold = convertToGold(
        equipment.costValue,
        equipment.costCurrency
      );

      const canAfford = character.currency.gold >= costInGold;

      return (
        <Card variant="standard" hover>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex-1">
              <div className="font-medium text-zinc-100 mb-2">
                {equipment.name}
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1">
                  <Icon name="coin" size="xs" aria-hidden={true} />
                  {costDisplay}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="weight" size="xs" aria-hidden={true} />
                  {weightDisplay}
                </span>
                {equipment.damage && (
                  <span className="flex items-center gap-1">
                    <Icon name="damage" size="xs" aria-hidden={true} />
                    {equipment.damage}
                  </span>
                )}
                {equipment.AC && (
                  <span className="flex items-center gap-1">
                    <Icon name="shield" size="xs" aria-hidden={true} />
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
        </Card>
      );
    },
    [character.currency.gold, onEquipmentAdd]
  );

  return (
    <section className="mb-8">
      <Typography variant="sectionHeading">Available Equipment</Typography>

      <Card variant="info" className="mb-6">
        <InfoCardHeader
          icon={<Icon name="info" />}
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
