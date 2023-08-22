import { ClassSetup } from "./definitions";

export enum ClassNamesTwo {
  // ASSASSIN = "Assassin",
  // BARBARIAN = "Barbarian",
  // CLERIC = "Cleric",
  // DRUID = "Druid",
  // FIGHTER = "Fighter",
  // ILLUSIONIST = "Illusionist",
  // MAGICUSER = "Magic-User",
  // THIEF = "Thief",
  CUSTOM = "Custom",
}

type Classes = {
  [key in ClassNamesTwo]: ClassSetup;
};

export const classes: Classes = {
  [ClassNamesTwo.CUSTOM]: {},
};
