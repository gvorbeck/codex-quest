import { DiceTypes, EquipmentItem } from "../definitions";
import { EquipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";
import equipmentItems from "../equipmentItems.json";

export const cleric: ClassSetup = {
  name: "Cleric",
  minimumAbilityRequirements: { wisdom: 9 },
  hitDice: DiceTypes.D6,
  hitDiceModifier: 1,
  availableEquipmentCategories: [
    EquipmentCategories.AMMUNITION,
    EquipmentCategories.ARMOR,
    EquipmentCategories.SHIELDS,
    EquipmentCategories.BOWS,
    EquipmentCategories.BEASTS,
    EquipmentCategories.BARDING,
    EquipmentCategories.HAMMERMACE,
    EquipmentCategories.GENERAL,
    EquipmentCategories.OTHERWEAPONS,
    EquipmentCategories.CHAINFLAIL,
    EquipmentCategories.IMPROVISED,
    EquipmentCategories.SLINGHURLED,
  ],
  specificEquipmentItems: [
    [
      EquipmentCategories.HAMMERMACE,
      EquipmentCategories.OTHERWEAPONS,
      EquipmentCategories.AMMUNITION,
      EquipmentCategories.BOWS,
      EquipmentCategories.SLINGHURLED,
    ],
    [
      "warhammer",
      "mace",
      "maul",
      "crossbow",
      "morningstar",
      "quaterstaff",
      "sling",
      "stone",
      "club",
      "bullet",
      "quarrel",
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
  startingEquipment: [
    equipmentItems.find((item) =>
      item.name.toLowerCase().startsWith("holy symbol"),
    )! as EquipmentItem,
  ],
  powers: [
    {
      name: "Turn Undead",
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
      "Clerics are those who have devoted themselves to the service of a deity, pantheon or other belief system. Most Clerics spend their time in mundane forms of service such as preaching and ministering in a temple; but there are those who are called to go abroad from the temple and serve their deity in a more direct way, smiting undead monsters and aiding in the battle against evil and chaos. Player character Clerics are assumed to be among the latter group.\n\nClerics fight about as well as Thieves, but not as well as Fighters. They are hardier than Thieves, at least at lower levels, as they are accustomed to physical labor that the Thief would deftly avoid. Clerics can cast spells of divine nature starting at 2nd level, and they have the power to Turn the Undead, that is, to drive away undead monsters by means of faith alone (refer to page 57 in the Encounter section for details).\n\nThe Prime Requisite for Clerics is Wisdom; a character must have a Wisdom score of 9 or higher to become a Cleric. They may wear any armor, but may only use blunt weapons (specifically including warhammer, mace, maul, club, quarterstaff, and sling).",
    specials: [
      "**Clerics** can cast spells of divine nature starting at 2nd level.",
      "**Clerics** have the power to Turn the Undead.",
    ],
    restrictions: [
      "**Clerics** may wear any armor, but may only use blunt weapons (specifically including warhammer, mace, maul, club, quarterstaff, and sling).",
    ],
  },
};
