import type { Class } from "@/types";
import { CHARACTER_CLASSES } from "@/constants";

export const druid: Class = {
  name: "Druid",
  id: CHARACTER_CLASSES.DRUID,
  classType: CHARACTER_CLASSES.CLERIC,
  description:
    "Druids are nature priests, revering the gods of the natural world. They advance at the same rate as Clerics, and they use the same combat and saving throw tables. Druids can cast spells of divine nature starting at 2nd level, and they have the power of Animal Affinity, working much like the Clerical ability to Turn Undead.",
  hitDie: "1d6",
  primaryAttribute: "wisdom",
  abilityRequirements: [
    {
      ability: "wisdom",
      min: 9,
    },
  ],
  allowedWeapons: ["dagger", "walking-staff", "sling", "shortbow"],
  allowedArmor: ["leather", "padded"],
  spellcasting: {
    spellsPerLevel: {
      2: [1],
      3: [2],
      4: [2, 1],
      5: [2, 2],
      6: [2, 2, 1],
      7: [3, 2, 2],
      8: [3, 2, 2, 1],
      9: [3, 3, 2, 2],
      10: [3, 3, 2, 2, 1],
      11: [4, 3, 3, 2, 2],
      12: [4, 4, 3, 2, 2, 1],
      13: [4, 4, 3, 3, 2, 2],
      14: [4, 4, 4, 3, 2, 2],
      15: [4, 4, 4, 3, 3, 2],
      16: [5, 4, 4, 3, 3, 2],
      17: [5, 5, 4, 3, 3, 2],
      18: [5, 5, 4, 4, 3, 3],
      19: [5, 5, 5, 4, 3, 3],
      20: [5, 5, 5, 4, 4, 3],
    },
  },
  specialAbilities: [
    {
      name: "Animal Affinity",
      description:
        "The ability to calm or befriend normal animals. The Druid attempts to communicate a benign intent, and through his or her connection to the natural world the animals affected may be either calmed or befriended.",
    },
    {
      name: "Natural Knowledge",
      description:
        "Druids can identify any natural animal or plant, and can identify clean water.",
    },
    {
      name: "Armor Restriction",
      description:
        "Druids may not utilize metal armor of any type, and they are likewise limited to wooden shields.",
    },
  ],
  experienceTable: {
    1: 0,
    2: 1500,
    3: 3000,
    4: 6000,
    5: 12000,
    6: 24000,
    7: 48000,
    8: 90000,
    9: 180000,
    10: 270000,
    11: 360000,
    12: 450000,
    13: 540000,
    14: 630000,
    15: 720000,
    16: 810000,
    17: 900000,
    18: 990000,
    19: 1080000,
    20: 1170000,
  },
  supplementalContent: true,
};
