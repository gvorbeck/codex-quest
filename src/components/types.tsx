export interface EquipmentItemSelectorProps {
  item: Item | Beast | Weapon | ArmorShields;
  gold: number;
  setGold: (value: number) => void;
  equipment: EquipmentType[];
  setEquipment: (equipment: EquipmentType[]) => void;
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
}
