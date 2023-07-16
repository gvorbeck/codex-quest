import { CharacterData } from "../../types";

export interface BaseStatsProps {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  userIsOwner?: boolean;
  showLevelUpModal?: () => void;
}
