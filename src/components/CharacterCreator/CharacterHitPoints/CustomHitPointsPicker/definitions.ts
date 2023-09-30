import { CharacterData, SetCharacterData } from "../../../../data/definitions";

export type CustomHitPointsPickerProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  customHitDice: string;
  setCustomHitDice: (customHitDice: string) => void;
};
