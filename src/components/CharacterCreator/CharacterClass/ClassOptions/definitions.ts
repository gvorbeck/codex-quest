import {
  CharacterData,
  SetCharacterData,
  Spell,
} from "../../../../data/definitions";

export type ClassOptionsProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  customClassInput: string;
  setShowCustomClassInput: (showCustomClassInput: boolean) => void;
  setSelectedSpell: (spell: Spell | null) => void;
};
