import { CharSteps } from "../definitions";

export type RaceName = "Dwarf" | "Elf" | "Halfling" | "Human";

export interface CharacterRaceProps extends CharSteps {
  setComboClass: (comboxClass: boolean) => void;
  setCheckedClasses: (checkedClasses: string[]) => void;
}
