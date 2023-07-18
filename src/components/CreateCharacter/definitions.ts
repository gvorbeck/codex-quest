import { CharacterData } from "../definitions";

export interface CharSteps {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
}
