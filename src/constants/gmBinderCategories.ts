/**
 * Configuration constants for GMBinder categorization logic
 */

// Spell categorization based on maximum level
export const SPELL_CATEGORIES = {
  LOW_LEVEL: "Low Level (1–2)",
  MID_LEVEL: "Mid Level (3–4)",
  HIGH_LEVEL_5_6: "High Level (5–6)",
  HIGH_LEVEL_7_9: "High Level (7–9)",
} as const;

export const SPELL_LEVEL_THRESHOLDS = {
  LOW_MAX: 2,
  MID_MAX: 4,
  HIGH_5_6_MAX: 6,
} as const;

// Monster categorization based on name patterns
export const MONSTER_CATEGORIES = {
  DRAGONS: "Dragons",
  UNDEAD: "Undead",
  GIANTS_LARGE_HUMANOIDS: "Giants & Large Humanoids",
  HUMANOIDS: "Humanoids",
  ANIMALS: "Animals",
  EXTRAPLANAR: "Extraplanar",
  MISCELLANEOUS: "Miscellaneous",
} as const;

export const MONSTER_NAME_PATTERNS = {
  [MONSTER_CATEGORIES.DRAGONS]: ["dragon"],
  [MONSTER_CATEGORIES.UNDEAD]: [
    "undead",
    "skeleton", 
    "zombie", 
    "vampire", 
    "ghost",
    "lich",
    "wraith",
    "wight",
    "ghoul",
  ],
  [MONSTER_CATEGORIES.GIANTS_LARGE_HUMANOIDS]: [
    "giant",
    "ogre", 
    "troll",
    "titan",
    "ettin",
  ],
  [MONSTER_CATEGORIES.HUMANOIDS]: [
    "goblin",
    "orc", 
    "kobold", 
    "hobgoblin",
    "gnoll",
    "lizardman",
    "troglodyte",
  ],
  [MONSTER_CATEGORIES.ANIMALS]: [
    "wolf",
    "bear", 
    "lion", 
    "boar",
    "tiger",
    "leopard",
    "hawk",
    "eagle",
    "snake",
    "spider",
    "ant",
    "bee",
    "rat",
    "bat",
    "horse",
    "dog",
    "cat",
  ],
  [MONSTER_CATEGORIES.EXTRAPLANAR]: [
    "demon",
    "devil", 
    "elemental",
    "djinn",
    "efreet",
    "daemon",
  ],
} as const;

// Cache keys for consistent caching
export const CACHE_KEYS = {
  GM_BINDER_SPELLS: "gm-binder-spells",
  GM_BINDER_MONSTERS: "gm-binder-monsters",
} as const;

// Loading messages for consistency
export const GM_BINDER_MESSAGES = {
  LOADING_SPELLS: "Loading spells...",
  LOADING_MONSTERS: "Loading bestiary...",
  NO_SPELLS: "No spells available.",
  NO_MONSTERS: "No monsters available.",
} as const;