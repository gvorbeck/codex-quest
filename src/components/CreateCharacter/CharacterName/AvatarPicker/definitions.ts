import { CharacterData } from "../../../definitions";

export type AvatarPickerProps = {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  imageSource: number;
  setImageSource: (imageSource: number) => void;
};
