import { CharacterData } from "../../types";

export interface CharacterDescriptionProps {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  userIsOwner: boolean;
}
