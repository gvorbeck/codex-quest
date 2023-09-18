import { CharacterData } from "../../definitions";

export interface BaseStatsProps {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  userIsOwner?: boolean;
  showLevelUpModal?: () => void;
}
