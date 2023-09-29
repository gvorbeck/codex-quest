import { Spell } from "../../../../data/definitions";
import { CharacterData, SetCharacterData } from "../../../definitions";

export type ClassOptionsProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  customClassInput: string;
  setShowCustomClassInput: (showCustomClassInput: boolean) => void;
  setSelectedSpell: (spell: Spell | null) => void;
};
