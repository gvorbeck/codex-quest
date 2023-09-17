import { DiceTypes, SavingThrows } from "../../components/definitions";
import { ClassNamesTwo } from "../definitions";

export interface RaceSetup {
  additionalAttackBonus?: string; // Ex: "+1"
  allowedCombinationClasses?: ClassNamesTwo[];
  allowedStandardClasses: ClassNamesTwo[];
  details?: {
    description?: string;
    restrictions?: string[];
    specials?: string[];
  };
  incrementHitDie?: boolean; // Use the next highest die type for hit points
  maximumAbilityRequirements?: Record<string, number>;
  maximumHitDice?: DiceTypes;
  minimumAbilityRequirements?: Record<string, number>;
  name: string;
  noLargeEquipment?: boolean;
  savingThrows?: Partial<SavingThrows>;
}
