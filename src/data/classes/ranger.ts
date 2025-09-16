import type { Class } from "@/types";
import { CHARACTER_CLASSES } from "@/constants";

export const ranger: Class = {
  name: "Ranger",
  id: CHARACTER_CLASSES.RANGER,
  classType: CHARACTER_CLASSES.THIEF,
  description:
    "Rangers are specialized warriors who roam the borderlands, where their mission is to keep the beasts and monsters of the untamed lands at bay. They generally operate alone or in small groups, and rely on stealth and surprise to meet their objectives. Rangers are a subclass of Fighter.",
  hitDie: "1d8",
  primaryAttribute: "strength",
  abilityRequirements: [
    {
      ability: "strength",
      min: 9,
    },
    {
      ability: "wisdom",
      min: 11,
    },
    {
      ability: "dexterity",
      min: 11,
    },
  ],
  allowedWeapons: [],
  allowedArmor: [],
  specialAbilities: [
    {
      name: "Move Silently",
      description:
        "Rangers can Move Silently in wilderness areas. Apply a -20% penalty when attempting this ability in urban areas. May not be used in armor heavier than leather.",
    },
    {
      name: "Hide",
      description:
        "Rangers can Hide in wilderness areas. Apply a -20% penalty when attempting this ability in urban areas. May not be used in armor heavier than leather.",
    },
    {
      name: "Tracking",
      description:
        "Rangers can track creatures in wilderness. When tracking, the Ranger must roll once per hour traveled or lose the trail.",
    },
    {
      name: "Chosen Enemy",
      description:
        "A Ranger must declare a chosen enemy. Against this chosen enemy, the Ranger gets a bonus of +3 to damage.",
    },
    {
      name: "Expert Bowmanship",
      description:
        "When using any regular bow (shortbow or longbow, but not crossbow), a Ranger adds +2 to his or her Attack Bonus. At 5th level, may fire three arrows every two rounds. At 9th level, may fire two arrows every round.",
    },
  ],
  experienceTable: {
    1: 0,
    2: 2200,
    3: 4400,
    4: 8800,
    5: 17600,
    6: 35200,
    7: 70400,
    8: 132000,
    9: 264000,
    10: 396000,
    11: 528000,
    12: 660000,
    13: 792000,
    14: 924000,
    15: 1056000,
    16: 1188000,
    17: 1320000,
    18: 1452000,
    19: 1584000,
    20: 1716000,
  },
  skills: {
    1: {
      moveSilently: 25,
      hide: 10,
      tracking: 40,
    },
    2: {
      moveSilently: 30,
      hide: 15,
      tracking: 44,
    },
    3: {
      moveSilently: 35,
      hide: 20,
      tracking: 48,
    },
    4: {
      moveSilently: 40,
      hide: 25,
      tracking: 52,
    },
    5: {
      moveSilently: 45,
      hide: 30,
      tracking: 56,
    },
    6: {
      moveSilently: 50,
      hide: 35,
      tracking: 60,
    },
    7: {
      moveSilently: 55,
      hide: 40,
      tracking: 64,
    },
    8: {
      moveSilently: 60,
      hide: 45,
      tracking: 68,
    },
    9: {
      moveSilently: 65,
      hide: 50,
      tracking: 72,
    },
    10: {
      moveSilently: 68,
      hide: 53,
      tracking: 75,
    },
    11: {
      moveSilently: 71,
      hide: 56,
      tracking: 78,
    },
    12: {
      moveSilently: 74,
      hide: 59,
      tracking: 81,
    },
    13: {
      moveSilently: 77,
      hide: 62,
      tracking: 84,
    },
    14: {
      moveSilently: 80,
      hide: 65,
      tracking: 87,
    },
    15: {
      moveSilently: 83,
      hide: 68,
      tracking: 90,
    },
    16: {
      moveSilently: 85,
      hide: 69,
      tracking: 91,
    },
    17: {
      moveSilently: 87,
      hide: 70,
      tracking: 92,
    },
    18: {
      moveSilently: 89,
      hide: 71,
      tracking: 93,
    },
    19: {
      moveSilently: 91,
      hide: 72,
      tracking: 94,
    },
    20: {
      moveSilently: 93,
      hide: 73,
      tracking: 95,
    },
  },
  supplementalContent: true,
};
