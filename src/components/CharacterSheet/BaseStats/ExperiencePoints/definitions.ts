import { CharacterData } from "../../../definitions";

export interface ExperiencePointsProps {
  character: CharacterData;
  setCharacter?: (character: CharacterData) => void;
  className?: string;
  userIsOwner?: boolean;
  showLevelUpModal?: () => void;
}
