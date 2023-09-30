import { CharacterData, SetCharacterData } from "../../../data/definitions";

export type GoldRollerProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  goldInputValue: number;
  setGoldInputValue: (goldInputValue: number) => void;
};
