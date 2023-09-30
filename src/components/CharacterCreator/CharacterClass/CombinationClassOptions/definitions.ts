import {
  CharacterData,
  RaceNames,
  SetCharacterData,
} from "../../../../data/definitions";

export type CombinationClassOptionsProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  checkedClasses: string[];
  setCheckedClasses: (checkedClasses: string[]) => void;
  raceKey: RaceNames;
};
