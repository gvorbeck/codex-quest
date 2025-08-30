// All possible skill names and their display labels
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

// Skill descriptions for all available skills
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

// Classes that have skill systems with their display information
export const CLASSES_WITH_SKILLS = {
  thief: { 
    displayName: "Thief Skills",
    abilityType: "Skill" as const
  },
  assassin: { 
    displayName: "Assassin Abilities",
    abilityType: "Ability" as const
  },
  ranger: { 
    displayName: "Ranger Skills",
    abilityType: "Skill" as const
  },
  scout: { 
    displayName: "Scout Abilities",
    abilityType: "Ability" as const
  },
} as const;

// Skill system constants
export const SKILL_CONSTANTS = {
  DEFAULT_LEVEL: 1,
  COMPONENT_ID_PREFIX: "class-skills",
  // Penalty percentages for specific skills/classes
  URBAN_PENALTY: 20, // Ranger penalty in urban areas
} as const;

// Type exports for TypeScript
export type SkillKey = keyof typeof ALL_SKILLS;
export type SkillClassKey = keyof typeof CLASSES_WITH_SKILLS;