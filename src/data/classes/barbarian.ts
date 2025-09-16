import type { Class } from "@/types";
import { CHARACTER_CLASSES } from "@/constants";

export const barbarian: Class = {
  name: "Barbarian",
  id: CHARACTER_CLASSES.BARBARIAN,
  classType: CHARACTER_CLASSES.FIGHTER,
  description:
    "Barbarians are warriors born in savage lands, far from the mollifying comforts of civilization. They rely on hardiness, stealth, and foolhardy bravery to beat their enemies. They are a subclass of Fighter and have the same attack bonus and saving throws as Fighters of the same level.",
  hitDie: "1d10",
  primaryAttribute: "strength",
  abilityRequirements: [
    {
      ability: "strength",
      min: 9,
    },
    {
      ability: "dexterity",
      min: 9,
    },
    {
      ability: "constitution",
      min: 9,
    },
  ],
  allowedWeapons: [],
  allowedArmor: [],
  specialAbilities: [
    {
      name: "Alertness",
      description:
        "Only a Thief one or more levels higher than the Barbarian can use their Backstab ability on the Barbarian. This ability requires wearing no armor or at most leather armor.",
    },
    {
      name: "Animal Reflexes",
      description:
        "The Barbarian can be surprised only on a roll of 1 on 1d6. This ability requires wearing no armor or at most leather armor.",
    },
    {
      name: "Hunter",
      description:
        "In the wilderness Barbarians can surprise enemies on a roll of 1-3 on 1d6. This ability requires wearing no armor or at most leather armor.",
    },
    {
      name: "Runner",
      description:
        "The Barbarian adds 5 feet to their tactical movement. This ability requires wearing no armor or at most leather armor.",
    },
    {
      name: "Rage",
      description:
        "Once per day a Barbarian can fly into a Rage, which lasts ten rounds. While raging, the character gains a +2 bonus on attack rolls, damage rolls, and saving throws versus mind-altering spells, but suffers a penalty of -2 to armor class. The Barbarian must charge directly into combat. After the rage, the Barbarian becomes fatigued for one hour. At 6th level, this ability can be used twice per day, and three times per day at 12th level.",
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
