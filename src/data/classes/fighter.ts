import type { Class } from "@/types/character";

export const fighter: Class = {
  name: "Fighter",
  id: "fighter",
  description:
    "Fighters include soldiers, guardsmen, barbarian warriors, and anyone else for whom fighting is a way of life. They train in combat, and they generally approach problems head-on, weapon in hand.",
  hitDie: "1d8",
  primaryAttribute: "strength",
  abilityRequirements: [
    {
      ability: "strength",
      min: 9,
    },
  ],
  allowedWeapons: ["any"],
  allowedArmor: ["any"],
  specialAbilities: [],
  experienceTable: {
    1: 0,
    2: 2000,
    3: 4000,
    4: 8000,
    5: 16000,
    6: 32000,
    7: 64000,
    8: 120000,
    9: 240000,
    10: 360000,
    11: 480000,
    12: 600000,
    13: 720000,
    14: 840000,
    15: 960000,
    16: 1080000,
    17: 1200000,
    18: 1320000,
    19: 1440000,
    20: 1560000,
  },
  supplementalContent: false,
};
