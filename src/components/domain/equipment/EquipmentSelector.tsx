import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Accordion, Card, InfoCardHeader, Typography } from "@/components/ui";
import { Button } from "@/components/ui";
import { Icon, type IconName } from "@/components/ui/core/display/Icon";
import { LoadingState } from "@/components/ui/core/feedback";
import { logger } from "@/utils";
import type { Character, Equipment } from "@/types";
import { loadAllEquipment } from "@/services/dataLoader";
import { findById } from "@/utils";
import { convertToGoldFromAbbreviation } from "@/utils/currency";
import { allRaces, allClasses } from "@/data";
import { isEquipmentRestricted } from "@/utils/equipment";

type EquipmentWithIndex = Equipment & {
  [key: string]: unknown;
};

interface EquipmentSelectorProps {
  character: Character;
  onEquipmentAdd: (equipment: Equipment) => void;
}

/**
 * Helper component for displaying an icon with text in a consistent format
 */
function IconText({
  icon,
  children,
}: {
  icon: IconName;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1">
      <Icon name={icon} size="xs" aria-hidden={true} />
      {children}
    </span>
  );
}

/**
 * Creates button text with appropriate restriction messages
 */
function createButtonText(
  canAfford: boolean,
  restrictionReason?: string
): string {
  let text = "Add";

  if (!canAfford) {
    text += " (Can't Afford)";
  }

  if (restrictionReason) {
    text += ` (${restrictionReason})`;
  }

  return text;
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
        logger.error("Failed to load equipment data:", error);
        setAllEquipment([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEquipmentData();
  }, []);

  // Memoize character restriction data to avoid recalculating on every render
  const characterRestrictionData = useMemo(() => {
    const characterRace = findById(character.race, allRaces);
    const characterClass = findById(character.class, allClasses);

    return {
      race: characterRace,
      classes: characterClass ? [characterClass] : [],
      currency: character.currency.gold,
    };
  }, [character.race, character.class, character.currency.gold]);

  const renderEquipmentItem = useCallback(
    (equipment: EquipmentWithIndex) => {
      const costDisplay = `${equipment.costValue} ${equipment.costCurrency}`;
      const weightDisplay =
        typeof equipment.weight === "number" && equipment.weight > 0
          ? `${equipment.weight} lbs`
          : "—";

      // Calculate cost in gold pieces for affordability check
      const costInGold = convertToGoldFromAbbreviation(
        equipment.costValue,
        equipment.costCurrency as "gp" | "sp" | "cp" | "ep" | "pp"
      );

      const canAfford = characterRestrictionData.currency >= costInGold;
      const restriction = isEquipmentRestricted(
        equipment,
        characterRestrictionData
      );
      const canUse = !restriction.restricted;
      const canAdd = canAfford && canUse;

      return (
        <Card variant="standard" hover>
          <div className="flex flex-col gap-3">
            <div className="flex-1">
              <div className="font-medium text-zinc-100 mb-2">
                {equipment.name}
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 text-sm text-zinc-400">
                <IconText icon="coin">{costDisplay}</IconText>
                <IconText icon="weight">{weightDisplay}</IconText>
                {equipment.damage && (
                  <IconText icon="damage">{equipment.damage}</IconText>
                )}
                {equipment.AC && (
                  <IconText icon="shield">AC {equipment.AC}</IconText>
                )}
              </div>
            </div>
            <Button
              onClick={() => onEquipmentAdd(equipment)}
              disabled={!canAdd}
              variant={canAdd ? "primary" : "secondary"}
              size="sm"
              className="self-start"
            >
              {createButtonText(
                canAfford,
                !canUse ? restriction.reason : undefined
              )}
            </Button>
          </div>
        </Card>
      );
    },
    [characterRestrictionData, onEquipmentAdd]
  );

  return (
    <section className="mb-8">
      <Typography variant="sectionHeading">Available Equipment</Typography>

      <Card variant="info" className="mb-6">
        <InfoCardHeader icon="info" title="Shopping Guide" className="mb-3" />
        <Typography variant="description" color="primary">
          Browse and select equipment for your character. Items are organized by
          category.
          <span className="hidden sm:inline">
            {" "}
            You can only purchase items you can afford with your current gold.
          </span>
        </Typography>
      </Card>

      {isLoading ? (
        <LoadingState message="Loading equipment..." />
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
