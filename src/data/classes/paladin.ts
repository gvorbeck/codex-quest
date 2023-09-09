import { DiceTypes } from "../../components/definitions";
import { equipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";

export const paladin: ClassSetup = {
  name: "Paladin",
  minimumAbilityRequirements: {
    strength: 9,
    wisdom: 11,
    charisma: 11,
  },
  hitDice: DiceTypes.D8,
  hitDiceModifier: 2,
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
  experiencePoints: [
    0, 2500, 5000, 10000, 20000, 40000, 80000, 150000, 300000, 450000, 600000,
    750000, 900000, 1050000, 1200000, 1350000, 1500000, 1650000, 1800000,
    1950000,
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
};
