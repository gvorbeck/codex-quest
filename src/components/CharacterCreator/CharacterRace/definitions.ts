import { CharacterDataStatePair } from "../../../data/definitions";

export interface CharacterRaceProps extends CharacterDataStatePair {
  setComboClass: (comboxClass: boolean) => void;
  setCheckedClasses: (checkedClasses: string[]) => void;
}
