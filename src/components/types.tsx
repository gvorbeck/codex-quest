export interface AbilityTypes {
  strength: number | string;
  intelligence: number | string;
  wisdom: number | string;
  dexterity: number | string;
  constitution: number | string;
  charisma: number | string;
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
  gold: number;
  equipment: EquipmentItem[];
  weight: number;
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
export interface CharHitPointsStepProps extends CharSteps {
  comboClass: boolean;
}
export interface CharEquipmentStepProps extends CharSteps {
  equipmentItems: EquipmentItem[];
}
export interface EquipmentSelectorProps extends CharSteps {
  armorSelection: EquipmentItem | null;
  equipmentCategories: string[];
  equipmentItems: EquipmentItem[];
  handleWeightChange: () => void;
  updateArmorSelection: any;
  weightRestrictions: any;
}
export interface PurchasedEquipmentProps extends CharSteps {}
export interface EquipmentCheckboxProps extends CharSteps {
  itemName: string;
  equipmentItems: EquipmentItem[];
  handleWeightChange: () => void;
  weightRestrictions: any;
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

export interface AbilityRecord {
  key: string;
  ability: string;
  score: number;
}

export type Capacity = { light: number; heavy: number };
export type CapacityMap = Record<string, Capacity>;

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
