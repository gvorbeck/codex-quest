import { CharSteps } from "../definitions";

export interface CharacterRaceProps extends CharSteps {
  setComboClass: (comboxClass: boolean) => void;
  setCheckedClasses: (checkedClasses: string[]) => void;
}
