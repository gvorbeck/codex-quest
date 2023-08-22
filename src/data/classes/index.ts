import { DiceTypes } from "../../components/definitions";
import { ClassSetup, SavingThrowsCollection } from "./definitions";
import { fighter } from "./fighter";
import { magicUser } from "./magicUser";
import { thief } from "./thief";

export enum ClassNamesTwo {
  ASSASSIN = "Assassin",
  BARBARIAN = "Barbarian",
  CLERIC = "Cleric",
  DRUID = "Druid",
  FIGHTER = "Fighter",
  ILLUSIONIST = "Illusionist",
  MAGICUSER = "Magic-User",
  THIEF = "Thief",
  CUSTOM = "Custom",
}

type Classes = {
  [key in ClassNamesTwo]: ClassSetup;
};

const customPlaceholder = {
  name: "Custom",
  hitDice: DiceTypes.D4,
  hitDiceModifier: 1,
  experiencePoints: [0],
  attackBonus: [0],
  savingThrows: [
    [
      1,
      {
        deathRayOrPoison: 12,
        magicWands: 13,
        paralysisOrPetrify: 14,
        dragonBreath: 15,
        spells: 17,
      },
    ],
    [
      3,
      {
        deathRayOrPoison: 11,
        magicWands: 12,
        paralysisOrPetrify: 14,
        dragonBreath: 15,
        spells: 16,
      },
    ],
  ] as SavingThrowsCollection,
};

export const classes: Classes = {
  [ClassNamesTwo.ASSASSIN]: customPlaceholder,
  [ClassNamesTwo.BARBARIAN]: customPlaceholder,
  [ClassNamesTwo.CLERIC]: customPlaceholder,
  [ClassNamesTwo.CUSTOM]: customPlaceholder,
  [ClassNamesTwo.DRUID]: customPlaceholder,
  [ClassNamesTwo.FIGHTER]: fighter,
  [ClassNamesTwo.ILLUSIONIST]: customPlaceholder,
  [ClassNamesTwo.MAGICUSER]: magicUser,
  [ClassNamesTwo.THIEF]: thief,
};
