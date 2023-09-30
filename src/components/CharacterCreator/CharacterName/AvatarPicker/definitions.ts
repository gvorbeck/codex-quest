import { CharacterData, SetCharacterData } from "../../../../data/definitions";

export type AvatarPickerProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  imageSource: number;
  setImageSource: (imageSource: number) => void;
};
