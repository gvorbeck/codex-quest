import {
  CharacterData,
  ClassNames,
  SetCharacterData,
} from "../../data/definitions";
// import { CharacterData, SetCharacterData } from "../definitions";

export type ClassName = ClassNames;

export interface EquipmentStoreProps {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  inBuilder?: boolean;
}
