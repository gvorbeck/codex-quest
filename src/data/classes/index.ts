import { DiceTypes } from "../definitions";
import { ClassSetup } from "./definitions";
import { fighter } from "./fighter";
import { magicUser } from "./magicUser";
import { thief } from "./thief";
import { cleric } from "./cleric";
import { assassin } from "./assassin";
import { barbarian } from "./barbarian";
import { druid } from "./druid";
import { illusionist } from "./illusionist";
import { ClassNames, equipmentCategories } from "../definitions";
import { necromancer } from "./necromancer";
import { ranger } from "./ranger";
import { paladin } from "./paladin";
import { scout } from "./scout";
import { SavingThrows } from "../../components/definitions";

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
  ] as [number, SavingThrows][],
};

export const classes: { [key in ClassNames]: ClassSetup } = {
  [ClassNames.ASSASSIN]: assassin,
  [ClassNames.BARBARIAN]: barbarian,
  [ClassNames.CLERIC]: cleric,
  [ClassNames.CUSTOM]: customPlaceholder,
  [ClassNames.DRUID]: druid,
  [ClassNames.FIGHTER]: fighter,
  [ClassNames.ILLUSIONIST]: illusionist,
  [ClassNames.MAGICUSER]: magicUser,
  [ClassNames.THIEF]: thief,
  [ClassNames.NECROMANCER]: necromancer,
  [ClassNames.RANGER]: ranger,
  [ClassNames.PALADIN]: paladin,
  [ClassNames.SCOUT]: scout,
};
