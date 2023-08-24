import { CharacterData, SpellType } from "../../../definitions";

export type ClassOptionsProps = {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  customClassInput: string;
  setShowCustomClassInput: (showCustomClassInput: boolean) => void;
  setSelectedSpell: (spell: SpellType | null) => void;
};
