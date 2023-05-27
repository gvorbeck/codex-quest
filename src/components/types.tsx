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

export type CharClassStepProps = {
  abilities: {
    strength: number;
    intelligence: number;
    wisdom: number;
    dexterity: number;
    constitution: number;
    charisma: number;
  };
  race: string;
  playerClass: string;
  setPlayerClass: (playerClass: string) => void;
  comboClass: boolean;
  setComboClass: (comboClass: boolean) => void;
  checkedClasses: string[];
  setCheckedClasses: (checkedClasses: string[]) => void;
  setHitDice: (hitDice: string) => void;
  setHitPoints: (hitPoints: number) => void;
  spells: SpellItem[];
  setSpells: (spells: SpellItem[]) => void;
};

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
