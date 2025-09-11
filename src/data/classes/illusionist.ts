import type { Class } from "@/types/character";
import { CHARACTER_CLASSES } from "@/constants/gameData";

export const illusionist: Class = {
  name: "Illusionist",
  id: CHARACTER_CLASSES.ILLUSIONIST,
  classType: CHARACTER_CLASSES.MAGIC_USER,
  description:
    "Illusionists are specialist Magic-Users who focus on the creation and manipulation of illusions, whether visual, auditory, or mental, and at higher levels quasi-real things made of tangible shadow. Though normal Magic-Users can create illusions, those created by a true Illusionist are superior in quality and realism.",
  hitDie: "1d4",
  primaryAttribute: "intelligence",
  abilityRequirements: [
    {
      ability: "intelligence",
      min: 13,
    },
  ],
  allowedWeapons: ["dagger", "walking-staff"],
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
        "A first level Illusionist begins play knowing read magic and one other spell of first level.",
    },
    {
      name: "Illusion Resistance",
      description:
        "Illusionists always gain an additional +2 on saves vs. any sort of illusion or phantasm.",
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
