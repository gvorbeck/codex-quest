import { RaceNames } from "../../definitions";
import { CharSteps } from "../definitions";

export type RaceName = RaceNames;

export interface CharacterRaceProps extends CharSteps {
  setComboClass: (comboxClass: boolean) => void;
  setCheckedClasses: (checkedClasses: string[]) => void;
}
