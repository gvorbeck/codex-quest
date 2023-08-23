import { DiceTypes } from "../../components/definitions";
import { ClassSetup, SavingThrowsCollection } from "./definitions";
import { fighter } from "./fighter";
import { magicUser } from "./magicUser";
import { thief } from "./thief";
import { cleric } from "./cleric";
import { assassin } from "./assassin";
import { barbarian } from "./barbarian";
import { druid } from "./druid";
import { illusionist } from "./illusionist";
import { equipmentCategories } from "../definitions";

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

const customPlaceholder: ClassSetup = {
  name: "Custom",
  hitDice: DiceTypes.D4,
  hitDiceModifier: 1,
  availableEquipmentCategories: [
    equipmentCategories.AMMUNITION,
    equipmentCategories.ARMOR,
    equipmentCategories.SHIELDS,
    equipmentCategories.AXES,
    equipmentCategories.BEASTS,
    equipmentCategories.BARDING,
    equipmentCategories.BOWS,
    equipmentCategories.DAGGERS,
    equipmentCategories.HAMMERMACE,
    equipmentCategories.GENERAL,
    equipmentCategories.OTHERWEAPONS,
    equipmentCategories.SWORDS,
    equipmentCategories.SPEARSPOLES,
    equipmentCategories.IMPROVISED,
    equipmentCategories.SLINGHURLED,
    equipmentCategories.CHAINFLAIL,
  ],
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
  [ClassNamesTwo.ASSASSIN]: assassin,
  [ClassNamesTwo.BARBARIAN]: barbarian,
  [ClassNamesTwo.CLERIC]: cleric,
  [ClassNamesTwo.CUSTOM]: customPlaceholder,
  [ClassNamesTwo.DRUID]: druid,
  [ClassNamesTwo.FIGHTER]: fighter,
  [ClassNamesTwo.ILLUSIONIST]: illusionist,
  [ClassNamesTwo.MAGICUSER]: magicUser,
  [ClassNamesTwo.THIEF]: thief,
};
