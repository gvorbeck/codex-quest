interface AbilityTypes {
  strength: number;
  intelligence: number;
  wisdom: number;
  dexterity: number;
  constitution: number;
  charisma: number;
}
interface Abilities {
  scores: AbilityTypes;
  modifiers: AbilityTypes;
}
interface HP {
  dice: string;
  points: number;
}
interface SpellLevels {
  cleric: number | null;
  "magic-user": number | null;
}
export interface Spell {
  name: string;
  range: string;
  level: SpellLevels;
  duration: string;
  description: string;
}
export interface CharacterData {
  abilities: Abilities;
  class: string;
  race: string;
  hp: HP;
  spells: Spell[];
}

interface CharSteps {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
}
export interface CharAbilityScoreStepProps extends CharSteps {
  setComboClass: (comboClass: boolean) => void;
  setCheckedClasses: (checkedClasses: string[]) => void;
}
export interface CharRaceStepProps extends CharSteps {
  setComboClass: (comboxClass: boolean) => void;
  setCheckedClasses: (checkedClasses: string[]) => void;
}
export interface CharClassStepProps extends CharSteps {
  comboClass: boolean;
  setComboClass: (comboClass: boolean) => void;
  checkedClasses: string[];
  setCheckedClasses: (checkedClasses: string[]) => void;
}

export interface AbilityRecord {
  key: string;
  ability: string;
  score: number;
}

export interface EquipmentItem {
  name: string;
  costValue: number;
  costCurrency: string;
  weight?: number;
  category: string;
  size?: string;
  damage?: string;
  AC?: string | number;
  amount: number;
}

export type CharEquipmentStepProps = {
  gold: number;
  setGold: (gold: number) => void;
  equipment: EquipmentItem[];
  setEquipment: (equipment: EquipmentItem[]) => void;
  race: string;
  weight: number;
  setWeight: (weight: number) => void;
  strength: number;
  equipmentItems: EquipmentItem[];
  setEquipmentItems: (equipmentItem: EquipmentItem[]) => void;
};

export type EquipmentCheckboxProps = {
  itemName: string;
  equipmentItems: EquipmentItem[];
  equipment: EquipmentItem[];
  setEquipment: (equipment: EquipmentItem[]) => void;
  setGold: (gold: number) => void;
  gold: number;
  handleWeightChange: () => void;
  weight: number;
  weightRestrictions: any;
  race: string;
};

export type Capacity = { light: number; heavy: number };
export type CapacityMap = Record<string, Capacity>;

export type PurchasedEquipmentProps = {
  gold: number;
  weight: number;
  equipment: EquipmentItem[];
};

export type EquipmentSelectorProps = {
  armorSelection: EquipmentItem | null;
  equipment: EquipmentItem[];
  equipmentCategories: string[];
  equipmentItems: EquipmentItem[];
  gold: number;
  handleWeightChange: () => void;
  race: string;
  setEquipment: (equipment: EquipmentItem[]) => void;
  setGold: (gold: number) => void;
  updateArmorSelection: any;
  weight: number;
  weightRestrictions: any;
};

export type CharNameStepProps = {
  name: string;
  setName: (name: string) => void;
};

export type SpellItem = {
  name: string;
};

export interface SpellType {
  name: string;
  range: string;
  level: {
    cleric: number | null;
    "magic-user": number | null;
  };
  duration: string;
  description: string;
}
