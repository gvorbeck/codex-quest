import { CharacterData } from "../../definitions";

export type GoldRollerProps = {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  goldInputValue: number;
  setGoldInputValue: (goldInputValue: number) => void;
};
