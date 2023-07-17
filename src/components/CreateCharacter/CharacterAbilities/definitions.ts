import { CharSteps } from "../definitions";

export interface CharAbilityScoreStepProps extends CharSteps {
  setComboClass: (comboClass: boolean) => void;
  setCheckedClasses: (checkedClasses: string[]) => void;
}

export interface AbilityRecord {
  key: string;
  ability: string;
  score: number;
}
