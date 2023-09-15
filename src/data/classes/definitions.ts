import { EquipmentItem } from "../../components/EquipmentStore/definitions";
import { SavingThrows } from "../../components/definitions";

type SavingThrowEntry = [number, SavingThrows];
export type SavingThrowsCollection = SavingThrowEntry[];

export type ClassSetup = {
  attackBonus: number[];
  availableEquipmentCategories: string[];
  details?: {
    description?: string;
    restrictions?: string[];
    specials?: string[];
  };
  experiencePoints: number[];
  equipmentAttackBonuses?: [string, string][];
  hitDice: string;
  hitDiceModifier: number;
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
  name: string;
  noLargeEquipment?: boolean;
  powers?: EquipmentItem[];
  savingThrows: SavingThrowsCollection;
  specialAbilities?: {
    titles: string[];
    stats: number[][];
  };
  specificEquipmentItems?: [string[], string[]];
  spellBudget?: number[][];
  startingEquipment?: EquipmentItem[];
  startingSpells?: string[];
};
