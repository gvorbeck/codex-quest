import { CharacterData, SetCharacterData } from "../../../definitions";

export type CustomClassInputProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  customClassInput: string;
  setCustomClassInput: (customClassInput: string) => void;
};
