import { CharacterData, SetCharacterData } from "../../definitions";

export interface BaseStatsProps {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  userIsOwner?: boolean;
  showLevelUpModal?: () => void;
}
