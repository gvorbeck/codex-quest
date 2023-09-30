import { CharacterData, SetCharacterData } from "../../../../data/definitions";

export type CustomClassInputProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  customClassInput: string;
  setCustomClassInput: (customClassInput: string) => void;
};
