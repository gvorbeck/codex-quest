import type { Class } from "@/types/character";
import { CHARACTER_CLASSES } from "@/constants/gameData";

export const necromancer: Class = {
  name: "Necromancer",
  id: CHARACTER_CLASSES.NECROMANCER,
  classType: CHARACTER_CLASSES.MAGIC_USER,
  description:
    "Necromancers are Magic-Users who practice necromancy, seeking expertise of the darker side of the arcane. They are rare due to the unsavory nature of their profession, often living in proximity to graveyards, burial mounds, and other places associated with the dead.",
  hitDie: "1d4",
  primaryAttribute: "intelligence",
  abilityRequirements: [
    {
      ability: "intelligence",
      min: 11,
    },
    {
      ability: "wisdom",
      min: 9,
    },
  ],
  allowedWeapons: ["dagger", "walking-staff", "sickle", "spade", "scimitar", "scythe"],
  allowedArmor: ["none"],
  spellcasting: {
    spellsPerLevel: {
      1: [1],
      2: [2],
      3: [2, 1],
      4: [2, 2],
      5: [2, 2, 1],
      6: [3, 2, 2],
      7: [3, 2, 2, 1],
      8: [3, 3, 2, 2],
      9: [3, 3, 2, 2, 1],
      10: [4, 3, 3, 2, 2],
      11: [4, 4, 3, 2, 2, 1],
      12: [4, 4, 3, 3, 2, 2],
      13: [4, 4, 4, 3, 2, 2],
      14: [4, 4, 4, 3, 3, 2],
      15: [5, 4, 4, 3, 3, 2],
      16: [5, 5, 4, 3, 3, 2],
      17: [5, 5, 4, 4, 3, 3],
      18: [6, 5, 4, 4, 3, 3],
      19: [6, 5, 5, 4, 3, 3],
      20: [6, 5, 5, 4, 4, 3],
    },
  },
  specialAbilities: [
    {
      name: "Read Magic",
      description:
        "A first level Necromancer begins play knowing read magic and one other spell of first level.",
    },
    {
      name: "Expanded Weapon Selection",
      description:
        "In addition to the dagger and walking staff, Necromancers can use sickles, scythes, spades, and scimitars.",
    },
  ],
  experienceTable: {
    1: 0,
    2: 2500,
    3: 5000,
    4: 10000,
    5: 20000,
    6: 40000,
    7: 80000,
    8: 150000,
    9: 300000,
    10: 450000,
    11: 600000,
    12: 750000,
    13: 900000,
    14: 1050000,
    15: 1200000,
    16: 1350000,
    17: 1500000,
    18: 1650000,
    19: 1800000,
    20: 1950000,
  },
  supplementalContent: true,
};