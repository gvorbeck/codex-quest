import { RaceNamesTwo } from "../../../../data/races";
import { CharacterData } from "../../../definitions";

export type CombinationClassOptionsProps = {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  checkedClasses: string[];
  setCheckedClasses: (checkedClasses: string[]) => void;
  raceKey: RaceNamesTwo;
};
