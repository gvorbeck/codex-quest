import { CharacterDataStatePair } from "../../definitions";

export interface CharacterRaceProps extends CharacterDataStatePair {
  setComboClass: (comboxClass: boolean) => void;
  setCheckedClasses: (checkedClasses: string[]) => void;
}
