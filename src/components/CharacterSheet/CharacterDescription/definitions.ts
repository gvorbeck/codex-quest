import { CharacterData, SetCharacterData } from "../../definitions";

export type CharacterDescriptionProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  userIsOwner: boolean;
};
