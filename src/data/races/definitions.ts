import { DiceTypes, EquipmentItem, SavingThrowsType } from "../definitions";
import { ClassNames } from "../definitions";

export interface RaceSetup {
  additionalAttackBonus?: string; // Ex: "+1"
  allowedCombinationClasses?: ClassNames[];
  allowedStandardClasses: ClassNames[];
  altBaseAC?: number;
  decrementHitDie?: boolean; // Use the next highest die type for hit points
  details: {
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
  rangedBonus?: number;
  savingThrows?: Partial<SavingThrowsType>;
  specialAbilitiesOverride?: unknown;
  uniqueAttacks?: EquipmentItem[];
}
