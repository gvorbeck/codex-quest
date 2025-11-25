import type { Class } from "@/types";
import { CHARACTER_CLASSES } from "@/constants";

/**
 * Fighter/Magic-User Combination Class
 *
 * According to BFRPG rules (pg. 6):
 * - Only eligible to Elves (and implementation allows Dokkalfar, Half-elves, custom races)
 * - Can both fight and cast magic spells
 * - Allowed to cast magic spells while wearing armor (unique ability)
 * - Uses d6 hit die
 * - Must gain experience equal to combined requirements of both base classes
 * - Uses best attack bonus and best saving throws from Fighter and Magic-User
 */
export const fighterMagicUser: Class = {
  name: "Fighter/Magic-User",
  id: CHARACTER_CLASSES.FIGHTER_MAGIC_USER,
  classType: CHARACTER_CLASSES.MAGIC_USER, // Treated as magic-user type for spell mechanics
  description:
    "A rare combination class available only to Elves and similar races. Fighter/Magic-Users are versatile warriors who can both fight in melee and cast arcane spells. Uniquely, they can cast magic spells while wearing armor, making them formidable opponents on the battlefield.",
  hitDie: "1d6",
  primaryAttribute: "intelligence", // Magic-User's primary attribute takes precedence for XP bonus
  abilityRequirements: [
    {
      ability: "strength",
      min: 9,
    },
    {
      ability: "intelligence",
      min: 9,
    },
  ],
  allowedWeapons: [], // Can use all weapons (Fighter)
  allowedArmor: [], // Can use all armor (Fighter)
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
        "A first level Fighter/Magic-User begins play knowing read magic and one other spell of first level.",
    },
    {
      name: "Cast in Armor",
      description:
        "Unlike pure Magic-Users, Fighter/Magic-Users can cast spells while wearing any type of armor without penalty.",
    },
  ],
  // Combined XP requirements: Fighter + Magic-User
  // Fighter: 2000, Magic-User: 2500 = 4500 for level 2, etc.
  experienceTable: {
    1: 0,
    2: 4500, // Fighter (2000) + Magic-User (2500)
    3: 9000, // Fighter (4000) + Magic-User (5000)
    4: 18000, // Fighter (8000) + Magic-User (10000)
    5: 36000, // Fighter (16000) + Magic-User (20000)
    6: 72000, // Fighter (32000) + Magic-User (40000)
    7: 144000, // Fighter (64000) + Magic-User (80000)
    8: 270000, // Fighter (120000) + Magic-User (150000)
    9: 540000, // Fighter (240000) + Magic-User (300000)
    10: 810000, // Fighter (360000) + Magic-User (450000)
    11: 1080000, // Fighter (480000) + Magic-User (600000)
    12: 1350000, // Fighter (600000) + Magic-User (750000)
    13: 1620000, // Fighter (720000) + Magic-User (900000)
    14: 1890000, // Fighter (840000) + Magic-User (1050000)
    15: 2160000, // Fighter (960000) + Magic-User (1200000)
    16: 2430000, // Fighter (1080000) + Magic-User (1350000)
    17: 2700000, // Fighter (1200000) + Magic-User (1500000)
    18: 2970000, // Fighter (1320000) + Magic-User (1650000)
    19: 3240000, // Fighter (1440000) + Magic-User (1800000)
    20: 3510000, // Fighter (1560000) + Magic-User (1950000)
  },
  supplementalContent: false, // Core BFRPG combination class
};
