import { CharacterData, SetCharacterData } from "../../definitions";

export interface MoneyStatsProps {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  userIsOwner: boolean;
  makeChange: () => { gp: number; sp: number; cp: number };
}
