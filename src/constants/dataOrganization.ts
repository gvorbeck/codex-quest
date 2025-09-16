/**
 * Data Organization & Categorization Constants
 * Configuration for sorting, grouping, and categorizing application data
 */
import type {
  IndividualTreasureType,
  LairTreasureType,
  UnguardedTreasureLevel,
} from "@/types";
import { CURRENCY_UI_CONFIG } from "./uiDesignSystem";
import type { TreasureTypeConfig, CoinConfig } from "@/types";

// Treasure Generation Configuration

export const TREASURE_TYPES: TreasureTypeConfig[] = [
  {
    value: "lair",
    label: "Lair",
    icon: "shield",
  },
  {
    value: "individual",
    label: "Individual",
    icon: "user",
  },
  {
    value: "unguarded",
    label: "Unguarded",
    icon: "star",
  },
];

export const LAIR_TREASURE_TYPES: { value: LairTreasureType; label: string }[] =
  [
    { value: "A", label: "Type A - Large dragon hoard" },
    { value: "B", label: "Type B - Medium monster lair" },
    { value: "C", label: "Type C - Small monster lair" },
    { value: "D", label: "Type D - Minor dragon hoard" },
    { value: "E", label: "Type E - Giant lair" },
    { value: "F", label: "Type F - Rich monster lair" },
    { value: "G", label: "Type G - Dragon treasure" },
    { value: "H", label: "Type H - Dragon treasure (special)" },
    { value: "I", label: "Type I - Wealthy individual" },
    { value: "J", label: "Type J - Poor monster" },
    { value: "K", label: "Type K - Minor treasure" },
    { value: "L", label: "Type L - Gem cache" },
    { value: "M", label: "Type M - Royal treasury" },
    { value: "N", label: "Type N - Magic items only" },
    { value: "O", label: "Type O - High-magic treasure" },
  ];

export const INDIVIDUAL_TREASURE_TYPES: {
  value: IndividualTreasureType;
  label: string;
}[] = [
  { value: "P", label: "Type P - Copper pieces" },
  { value: "Q", label: "Type Q - Silver pieces" },
  { value: "R", label: "Type R - Electrum pieces" },
  { value: "S", label: "Type S - Gold pieces" },
  { value: "T", label: "Type T - Platinum pieces" },
  { value: "U", label: "Type U - Adventurer's purse" },
  { value: "V", label: "Type V - Wealthy traveler" },
];

export const UNGUARDED_TREASURE_LEVELS: {
  value: UnguardedTreasureLevel;
  label: string;
}[] = [
  { value: 1, label: "Level 1 - Beginner treasure" },
  { value: 2, label: "Level 2 - Minor cache" },
  { value: 3, label: "Level 3 - Small hoard" },
  { value: 4, label: "Level 4-5 - Medium treasure" },
  { value: 5, label: "Level 4-5 - Medium treasure" },
  { value: 6, label: "Level 6-7 - Valuable cache" },
  { value: 7, label: "Level 6-7 - Valuable cache" },
  { value: 8, label: "Level 8+ - Epic treasure" },
];

// GM Binder Content Categorization
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

// Loading and Status Messages
export const GM_BINDER_MESSAGES = {
  LOADING_SPELLS: "Loading spells...",
  LOADING_MONSTERS: "Loading bestiary...",
  NO_SPELLS: "No spells available.",
  NO_MONSTERS: "No monsters available.",
} as const;

// Coin configuration for treasure display - derived from unified currency configuration
export const COIN_CONFIGS: CoinConfig[] = CURRENCY_UI_CONFIG.map(
  ({ key, abbrev, textColor }) => ({
    key,
    label: abbrev,
    color: textColor,
  })
);
