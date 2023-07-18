import { CharacterData } from "../../definitions";

export interface CharacterDescriptionProps {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  userIsOwner: boolean;
}
