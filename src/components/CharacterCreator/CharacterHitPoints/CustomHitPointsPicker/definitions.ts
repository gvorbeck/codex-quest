import { CharacterData } from "../../../definitions";

export type CustomHitPointsPickerProps = {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  customHitDice: string;
  setCustomHitDice: (customHitDice: string) => void;
};
