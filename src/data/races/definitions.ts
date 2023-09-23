import { EquipmentItem } from "../../components/EquipmentStore/definitions";
import { SavingThrows } from "../../components/definitions";
import { DiceTypes } from "../definitions";
import { ClassNames } from "../definitions";

export interface RaceSetup {
  additionalAttackBonus?: string; // Ex: "+1"
  allowedCombinationClasses?: ClassNames[];
  allowedStandardClasses: ClassNames[];
  details?: {
    description?: string;
    restrictions?: string[];
    specials?: string[];
  };
  hasLowCapacity?: boolean;
  incrementHitDie?: boolean; // Use the next highest die type for hit points
  maximumAbilityRequirements?: Record<string, number>;
  maximumHitDice?: DiceTypes;
  minimumAbilityRequirements?: Record<string, number>;
  name: string;
  noLargeEquipment?: boolean;
  savingThrows?: Partial<SavingThrows>;
  uniqueAttacks?: EquipmentItem[];
  specialAbilitiesOverride?: any;
}
