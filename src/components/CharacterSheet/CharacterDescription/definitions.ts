import { CharacterData, SetCharacterData } from "../../../data/definitions";

export type CharacterDescriptionProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  userIsOwner: boolean;
};
