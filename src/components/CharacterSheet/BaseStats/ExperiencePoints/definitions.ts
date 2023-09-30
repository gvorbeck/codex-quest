import { CharacterData } from "../../../../data/definitions";

export interface ExperiencePointsProps {
  characterData: CharacterData;
  setCharacterData?: (character: CharacterData) => void;
  userIsOwner?: boolean;
  showLevelUpModal?: () => void;
}
