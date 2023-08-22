import { DiceTypes } from "../../components/definitions";
import { ClassSetup } from "./definitions";

export const fighter: ClassSetup = {
  name: "Fighter",
  minimumAbilityRequirements: { strength: 9 },
  hitDice: DiceTypes.D8,
  hitDiceModifier: 2,
  experiencePoints: [
    0, 2000, 4000, 8000, 16000, 32000, 64000, 120000, 240000, 360000, 480000,
    600000, 720000, 840000, 960000, 1080000, 1200000, 1320000, 1440000, 1560000,
  ],
  attackBonus: [
    0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 6, 7, 7, 8, 8, 8, 9, 9, 10, 10, 10,
  ],
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
    [
      5,
      {
        deathRayOrPoison: 11,
        magicWands: 11,
        paralysisOrPetrify: 13,
        dragonBreath: 14,
        spells: 15,
      },
    ],
    [
      7,
      {
        deathRayOrPoison: 10,
        magicWands: 11,
        paralysisOrPetrify: 12,
        dragonBreath: 14,
        spells: 15,
      },
    ],
    [
      9,
      {
        deathRayOrPoison: 9,
        magicWands: 10,
        paralysisOrPetrify: 12,
        dragonBreath: 13,
        spells: 14,
      },
    ],
    [
      11,
      {
        deathRayOrPoison: 9,
        magicWands: 9,
        paralysisOrPetrify: 11,
        dragonBreath: 12,
        spells: 13,
      },
    ],
    [
      13,
      {
        deathRayOrPoison: 8,
        magicWands: 9,
        paralysisOrPetrify: 10,
        dragonBreath: 12,
        spells: 13,
      },
    ],
    [
      15,
      {
        deathRayOrPoison: 7,
        magicWands: 8,
        paralysisOrPetrify: 10,
        dragonBreath: 11,
        spells: 12,
      },
    ],
    [
      17,
      {
        deathRayOrPoison: 7,
        magicWands: 7,
        paralysisOrPetrify: 9,
        dragonBreath: 10,
        spells: 11,
      },
    ],
    [
      19,
      {
        deathRayOrPoison: 6,
        magicWands: 7,
        paralysisOrPetrify: 8,
        dragonBreath: 10,
        spells: 11,
      },
    ],
    [
      20,
      {
        deathRayOrPoison: 5,
        magicWands: 6,
        paralysisOrPetrify: 8,
        dragonBreath: 9,
        spells: 10,
      },
    ],
  ],
  details: {
    description:
      "**Fighters** include soldiers, guardsmen, barbarian warriors, and anyone else for whom fighting is a way of life. They train in combat, and they generally approach problems head-on, weapon in hand.\n\nNot surprisingly, Fighters are the best at fighting of all the classes. They are also the hardiest, able to take more punishment than any other class. Although they are not skilled in the ways of magic, Fighters can nonetheless use many magic items, including but not limited to magical weapons and armor.\n\nThe Prime Requisite for Fighters is Strength; a character must have a Strength score of 9 or higher to become a Fighter. Members of this class may wear any armor and use any weapon.",
    specials: [
      "Although they are not skilled in the ways of magic, **Fighters** can nonetheless use many magic items, including but not limited to magical weapons and armor.",
      "**Fighters** may wear any armor and use any weapon.",
    ],
    restrictions: [],
  },
};
