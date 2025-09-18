import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Accordion, Card, InfoCardHeader, Typography } from "@/components/ui";
import { Button } from "@/components/ui";
import { Icon, type IconName } from "@/components/ui/core/display/Icon";
import { LoadingState } from "@/components/ui/core/feedback";
import { logger } from "@/utils";
import type { Character, Equipment, Race, Class } from "@/types";
import { loadAllEquipment } from "@/services/dataLoader";
import { findById } from "@/utils";
import { convertToGoldFromAbbreviation } from "@/utils/currency";
import { allRaces, allClasses } from "@/data";

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
 * Mapping of class armor restriction IDs to equipment names for proper matching
 */
const ARMOR_ID_MAPPING: Record<string, string[]> = {
  none: [], // Special case: no armor allowed
  padded: ["padded/quilted-armor"],
  leather: ["leather-armor"],
  studded: ["studded-leather-armor"],
  "studded-leather": ["studded-leather-armor"],
  hide: ["hide-armor"],
  ring: ["ring-mail"],
  "ring-mail": ["ring-mail"],
  brigandine: ["brigandine-armor"],
  chain: ["chain-mail"],
  "chain-mail": ["chain-mail"],
  scale: ["scale-mail"],
  "scale-mail": ["scale-mail"],
  splint: ["splint-mail"],
  "splint-mail": ["splint-mail"],
  banded: ["banded-mail"],
  "banded-mail": ["banded-mail"],
  plate: ["plate-mail"],
  "plate-mail": ["plate-mail"],
  "field-plate": ["field-plate-mail"],
  "field-plate-mail": ["field-plate-mail"],
  "full-plate": ["full-plate-mail"],
  "full-plate-mail": ["full-plate-mail"],
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
 * Creates a restriction result object
 */
function createRestriction(entityName: string): {
  restricted: true;
  reason: string;
} {
  return {
    restricted: true,
    reason: `${entityName} Restriction`,
  };
}

/**
 * Checks if equipment is allowed based on a list of allowed items and mapping
 */
function isEquipmentInAllowedList(
  equipmentName: string,
  allowedList: string[],
  mapping: Record<string, string[]>
): boolean {
  const equipmentId = createEquipmentId(equipmentName);

  for (const allowedItem of allowedList) {
    const mappedNames = mapping[allowedItem];
    if (mappedNames) {
      if (mappedNames.includes(equipmentId)) {
        return true;
      }
    } else {
      // Fallback to direct ID comparison
      if (equipmentId === allowedItem) {
        return true;
      }
    }
  }

  return false;
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
  const isWeapon = !!equipment.damage;
  const isArmor = equipment.category === "armor";

  // Check weapon restrictions for items with damage (weapons)
  if (isWeapon) {
    // Check race prohibitions
    if (restrictionData.race?.prohibitedWeapons) {
      for (const prohibitedWeapon of restrictionData.race.prohibitedWeapons) {
        if (isEquipmentMatchingRestriction(equipment.name, prohibitedWeapon)) {
          return createRestriction(restrictionData.race.name);
        }
      }

      // Check for size-based restrictions (Large weapons for small races)
      if (
        equipment.size === "L" &&
        restrictionData.race.prohibitedWeapons.includes("large")
      ) {
        return createRestriction(restrictionData.race.name);
      }
    }

    // Check class weapon restrictions using pre-calculated class data
    for (const characterClass of restrictionData.classes) {
      if (
        characterClass?.allowedWeapons &&
        characterClass.allowedWeapons.length > 0
      ) {
        // If class has weapon restrictions, check if this weapon is allowed
        if (
          !isEquipmentInAllowedList(
            equipment.name,
            characterClass.allowedWeapons,
            WEAPON_ID_MAPPING
          )
        ) {
          return createRestriction(characterClass.name);
        }
      }
    }
  }

  // Check armor restrictions for armor items
  if (isArmor) {
    for (const characterClass of restrictionData.classes) {
      if (
        characterClass?.allowedArmor &&
        characterClass.allowedArmor.length > 0
      ) {
        // Special case: "none" means no armor allowed
        if (characterClass.allowedArmor.includes("none")) {
          return createRestriction(characterClass.name);
        }

        // Check if this armor type is in the allowed list
        if (
          !isEquipmentInAllowedList(
            equipment.name,
            characterClass.allowedArmor,
            ARMOR_ID_MAPPING
          )
        ) {
          return createRestriction(characterClass.name);
        }
      }
      // If allowedArmor is empty array, no restrictions (can wear any armor)
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
    const characterRace = findById(character.race, allRaces);
    const characterClasses = character.class
      .map((classId) => findById(classId, allClasses))
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
      const costInGold = convertToGoldFromAbbreviation(
        equipment.costValue,
        equipment.costCurrency as "gp" | "sp" | "cp" | "ep" | "pp"
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
