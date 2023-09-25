import { CharacterData, SetCharacterData } from "../../definitions";

export interface HitPointsProps {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  userIsOwner: boolean;
}
