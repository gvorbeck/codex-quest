import { CharacterData } from "../../definitions";

export interface MoneyStatsProps {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  userIsOwner: boolean;
  makeChange: () => { gp: number; sp: number; cp: number };
}
