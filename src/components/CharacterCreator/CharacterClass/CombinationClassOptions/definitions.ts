import { RaceNames } from "../../../../data/definitions";
import { CharacterData, SetCharacterData } from "../../../definitions";

export type CombinationClassOptionsProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  checkedClasses: string[];
  setCheckedClasses: (checkedClasses: string[]) => void;
  raceKey: RaceNames;
};
