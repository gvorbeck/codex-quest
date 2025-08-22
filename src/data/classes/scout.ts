import type { Class } from "@/types/character";
import { CHARACTER_CLASSES } from "@/constants/gameData";

export const scout: Class = {
  name: "Scout",
  id: CHARACTER_CLASSES.SCOUT,
  description:
    "Scouts are a subclass of Thief who have been toughened by self-sufficiency and isolation from the supplies and comforts of civilized lands. They have the same attack bonus and saving throws as Thieves but use a d6 for hit dice and advance at the same rate as Clerics.",
  hitDie: "1d6",
  primaryAttribute: "dexterity",
  abilityRequirements: [
    {
      ability: "dexterity",
      min: 9,
    },
  ],
  allowedWeapons: [],
  allowedArmor: [],
  specialAbilities: [
    {
      name: "Move Silently",
      description:
        "Scouts can Move Silently, with percentages based on level.",
    },
    {
      name: "Hide",
      description:
        "Scouts can Hide, with percentages based on level.",
    },
    {
      name: "Listen",
      description:
        "Scouts can Listen for sounds, with percentages based on level.",
    },
    {
      name: "Open Locks",
      description:
        "Scouts can Open Locks, with percentages based on level.",
    },
    {
      name: "Detect Traps",
      description:
        "Scouts can Detect Traps, with percentages based on level.",
    },
    {
      name: "Climb Walls",
      description:
        "Scouts can Climb Walls, with percentages based on level.",
    },
    {
      name: "Track",
      description:
        "Scouts can track creatures. When tracking, the Scout must roll once per hour traveled or lose the trail.",
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