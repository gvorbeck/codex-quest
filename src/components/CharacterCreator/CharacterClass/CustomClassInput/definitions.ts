import { CharacterData } from "../../../definitions";

export type CustomClassInputProps = {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  customClassInput: string;
  setCustomClassInput: (customClassInput: string) => void;
};
