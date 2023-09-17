import { RaceNamesTwo } from "../../../../data/definitions";
import { CharacterData } from "../../../definitions";

export type CombinationClassOptionsProps = {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  checkedClasses: string[];
  setCheckedClasses: (checkedClasses: string[]) => void;
  raceKey: RaceNamesTwo;
};
