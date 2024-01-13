import { DiceTypes, EquipmentItem } from "../definitions";
import { EquipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";
import equipmentItems from "../equipmentItems.json";

export const magicUser: ClassSetup = {
  name: "Magic-User",
  minimumAbilityRequirements: { intelligence: 9 },
  hitDice: DiceTypes.D4,
  hitDiceModifier: 1,
  availableEquipmentCategories: [
    EquipmentCategories.DAGGERS,
    EquipmentCategories.GENERAL,
    EquipmentCategories.OTHERWEAPONS,
    EquipmentCategories.BEASTS,
    EquipmentCategories.BARDING,
    EquipmentCategories.IMPROVISED,
  ],
  specificEquipmentItems: [[EquipmentCategories.OTHERWEAPONS], ["cudgel"]],
  experiencePoints: [
    0, 2500, 5000, 10000, 20000, 40000, 80000, 150000, 300000, 450000, 600000,
    750000, 900000, 1050000, 1200000, 1350000, 1500000, 1650000, 1800000,
    1950000,
  ],
  attackBonus: [0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7],
  savingThrows: [
    [
      1,
      {
        deathRayOrPoison: 13,
        magicWands: 14,
        paralysisOrPetrify: 13,
        dragonBreath: 16,
        spells: 15,
      },
    ],
    [
      3,
      {
        deathRayOrPoison: 13,
        magicWands: 14,
        paralysisOrPetrify: 13,
        dragonBreath: 15,
        spells: 14,
      },
    ],
    [
      5,
      {
        deathRayOrPoison: 12,
        magicWands: 13,
        paralysisOrPetrify: 12,
        dragonBreath: 15,
        spells: 13,
      },
    ],
    [
      7,
      {
        deathRayOrPoison: 12,
        magicWands: 12,
        paralysisOrPetrify: 11,
        dragonBreath: 14,
        spells: 13,
      },
    ],
    [
      9,
      {
        deathRayOrPoison: 11,
        magicWands: 11,
        paralysisOrPetrify: 10,
        dragonBreath: 14,
        spells: 12,
      },
    ],
    [
      11,
      {
        deathRayOrPoison: 11,
        magicWands: 10,
        paralysisOrPetrify: 9,
        dragonBreath: 13,
        spells: 11,
      },
    ],
    [
      13,
      {
        deathRayOrPoison: 10,
        magicWands: 10,
        paralysisOrPetrify: 9,
        dragonBreath: 13,
        spells: 11,
      },
    ],
    [
      15,
      {
        deathRayOrPoison: 10,
        magicWands: 9,
        paralysisOrPetrify: 8,
        dragonBreath: 12,
        spells: 10,
      },
    ],
    [
      17,
      {
        deathRayOrPoison: 9,
        magicWands: 8,
        paralysisOrPetrify: 7,
        dragonBreath: 12,
        spells: 9,
      },
    ],
    [
      19,
      {
        deathRayOrPoison: 9,
        magicWands: 7,
        paralysisOrPetrify: 6,
        dragonBreath: 11,
        spells: 9,
      },
    ],
    [
      20,
      {
        deathRayOrPoison: 8,
        magicWands: 6,
        paralysisOrPetrify: 5,
        dragonBreath: 11,
        spells: 8,
      },
    ],
  ],
  spellBudget: [
    [2, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0],
    [3, 1, 0, 0, 0, 0],
    [3, 2, 0, 0, 0, 0],
    [3, 2, 1, 0, 0, 0],
    [4, 2, 2, 0, 0, 0],
    [4, 2, 2, 1, 0, 0],
    [4, 3, 2, 2, 0, 0],
    [4, 3, 2, 2, 1, 0],
    [5, 3, 3, 2, 2, 0],
    [5, 4, 3, 2, 2, 1],
    [5, 4, 3, 3, 2, 2],
    [5, 4, 4, 3, 2, 2],
    [5, 4, 4, 3, 3, 2],
    [6, 4, 4, 3, 3, 2],
    [6, 5, 4, 3, 3, 2],
    [6, 5, 4, 4, 3, 3],
    [7, 5, 4, 4, 3, 3],
    [7, 5, 5, 4, 3, 3],
    [7, 5, 5, 4, 4, 3],
  ],
  startingSpells: ["Read Magic"],
  startingEquipment: [
    equipmentItems.find((item) =>
      item.name.toLowerCase().startsWith("spellbook"),
    )! as EquipmentItem,
  ],
  details: {
    description:
      "Magic-Users are those who seek and use knowledge of the arcane. They do magic not as the Cleric does, by faith in a greater power, but rather through insight and understanding.\n\nMagic-Users are the worst of all the classes at fighting; hours spent studying massive tomes of magic do not lead a character to become strong or adept with weapons. They are the least hardy, equal to Thieves at lower levels but quickly falling behind.\n\nThe Prime Requisite for Magic-Users is Intelligence; a character must have an Intelligence score of 9 or higher to become a Magic-User. The only weapons they become proficient with are the dagger and the walking staff (or cudgel). Magic-Users may not wear armor of any sort nor use a shield as such things interfere with spellcasting.\n\nA first level Magic-User begins play knowing read magic and one other spell of first level. These spells are written in a spellbook provided by their master. The GM may roll for the spell, assign it as they see fit, or allow the player to choose it, at their option. See the Spells section for more details.",
    specials: [
      "**Magic-Users** begins play knowing Read Magic and one other spell of first level.",
    ],
    restrictions: [
      "The only weapons **Magic-Users** become proficient with are the dagger and the walking staff (or cudgel).",
      "**Magic-Users** may not wear armor of any sort nor use a shield as such things interfere with spellcasting.",
    ],
  },
};
