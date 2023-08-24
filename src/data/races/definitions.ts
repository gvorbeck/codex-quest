import { DiceTypes, SavingThrows } from "../../components/definitions";
import { ClassNamesTwo } from "../classes";

export interface RaceSetup {
  name: string;
  allowedStandardClasses: ClassNamesTwo[];
  noLargeEquipment?: boolean;
  allowedCombinationClasses?: ClassNamesTwo[];
  minimumAbilityRequirements?: Record<string, number>;
  maximumAbilityRequirements?: Record<string, number>;
  maximumHitDice?: DiceTypes;
  savingThrows?: Partial<SavingThrows>;
  details?: {
    description?: string;
    specials?: string[];
    restrictions?: string[];
  };
}
