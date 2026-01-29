/**
 * Game Rules & Mechanics Constants
 * Basic Fantasy Role-Playing Game rules, character progression, and game mechanics
 */

// Character Classes
export const CHARACTER_CLASSES = {
  MAGIC_USER: "magic-user",
  FIGHTER: "fighter",
  CLERIC: "cleric",
  THIEF: "thief",
  ASSASSIN: "assassin",
  BARBARIAN: "barbarian",
  DRUID: "druid",
  ILLUSIONIST: "illusionist",
  NECROMANCER: "necromancer",
  RANGER: "ranger",
  PALADIN: "paladin",
  SCOUT: "scout",
  SPELLCRAFTER: "spellcrafter",
  FIGHTER_MAGIC_USER: "fighter-magic-user",
  MAGIC_USER_THIEF: "magic-user-thief",
} as const;

// Combination class definitions
export const COMBINATION_CLASSES = [
  {
    id: CHARACTER_CLASSES.FIGHTER_MAGIC_USER,
    name: "Fighter/Magic-User",
    description: "Combines martial prowess with arcane magic. Can cast spells while wearing armor.",
    baseClasses: ["Fighter", "Magic-User"],
  },
  {
    id: CHARACTER_CLASSES.MAGIC_USER_THIEF,
    name: "Magic-User/Thief",
    description: "Blends arcane mastery with stealth and cunning. Can cast spells while wearing leather armor.",
    baseClasses: ["Magic-User", "Thief"],
  },
] as const;

// Combination class IDs for programmatic checks (derived from COMBINATION_CLASSES)
export const COMBINATION_CLASS_IDS = COMBINATION_CLASSES.map((c) => c.id) as readonly string[];

// Equipment Categories
export const EQUIPMENT_CATEGORIES = {
  GENERAL: "general-equipment",
  SWORDS: "swords",
  AXES: "axes",
  BOWS: "bows",
  DAGGERS: "daggers",
  HAMMERS_AND_MACES: "hammers-and-maces",
  CHAIN_AND_FLAIL: "chain-and-flail",
  SPEARS_AND_POLEARMS: "spears-and-polearms",
  SLINGS_AND_HURLED_WEAPONS: "slings-and-hurled-weapons",
  OTHER_WEAPONS: "other-weapons",
  IMPROVISED_WEAPONS: "improvised-weapons",
  BEASTS_OF_BURDEN: "beasts-of-burden",
  BARDING: "barding",
} as const;

// Currency System (Official BFRPG conversion rates)
export const CURRENCY_TO_COPPER_RATES = {
  platinum: 500, // 1 pp = 5 gp = 50 sp = 500 cp
  gold: 100, // 1 gp = 10 sp = 100 cp
  electrum: 50, // 1 ep = 5 sp = 50 cp
  silver: 10, // 1 sp = 10 cp
  copper: 1, // 1 cp = 1 cp
} as const;

export const CURRENCY_ORDER = [
  "platinum",
  "gold",
  "electrum",
  "silver",
  "copper",
] as const;

export const CURRENCY_TYPES = {
  PLATINUM: "pp",
  GOLD: "gp",
  ELECTRUM: "ep",
  SILVER: "sp",
  COPPER: "cp",
} as const;

// Level Up Mechanics
export const LEVEL_UP_CONSTANTS = {
  LEVEL_UP_PROCESSING_DELAY: 500,
  FIXED_HP_LEVEL_THRESHOLD: 9,
  // Classes that get +2 HP per level after 9th level
  TWO_HP_CLASSES: [
    "fighter",
    "thief",
    "magic-user-thief",
    "fighter-magic-user",
    "assassin",
    "barbarian",
    "ranger",
    "paladin",
    "scout",
  ] as const,
} as const;

// Skills System
export const ALL_SKILLS = {
  openLocks: "Open Locks",
  removeTraps: "Remove Traps",
  detectTraps: "Detect Traps",
  pickPockets: "Pick Pockets",
  moveSilently: "Move Silently",
  climbWalls: "Climb Walls",
  hide: "Hide",
  listen: "Listen",
  poison: "Poison",
  tracking: "Tracking",
} as const;

export const SKILL_DESCRIPTIONS = {
  openLocks:
    "Attempt to unlock doors, chests, and other locked mechanisms without the proper key.",
  removeTraps:
    "Detect and disarm mechanical traps on doors, chests, and other objects.",
  detectTraps:
    "Spot mechanical traps on doors, chests, and other objects before triggering them.",
  pickPockets: "Steal small items from others without being noticed.",
  moveSilently: "Move without making noise, useful for sneaking past enemies.",
  climbWalls: "Scale vertical surfaces like walls, cliffs, or buildings.",
  hide: "Conceal yourself in shadows or behind cover to avoid detection.",
  listen: "Detect sounds through doors or walls, overhear conversations.",
  poison:
    "Create and use lethal poisons for weapons and assassination attempts.",
  tracking:
    "Follow tracks and signs left by creatures in wilderness areas. Scouts must roll once per hour traveled or lose the trail.",
} as const;

export const CLASSES_WITH_SKILLS = {
  thief: {
    displayName: "Thief Skills",
    abilityType: "Skill" as const,
  },
  "magic-user-thief": {
    displayName: "Thief Skills",
    abilityType: "Skill" as const,
  },
  assassin: {
    displayName: "Assassin Abilities",
    abilityType: "Ability" as const,
  },
  ranger: {
    displayName: "Ranger Skills",
    abilityType: "Skill" as const,
  },
  scout: {
    displayName: "Scout Abilities",
    abilityType: "Ability" as const,
  },
} as const;

export const SKILL_CONSTANTS = {
  DEFAULT_LEVEL: 1,
  COMPONENT_ID_PREFIX: "class-skills",
  URBAN_PENALTY: 20, // Ranger penalty in urban areas
} as const;

export const ENCOUNTER_CONSTANTS = {
  ENCOUNTER_CHANCE: 1, // 1 in 6 chance
  GENERATION_DELAY: 500,
  RESULT_DELAY: 300,
} as const;

// Encounter Tables
export const CITY_ENCOUNTERS = {
  "Day Encounter": [
    "Doppleganger",
    "Noble",
    "Thief",
    "Bully",
    "City Watch",
    "Merchant",
    "Beggar",
    "Priest",
    "Mercenary",
    "Wizard",
    "Lycanthrope, Wererat*",
  ],
  "Night Encounter": [
    "Doppleganger",
    "Shadow*",
    "Press Gang",
    "Beggar",
    "Thief",
    "Bully",
    "Merchant",
    "Giant Rat",
    "City Watch",
    "Wizard",
    "Lycanthrope, Wererat*",
  ],
} as const;

export const DUNGEON_ENCOUNTERS = {
  "Level 1": [
    "Bee, Giant",
    "Goblin",
    "Jelly, Green*",
    "Kobold",
    "NPC Party: Adventurer",
    "NPC Party: Bandit",
    "Orc",
    "Stirge",
    "Skeleton",
    "Snake, Cobra",
    "Spider, Giant Crab",
    "Wolf",
  ],
  "Level 2": [
    "Beetle, Giant Bombardier",
    "Fly, Giant",
    "Ghoul",
    "Gnoll",
    "Jelly, Gray",
    "Hobgoblin",
    "Lizard Man",
    "NPC Party: Adventurer",
    "Snake, Pit Viper",
    "Spider, Giant Black Widow",
    "Lizard Man, Subterranean",
    "Zombie",
  ],
  "Level 3": [
    "Ant, Giant",
    "Ape, Carnivorous",
    "Beetle, Giant Tiger",
    "Bugbear",
    "Doppleganger",
    "Gargoyle*",
    "Jelly, Glass",
    "Lycanthrope, Wererat*",
    "Ogre",
    "Shadow*",
    "Tentacle Worm",
    "Wight*",
  ],
  "Level 4-5": [
    "Bear, Cave",
    "Caecilia, Giant",
    "Cockatrice",
    "Doppleganger",
    "Jelly, Gray",
    "Hellhound",
    "Rust Monster*",
    "Lycanthrope, Werewolf*",
    "Minotaur",
    "Jelly, Ochre*",
    "Owlbear",
    "Wraith*",
  ],
  "Level 6-7": [
    "Basilisk",
    "Jelly, Black",
    "Caecilia, Giant",
    "Deceiver",
    "Hydra",
    "Rust Monster*",
    "Lycanthrope, Weretiger*",
    "Mummy*",
    "Owlbear",
    "Scorpion, Giant",
    "Spectre*",
    "Troll",
  ],
  "Level 8+": [
    "Basilisk, Greater*",
    "Chimera",
    "Deceiver, Greater",
    "Giant, Hill",
    "Giant, Stone",
    "Hydra",
    "Jelly, Black",
    "Lycanthrope, Wereboar*",
    "Purple Worm",
    "Salamander, Flame*",
    "Salamander, Frost*",
    "Vampire*",
  ],
} as const;

export const WILDERNESS_ENCOUNTERS = {
  "Desert or Barren": [
    "Dragon, Desert",
    "Hellhound",
    "Giant, Fire",
    "Purple Worm",
    "Fly, Giant",
    "Scorpion, Giant",
    "Camel",
    "Spider, Giant Tarantula",
    "NPC Party: Merchant",
    "Hawk",
    "NPC Party: Bandit",
    "Ogre",
    "Griffon",
    "Gnoll",
    "Dragon, Mountain",
  ],
  Grassland: [
    "Dragon, Plains",
    "Troll",
    "Fly, Giant",
    "Scorpion, Giant",
    "NPC Party: Bandit",
    "Lion",
    "Boar, Wild",
    "NPC Party: Merchant",
    "Wolf",
    "Bee, Giant",
    "Gnoll",
    "Goblin",
    "Flicker Beast",
    "Wolf, Dire",
    "Giant, Hill",
  ],
  "Inhabited Territories": [
    "Dragon, Cloud",
    "Ghoul",
    "Bugbear",
    "Goblin",
    "Centaur",
    "NPC Party: Bandit",
    "NPC Party: Merchant",
    "NPC Party: Pilgrim",
    "NPC Party: Noble",
    "Dog",
    "Gargoyle*",
    "Gnoll",
    "Ogre",
    "Minotaur",
    "Vampire*",
  ],
  Jungle: [
    "Dragon, Forest",
    "NPC Party: Bandit",
    "Goblin",
    "Hobgoblin",
    "Centipede, Giant",
    "Snake, Giant Python",
    "Elephant",
    "Antelope",
    "Jaguar",
    "Stirge",
    "Beetle, Giant Tiger",
    "Caecilia, Giant",
    "Shadow*",
    "NPC Party: Merchant",
    "Lycanthrope, Weretiger*",
  ],
  "Mountains or Hills": [
    "Dragon, Ice",
    "Roc (1d6: 1-3 Large, 4-5 Huge, 6 Giant)",
    "Deceiver",
    "Lycanthrope, Werewolf*",
    "Mountain Lion",
    "Wolf",
    "Spider, Giant Crab",
    "Hawk",
    "Orc",
    "Bat, Giant",
    "Hawk, Giant",
    "Giant, Hill",
    "Chimera",
    "Wolf, Dire",
    "Dragon, Mountain",
  ],
  Ocean: [
    "Dragon, Sea",
    "Hydra",
    "Whale, Sperm",
    "Crocodile, Giant",
    "Crab, Giant",
    "Whale, Killer",
    "Octopus, Giant",
    "Shark, Mako",
    "NPC Party: Merchant",
    "Shark, Bull",
    "Roc (1d8: 1-5 Huge, 6-8 Giant)",
    "Shark, Great White",
    "Mermaid",
    "Sea Serpent",
  ],
  "River or Riverside": [
    "Dragon, Swamp",
    "Dragon, Swamp",
    "Fish, Giant Piranha",
    "Stirge",
    "Fish, Giant Bass",
    "NPC Party: Merchant",
    "Lizard Man",
    "Crocodile",
    "Frog, Giant",
    "Fish, Giant Catfish",
    "NPC Party: Buccaneer",
    "Troll",
    "Jaguar",
    "Nixie",
    "Water Termite, Giant",
    "Dragon, Forest",
  ],
  Swamp: [
    "Dragon, Swamp",
    "Shadow*",
    "Troll",
    "Lizard, Giant Draco",
    "Centipede, Giant",
    "Leech, Giant",
    "Lizard Man",
    "Crocodile",
    "Stirge",
    "Orc",
    "Toad, Giant (see Frog, Giant)",
    "Lizard Man, Subterranean",
    "Blood Rose",
    "Hangman Tree",
    "Basilisk",
  ],
  "Woods or Forest": [
    "Dragon, Forest",
    "Alicorn (see Unicorn)",
    "Treant",
    "Orc",
    "Boar, Wild",
    "Bear, Black",
    "Hawk, Giant",
    "Antelope",
    "Wolf",
    "Ogre",
    "Bear, Grizzly",
    "Wolf, Dire",
    "Giant, Hill",
    "Owlbear",
    "Unicorn",
  ],
} as const;
