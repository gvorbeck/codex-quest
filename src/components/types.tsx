export type AbilityRecord = {
  key: string;
  ability: string;
  score: number;
};

export type CharAbilityScoreStepProps = {
  abilities: {
    strength: number;
    intelligence: number;
    wisdom: number;
    dexterity: number;
    constitution: number;
    charisma: number;
  };
  setAbilities: (abilities: {
    strength: number;
    intelligence: number;
    wisdom: number;
    dexterity: number;
    constitution: number;
    charisma: number;
  }) => void;
  abilityModifiers: {
    strength: string;
    intelligence: string;
    wisdom: string;
    dexterity: string;
    constitution: string;
    charisma: string;
  };
  setAbilityModifiers: (abilityModifiers: {
    strength: string;
    intelligence: string;
    wisdom: string;
    dexterity: string;
    constitution: string;
    charisma: string;
  }) => void;
  setPlayerClass: (playerClass: string) => void;
  setComboClass: (comboClass: boolean) => void;
  setCheckedClasses: (checkedClasses: string[]) => void;
  setRace: (race: string) => void;
  setHitDice: (hitDice: string) => void;
  setHitPoints: (hitPoints: number) => void;
};

// export interface EquipmentItemSelectorProps {
//   item: Item | Beast | Weapon | ArmorShields;
//   gold: number;
//   setGold: (value: number) => void;
//   equipment: EquipmentType[];
//   setEquipment: (equipment: EquipmentType[]) => void;
//   race: string;
//   weight: number;
//   setWeight: (weight: number) => void;
//   strength: number;
// }

// export interface Beast {
//   costCurrency: string;
//   costValue: number;
//   name: string;
// }

// export interface Item extends Beast {
//   weight: number;
// }

// export interface Weapon extends Item {
//   size?: string;
//   damage?: string;
// }

// export interface ArmorShields extends Item {
//   AC: number | string;
// }
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

// export type EquipmentType = (Item | Beast | Weapon | ArmorShields) & {
//   quantity: number;
// };

// export interface CategoryCollapseProps {
//   title: string;
//   dataRef: React.MutableRefObject<Record<string, any[]>>;
//   gold: number;
//   setGold: (gold: number) => void;
//   equipment: EquipmentType[];
//   setEquipment: (equipment: EquipmentType[]) => void;
//   race: string;
//   weight: number;
//   setWeight: (weight: number) => void;
//   strength: number;
//   radioGroup?: boolean;
// }

export type Capacity = { light: number; heavy: number };
export type CapacityMap = Record<string, Capacity>;
