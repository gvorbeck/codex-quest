import {
  EquipmentLimitsSvg,
  NatureSvg,
  WeaponLimitsSvg,
} from "@/support/svgSupport";
import { DiceTypes } from "../definitions";
import { EquipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";
import { iconStrings } from "@/support/stringSupport";

export const druid: ClassSetup = {
  name: "Druid",
  minimumAbilityRequirements: { wisdom: 9 },
  hitDice: DiceTypes.D6,
  hitDiceModifier: 1,
  availableEquipmentCategories: [
    EquipmentCategories.AMMUNITION,
    EquipmentCategories.ARMOR,
    EquipmentCategories.SHIELDS,
    EquipmentCategories.AXES,
    EquipmentCategories.BOWS,
    EquipmentCategories.BEASTS,
    EquipmentCategories.BARDING,
    EquipmentCategories.DAGGERS,
    EquipmentCategories.HAMMERMACE,
    EquipmentCategories.GENERAL,
    EquipmentCategories.OTHERWEAPONS,
    EquipmentCategories.CHAINFLAIL,
    EquipmentCategories.SLINGHURLED,
    EquipmentCategories.SWORDS,
  ],
  specificEquipmentItems: [
    [
      EquipmentCategories.BOWS,
      EquipmentCategories.ARMOR,
      EquipmentCategories.SHIELDS,
      EquipmentCategories.CHAINFLAIL,
      EquipmentCategories.AXES,
      EquipmentCategories.HAMMERMACE,
      EquipmentCategories.OTHERWEAPONS,
      EquipmentCategories.SLINGHURLED,
      EquipmentCategories.SWORDS,
      EquipmentCategories.AMMUNITION,
    ],
    [
      "shortbow",
      "padded",
      "hide",
      "leather",
      "buckler",
      "chain††",
      "flail",
      "whip",
      "hand axe",
      "mattock",
      "pickaxe",
      "mace",
      "morningstar",
      "light mace",
      "staff",
      "sling",
      "stone",
      "shortsword",
      "longsword",
    ],
  ],
  experiencePoints: [
    0, 1500, 3000, 6000, 12000, 24000, 48000, 90000, 180000, 270000, 360000,
    450000, 540000, 630000, 720000, 810000, 900000, 990000, 1080000, 1170000,
  ],
  attackBonus: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
  savingThrows: [
    [
      1,
      {
        deathRayOrPoison: 11,
        magicWands: 12,
        paralysisOrPetrify: 14,
        dragonBreath: 16,
        spells: 15,
      },
    ],
    [
      3,
      {
        deathRayOrPoison: 10,
        magicWands: 11,
        paralysisOrPetrify: 13,
        dragonBreath: 15,
        spells: 14,
      },
    ],
    [
      5,
      {
        deathRayOrPoison: 9,
        magicWands: 10,
        paralysisOrPetrify: 13,
        dragonBreath: 15,
        spells: 14,
      },
    ],
    [
      7,
      {
        deathRayOrPoison: 9,
        magicWands: 10,
        paralysisOrPetrify: 12,
        dragonBreath: 14,
        spells: 13,
      },
    ],
    [
      9,
      {
        deathRayOrPoison: 8,
        magicWands: 9,
        paralysisOrPetrify: 12,
        dragonBreath: 14,
        spells: 13,
      },
    ],
    [
      11,
      {
        deathRayOrPoison: 8,
        magicWands: 9,
        paralysisOrPetrify: 11,
        dragonBreath: 13,
        spells: 12,
      },
    ],
    [
      13,
      {
        deathRayOrPoison: 7,
        magicWands: 8,
        paralysisOrPetrify: 11,
        dragonBreath: 13,
        spells: 12,
      },
    ],
    [
      15,
      {
        deathRayOrPoison: 7,
        magicWands: 8,
        paralysisOrPetrify: 10,
        dragonBreath: 12,
        spells: 11,
      },
    ],
    [
      17,
      {
        deathRayOrPoison: 6,
        magicWands: 7,
        paralysisOrPetrify: 10,
        dragonBreath: 12,
        spells: 11,
      },
    ],
    [
      19,
      {
        deathRayOrPoison: 6,
        magicWands: 7,
        paralysisOrPetrify: 9,
        dragonBreath: 11,
        spells: 10,
      },
    ],
    [
      20,
      {
        deathRayOrPoison: 5,
        magicWands: 6,
        paralysisOrPetrify: 9,
        dragonBreath: 11,
        spells: 10,
      },
    ],
  ],
  spellBudget: [
    [0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0],
    [2, 1, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0],
    [2, 2, 1, 0, 0, 0],
    [3, 2, 2, 0, 0, 0],
    [3, 2, 2, 1, 0, 0],
    [3, 3, 2, 2, 0, 0],
    [3, 3, 2, 2, 1, 0],
    [4, 3, 3, 2, 2, 0],
    [4, 4, 3, 2, 2, 1],
    [4, 4, 3, 3, 2, 2],
    [4, 4, 4, 3, 2, 2],
    [4, 4, 4, 3, 3, 2],
    [5, 4, 4, 3, 3, 2],
    [5, 5, 4, 3, 3, 2],
    [5, 5, 4, 4, 3, 3],
    [6, 5, 4, 4, 3, 3],
    [6, 5, 5, 4, 3, 3],
  ],
  powers: [
    {
      name: "Animal Affinity",
      costValue: 0,
      costCurrency: "gp",
      category: "weapons",
      damage: "2d6",
      amount: 1,
      type: "power",
      noDelete: true,
    },
  ],
  details: {
    description:
      "(Druids Release 12)\n\nDruids are nature priests, revering the gods of the natural world. Often a Druid uses mistletoe as a holy symbol, but this can vary with specific nature deities. Druids spend their time contemplating nature or in mundane forms of service such as ministering in rural areas. However, there are those who are called to go abroad to serve the natural order in a more direct way by working actively to restore balance.\n\nDruids advance at the same rate as Clerics, and they use the same combat and saving throw tables. Druids can cast spells of divine nature starting at 2nd level, and they have the power of Animal Affinity (detailed at the end), working much like the Clerical ability to Turn Undead. They can identify any natural animal or plant, and can identify clean water.\n\nThe Prime Requisite for Druid is Wisdom; a character must have a Wisdom score of 9 or higher to become a Druid. Druids may not utilize metal armor of any type, and they are likewise limited to wooden shields. Druids utilize any one-handed melee weapon, as well as staff, sling, and shortbow.",
    specials: [
      "**Druids** can cast spells of divine nature starting at 2nd level.",
      "**Druids** have the power of **Animal Affinity**, working much like the Clerical ability to Turn Undead. They can identify any natural animal or plant, and can identify clean water.",
    ],
    restrictions: [
      "**Druids** may not utilize metal armor of any type, and they are likewise limited to wooden shields.",
      "**Druids** utilize any one-handed melee weapon, as well as staff, sling, and shortbow.",
    ],
  },
  icons: [
    [
      NatureSvg,
      iconStrings.nature(
        "Has Animal Affinity power. Can identify any natural animal or plant, and can identify clean water.",
      ),
    ],
    [
      EquipmentLimitsSvg,
      iconStrings.equipmentLimits("No metal armor or shields."),
    ],
    [
      WeaponLimitsSvg,
      iconStrings.weaponLimits(
        "One-handed melee weapons only, as well as staff, sling, and shortbow.",
      ),
    ],
  ],
};
