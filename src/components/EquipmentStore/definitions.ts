import { ClassNames } from "../../data/definitions";
import { CharacterData, SetCharacterData } from "../definitions";

export type ClassName = ClassNames;

export interface EquipmentStoreProps {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
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
  missileAC?: string;
  AC?: string | number;
  type?: string;
  range?: number[];
  ammo?: string[];
  noDelete?: boolean;
  minLevel?: number;
}
