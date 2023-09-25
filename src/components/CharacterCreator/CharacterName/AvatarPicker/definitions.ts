import { CharacterData, SetCharacterData } from "../../../definitions";

export type AvatarPickerProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  imageSource: number;
  setImageSource: (imageSource: number) => void;
};
