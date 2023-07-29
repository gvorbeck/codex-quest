import { CharacterData } from "../definitions";

export type ClassName = "Cleric" | "Fighter" | "Thief" | "Magic-User";

export interface EquipmentStoreProps {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  inBuilder?: boolean;
}

export interface EquipmentItem {
  name: string;
  costValue: number;
  costCurrency: string;
  category: string;
  amount: number;
  weight?: number;
  size?: string;
  damage?: string;
  AC?: string | number;
  type?: string;
  range?: number[];
  ammo?: string[];
}
