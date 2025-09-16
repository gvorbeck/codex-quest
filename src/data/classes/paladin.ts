import type { Class } from "@/types/character";
import { CHARACTER_CLASSES } from "@/constants";

export const paladin: Class = {
  name: "Paladin",
  id: CHARACTER_CLASSES.PALADIN,
  classType: CHARACTER_CLASSES.CLERIC,
  description:
    "Paladins are holy warriors dedicated to their faith and to justice. They are a subclass of Fighter with the same attack bonus and saving throws as Fighters of the same level, but they gain divine spellcasting abilities at higher levels and have special powers to combat evil.",
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
      ability: "charisma",
      min: 11,
    },
  ],
  allowedWeapons: [],
  allowedArmor: [],
  spellcasting: {
    spellsPerLevel: {
      10: [1],
      11: [2],
      12: [2, 1],
      13: [2, 2],
      14: [3, 2],
      15: [3, 3],
      16: [4, 3],
      17: [4, 4],
      18: [5, 4],
      19: [5, 5],
      20: [6, 5],
    },
  },
  specialAbilities: [
    {
      name: "Aura of Protection",
      description:
        "Paladins emanate an aura equivalent to the spell protection from evil in a 10' radius.",
    },
    {
      name: "Detect Evil",
      description:
        "The Paladin can detect evil at will, as the spell.",
    },
    {
      name: "Magic Weapon",
      description:
        "Once per day, per level, a Paladin can make his or her non-magical melee weapon equivalent to a magic weapon for purposes of hitting creatures only able to be struck with a silver or magical weapon. This effect lasts for a turn.",
    },
    {
      name: "Lay on Hands",
      description:
        "Once per day, the paladin can Lay on Hands to heal 2 points of damage plus Charisma bonus. On each odd-numbered level, the Paladin may do this one additional time per day. Starting at 7th level, the Paladin may choose to cure disease instead. At 11th level, the Paladin may also substitute neutralize poison.",
    },
    {
      name: "Turn Undead",
      description:
        "A Paladin can Turn undead as if a Cleric of a level equal to half his or her own, rounded down, starting at 2nd level.",
    },
    {
      name: "Tithing",
      description:
        "A Paladin must tithe, giving a minimum of 10% of all treasures gained or other profits as an offering to his or her deity.",
    },
    {
      name: "Code of Honor",
      description:
        "A Paladin must obey a code of honor and perform duties assigned by his or her deity. If the code is broken, all powers are taken away until atonement is made.",
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