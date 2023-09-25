import {
  CharacterData,
  SpellType,
  SetCharacterData,
} from "../../../definitions";

export type ClassOptionsProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  customClassInput: string;
  setShowCustomClassInput: (showCustomClassInput: boolean) => void;
  setSelectedSpell: (spell: SpellType | null) => void;
};
