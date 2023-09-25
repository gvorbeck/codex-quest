import { CharacterData } from "../../../definitions";

export interface ExperiencePointsProps {
  characterData: CharacterData;
  setCharacterData?: (character: CharacterData) => void;
  userIsOwner?: boolean;
  showLevelUpModal?: () => void;
}
