import { CharacterData, SetCharacterData } from "../../../data/definitions";

export interface BaseStatsProps {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  userIsOwner?: boolean;
  showLevelUpModal?: () => void;
}
