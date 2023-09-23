import { CharacterData } from "../../definitions";

export type CharacterDescriptionProps = {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  userIsOwner: boolean;
};
