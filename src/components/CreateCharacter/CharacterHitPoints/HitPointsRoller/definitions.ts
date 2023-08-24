import { CharacterData } from "../../../definitions";

export type HitPointsRollerProps = {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  customHitDice: string;
};
