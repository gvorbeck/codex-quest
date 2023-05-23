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

export interface EquipmentItemSelectorProps {
  item: Item | Beast | Weapon | ArmorShields;
  gold: number;
  setGold: (value: number) => void;
  equipment: EquipmentType[];
  setEquipment: (equipment: EquipmentType[]) => void;
  race: string;
  weight: number;
  setWeight: (weight: number) => void;
  strength: number;
}

export interface Beast {
  costCurrency: string;
  costValue: number;
  name: string;
}

export interface Item extends Beast {
  weight: number;
}

export interface Weapon extends Item {
  size?: string;
  damage?: string;
}

export interface ArmorShields extends Item {
  AC: number | string;
}

export type CharEquipmentStepProps = {
  gold: number;
  setGold: (gold: number) => void;
  equipment: EquipmentType[];
  setEquipment: (equipment: EquipmentType[]) => void;
  race: string;
  weight: number;
  setWeight: (weight: number) => void;
  strength: number;
};

export type EquipmentType = (Item | Beast | Weapon | ArmorShields) & {
  quantity: number;
};

export interface CategoryCollapseProps {
  title: string;
  dataRef: React.MutableRefObject<Record<string, any[]>>;
  gold: number;
  setGold: (gold: number) => void;
  equipment: EquipmentType[];
  setEquipment: (equipment: EquipmentType[]) => void;
  race: string;
  weight: number;
  setWeight: (weight: number) => void;
  strength: number;
}
