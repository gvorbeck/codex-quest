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

export interface AbilityTypes {
  strength: number | string;
  intelligence: number | string;
  wisdom: number | string;
  dexterity: number | string;
  constitution: number | string;
  charisma: number | string;
}

export interface Abilities {
  scores: AbilityTypes;
  modifiers: AbilityTypes;
}
