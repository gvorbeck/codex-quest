import { EquipmentItem, SavingThrowsType } from "../definitions";

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
  customRules?: { title: string; description: string }[];
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
  savingThrows: [number, SavingThrowsType][];
  savingThrowsNotes?: string[];
  specialAbilities?: {
    titles: string[];
    stats: number[][];
  };
  specificEquipmentItems?: [string[], string[]];
  spellBudget?: number[][];
  startingEquipment?: EquipmentItem[];
  startingSpells?: string[];
};
