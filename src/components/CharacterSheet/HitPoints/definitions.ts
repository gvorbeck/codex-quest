import { CharacterData } from "../../types";

export interface HitPointsProps {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  userIsOwner: boolean;
  className?: string;
}
