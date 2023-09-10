import { EquipmentItem } from "../../components/EquipmentStore/definitions";
import { SavingThrows } from "../../components/definitions";

type SavingThrowEntry = [number, SavingThrows];
export type SavingThrowsCollection = SavingThrowEntry[];

export interface ClassSetup {
  name: string;
  minimumAbilityRequirements?: Partial<
    Record<
      | "strength"
      | "wisdom"
      | "intelligence"
      | "dexterity"
      | "charisma"
      | "constitution",
      number
    >
  >;
  availableEquipmentCategories: string[];
  specificEquipmentItems?: [string[], string[]];
  hitDice: string;
  hitDiceModifier: number;
  experiencePoints: number[];
  attackBonus: number[];
  savingThrows: SavingThrowsCollection;
  spellBudget?: number[][];
  startingSpells?: string[];
  startingEquipment?: EquipmentItem[];
  specialAbilities?: {
    titles: string[];
    stats: number[][];
  };
  powers?: EquipmentItem[];
  details?: {
    description?: string;
    specials?: string[];
    restrictions?: string[];
  };
}
