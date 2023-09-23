import { CharacterData } from "../../definitions";

export interface HitPointsProps {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  userIsOwner: boolean;
}
