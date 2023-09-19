import { CharacterData } from "../../../definitions";

export interface ExperiencePointsProps {
  characterData: CharacterData;
  setCharacterData?: (character: CharacterData) => void;
  className?: string;
  userIsOwner?: boolean;
  showLevelUpModal?: () => void;
}
