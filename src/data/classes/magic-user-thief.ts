import type { Class } from "@/types";
import { CHARACTER_CLASSES } from "@/constants";

/**
 * Magic-User/Thief Combination Class
 *
 * According to BFRPG rules (pg. 6):
 * - Only eligible to Elves (and implementation allows Dokkalfar, Half-elves, custom races)
 * - Can cast spells and use thief abilities
 * - May cast spells while wearing leather armor (unique ability)
 * - Uses d4 hit die
 * - Must gain experience equal to combined requirements of both base classes
 * - Uses best attack bonus and best saving throws from Magic-User and Thief
 * - Has full thief skills progression
 */
export const magicUserThief: Class = {
  name: "Magic-User/Thief",
  id: CHARACTER_CLASSES.MAGIC_USER_THIEF,
  classType: CHARACTER_CLASSES.MAGIC_USER, // Treated as magic-user type for spell mechanics
  description:
    "A rare combination class available only to Elves and similar races. Magic-User/Thieves blend arcane mastery with stealth and cunning. They can cast spells while wearing leather armor and possess all the skills of a Thief, making them versatile infiltrators and spellcasters.",
  hitDie: "1d4",
  primaryAttribute: "intelligence", // Magic-User's primary attribute takes precedence for XP bonus
  abilityRequirements: [
    {
      ability: "intelligence",
      min: 9,
    },
    {
      ability: "dexterity",
      min: 9,
    },
  ],
  allowedWeapons: ["dagger", "walking-staff"], // Magic-User restrictions
  allowedArmor: ["leather"], // Can wear leather armor (special ability)
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
        "A first level Magic-User/Thief begins play knowing read magic and one other spell of first level.",
    },
    {
      name: "Cast in Leather Armor",
      description:
        "Unlike pure Magic-Users, Magic-User/Thieves can cast spells while wearing leather armor without penalty.",
    },
    {
      name: "Sneak Attack",
      description:
        "Magic-User/Thieves can perform a Sneak Attack any time they are behind an opponent in melee and it is likely the opponent doesn't know the Thief is there. The Sneak Attack is made with a +4 attack bonus and does double damage if it is successful.",
    },
  ],
  // Combined XP requirements: Magic-User + Thief
  // Magic-User: 2500, Thief: 1250 = 3750 for level 2, etc.
  experienceTable: {
    1: 0,
    2: 3750, // Magic-User (2500) + Thief (1250)
    3: 7500, // Magic-User (5000) + Thief (2500)
    4: 15000, // Magic-User (10000) + Thief (5000)
    5: 30000, // Magic-User (20000) + Thief (10000)
    6: 60000, // Magic-User (40000) + Thief (20000)
    7: 120000, // Magic-User (80000) + Thief (40000)
    8: 225000, // Magic-User (150000) + Thief (75000)
    9: 450000, // Magic-User (300000) + Thief (150000)
    10: 675000, // Magic-User (450000) + Thief (225000)
    11: 900000, // Magic-User (600000) + Thief (300000)
    12: 1125000, // Magic-User (750000) + Thief (375000)
    13: 1350000, // Magic-User (900000) + Thief (450000)
    14: 1575000, // Magic-User (1050000) + Thief (525000)
    15: 1800000, // Magic-User (1200000) + Thief (600000)
    16: 2025000, // Magic-User (1350000) + Thief (675000)
    17: 2250000, // Magic-User (1500000) + Thief (750000)
    18: 2475000, // Magic-User (1650000) + Thief (825000)
    19: 2700000, // Magic-User (1800000) + Thief (900000)
    20: 2925000, // Magic-User (1950000) + Thief (975000)
  },
  // Full thief skills progression
  skills: {
    1: {
      openLocks: 25,
      removeTraps: 20,
      pickPockets: 30,
      moveSilently: 25,
      climbWalls: 80,
      hide: 10,
      listen: 30,
    },
    2: {
      openLocks: 30,
      removeTraps: 25,
      pickPockets: 35,
      moveSilently: 30,
      climbWalls: 81,
      hide: 15,
      listen: 34,
    },
    3: {
      openLocks: 35,
      removeTraps: 30,
      pickPockets: 40,
      moveSilently: 35,
      climbWalls: 82,
      hide: 20,
      listen: 38,
    },
    4: {
      openLocks: 40,
      removeTraps: 35,
      pickPockets: 45,
      moveSilently: 40,
      climbWalls: 83,
      hide: 25,
      listen: 42,
    },
    5: {
      openLocks: 45,
      removeTraps: 40,
      pickPockets: 50,
      moveSilently: 45,
      climbWalls: 84,
      hide: 30,
      listen: 46,
    },
    6: {
      openLocks: 50,
      removeTraps: 45,
      pickPockets: 55,
      moveSilently: 50,
      climbWalls: 85,
      hide: 35,
      listen: 50,
    },
    7: {
      openLocks: 55,
      removeTraps: 50,
      pickPockets: 60,
      moveSilently: 55,
      climbWalls: 86,
      hide: 40,
      listen: 54,
    },
    8: {
      openLocks: 60,
      removeTraps: 55,
      pickPockets: 65,
      moveSilently: 60,
      climbWalls: 87,
      hide: 45,
      listen: 58,
    },
    9: {
      openLocks: 65,
      removeTraps: 60,
      pickPockets: 70,
      moveSilently: 65,
      climbWalls: 88,
      hide: 50,
      listen: 62,
    },
    10: {
      openLocks: 68,
      removeTraps: 63,
      pickPockets: 74,
      moveSilently: 68,
      climbWalls: 89,
      hide: 53,
      listen: 65,
    },
    11: {
      openLocks: 71,
      removeTraps: 66,
      pickPockets: 78,
      moveSilently: 71,
      climbWalls: 90,
      hide: 56,
      listen: 68,
    },
    12: {
      openLocks: 74,
      removeTraps: 69,
      pickPockets: 82,
      moveSilently: 74,
      climbWalls: 91,
      hide: 59,
      listen: 71,
    },
    13: {
      openLocks: 77,
      removeTraps: 72,
      pickPockets: 86,
      moveSilently: 77,
      climbWalls: 92,
      hide: 62,
      listen: 74,
    },
    14: {
      openLocks: 80,
      removeTraps: 75,
      pickPockets: 90,
      moveSilently: 80,
      climbWalls: 93,
      hide: 65,
      listen: 77,
    },
    15: {
      openLocks: 83,
      removeTraps: 78,
      pickPockets: 94,
      moveSilently: 83,
      climbWalls: 94,
      hide: 68,
      listen: 80,
    },
    16: {
      openLocks: 84,
      removeTraps: 79,
      pickPockets: 95,
      moveSilently: 85,
      climbWalls: 95,
      hide: 69,
      listen: 83,
    },
    17: {
      openLocks: 85,
      removeTraps: 80,
      pickPockets: 96,
      moveSilently: 87,
      climbWalls: 96,
      hide: 70,
      listen: 86,
    },
    18: {
      openLocks: 86,
      removeTraps: 81,
      pickPockets: 97,
      moveSilently: 89,
      climbWalls: 97,
      hide: 71,
      listen: 89,
    },
    19: {
      openLocks: 87,
      removeTraps: 82,
      pickPockets: 98,
      moveSilently: 91,
      climbWalls: 98,
      hide: 72,
      listen: 92,
    },
    20: {
      openLocks: 88,
      removeTraps: 83,
      pickPockets: 99,
      moveSilently: 93,
      climbWalls: 99,
      hide: 73,
      listen: 95,
    },
  },
  supplementalContent: false, // Core BFRPG combination class
};
