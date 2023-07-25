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
  weight?: number;
  category: string;
  size?: string;
  damage?: string;
  AC?: string | number;
  amount: number;
  type?: string;
  range?: number[];
}
