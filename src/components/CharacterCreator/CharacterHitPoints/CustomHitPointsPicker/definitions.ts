import { CharacterData, SetCharacterData } from "../../../definitions";

export type CustomHitPointsPickerProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  customHitDice: string;
  setCustomHitDice: (customHitDice: string) => void;
};
