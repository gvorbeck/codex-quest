import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Accordion, Card, InfoCardHeader, Typography } from "@/components/ui";
import { Button } from "@/components/ui";
import { Icon } from "@/components/ui/display/Icon";
import { logger } from "@/utils/logger";
import type { Character, Equipment, Race, Class } from "@/types/character";
import { loadAllEquipment } from "@/services/dataLoader";
import { convertToGold } from "@/utils/currency";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";

type EquipmentWithIndex = Equipment & {
  [key: string]: unknown;
};

interface EquipmentSelectorProps {
  character: Character;
  onEquipmentAdd: (equipment: Equipment) => void;
}

/**
 * Mapping of class/race restriction IDs to equipment names for proper matching
 * This handles cases where the restriction ID doesn't exactly match the equipment name format
 */
const WEAPON_ID_MAPPING: Record<string, string[]> = {
  dagger: ["dagger"],
  "walking-staff": ["quarterstaff"],
  warhammer: ["warhammer"],
  mace: ["mace"],
  maul: ["maul"],
  club: ["club"],
  quarterstaff: ["quarterstaff"],
  sling: ["sling"],
  shortbow: ["shortbow"],
  sickle: ["sickle"],
  spade: ["spade"],
  scimitar: ["scimitar"],
  scythe: ["scythe"],
  greatsword: ["greatsword"],
  polearm: [
    "glaive",
    "halberd",
    "bill-guisarme",
    "bardiche",
    "bec-de-corbin",
    "fauchard",
    "glaive-guisarme",
    "guisarme",
    "lucern-hammer",
    "military-fork",
    "partisan",
    "ranseur",
    "spetum",
    "voulge",
  ],
  longbow: ["longbow"],
};

/**
 * Creates an equipment ID from the equipment name by converting to lowercase and replacing spaces with hyphens
 */
function createEquipmentId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Checks if an equipment name matches a restriction ID
 */
function isEquipmentMatchingRestriction(
  equipmentName: string,
  restrictionId: string
): boolean {
  const equipmentId = createEquipmentId(equipmentName);
  const mappedNames = WEAPON_ID_MAPPING[restrictionId];

  if (mappedNames) {
    return mappedNames.includes(equipmentId);
  }

  // Fallback to direct ID comparison
  return equipmentId === restrictionId;
}

/**
 * Checks if an equipment item is restricted for the character based on pre-calculated restriction data
 */
function isEquipmentRestrictedOptimized(
  equipment: Equipment,
  restrictionData: {
    race: Race | undefined;
    classes: Class[];
    currency: number;
  }
): { restricted: boolean; reason?: string } {
  // Only check weapon restrictions for items with damage (weapons)
  if (!equipment.damage) {
    return { restricted: false };
  }

  // Check race prohibitions
  if (restrictionData.race?.prohibitedWeapons) {
    for (const prohibitedWeapon of restrictionData.race.prohibitedWeapons) {
      if (isEquipmentMatchingRestriction(equipment.name, prohibitedWeapon)) {
        return {
          restricted: true,
          reason: `${restrictionData.race.name} Restriction`,
        };
      }
    }

    // Check for size-based restrictions (Large weapons for small races)
    if (
      equipment.size === "L" &&
      restrictionData.race.prohibitedWeapons.includes("large")
    ) {
      return {
        restricted: true,
        reason: `${restrictionData.race.name} Restriction`,
      };
    }
  }

  // Check class restrictions using pre-calculated class data
  for (const characterClass of restrictionData.classes) {
    if (
      characterClass?.allowedWeapons &&
      characterClass.allowedWeapons.length > 0
    ) {
      // If class has weapon restrictions, check if this weapon is allowed
      let isAllowed = false;
      for (const allowedWeapon of characterClass.allowedWeapons) {
        if (isEquipmentMatchingRestriction(equipment.name, allowedWeapon)) {
          isAllowed = true;
          break;
        }
      }
      if (!isAllowed) {
        return {
          restricted: true,
          reason: `${characterClass.name} Restriction`,
        };
      }
    }
  }

  return { restricted: false };
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
    const characterRace = allRaces.find((race) => race.id === character.race);
    const characterClasses = character.class
      .map((classId) => allClasses.find((cls) => cls.id === classId))
      .filter((cls): cls is Class => cls !== undefined);

    return {
      race: characterRace,
      classes: characterClasses,
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
      const costInGold = convertToGold(
        equipment.costValue,
        equipment.costCurrency
      );

      const canAfford = characterRestrictionData.currency >= costInGold;
      const restriction = isEquipmentRestrictedOptimized(
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
              disabled={!canAdd}
              variant={canAdd ? "primary" : "secondary"}
              size="sm"
              className="self-start"
            >
              Add {!canAfford && "(Can't Afford)"}{" "}
              {!canUse && restriction.reason && `(${restriction.reason})`}
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
        <InfoCardHeader
          icon={<Icon name="info" />}
          title="Shopping Guide"
          className="mb-3"
        />
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
