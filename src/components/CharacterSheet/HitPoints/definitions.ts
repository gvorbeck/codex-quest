import { CharacterData, SetCharacterData } from "../../../data/definitions";

export interface HitPointsProps {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  userIsOwner: boolean;
}
