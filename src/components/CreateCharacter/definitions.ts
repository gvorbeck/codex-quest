import { CharacterData } from "../types";

export interface CharSteps {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
}
