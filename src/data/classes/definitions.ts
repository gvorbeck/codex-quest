import { SavingThrows } from "../../components/definitions";

type SavingThrowEntry = [number, SavingThrows];
export type SavingThrowsCollection = SavingThrowEntry[];

export interface ClassSetup {
  name: string;
  minimumAbilityRequirements?: Record<string, number>;
  hitDice: string;
  hitDiceModifier: number;
  experiencePoints: number[];
  attackBonus: number[];
  savingThrows: SavingThrowsCollection;
  spellBudget?: number[] | null;
  details?: {
    description?: string;
    specials?: string[];
    restrictions?: string[];
  };
}
