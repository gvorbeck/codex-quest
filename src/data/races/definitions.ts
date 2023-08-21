import {
  ClassNames,
  DiceTypes,
  SavingThrows,
} from "../../components/definitions";

export interface RaceSetup {
  name: string;
  allowedStandardClasses: ClassNames[];
  allowedCombinationClasses?: ClassNames[];
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
