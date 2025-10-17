export interface GameCombatant {
  ac: number;
  avatar?: string;
  initiative: number;
  name: string;
  [key: string]: unknown;
}

export interface GamePlayer {
  character: string; // Character ID
  characterName?: string; // Resolved character name
  user: string; // User ID
  userName?: string; // Resolved user name
  avatar?: string; // Character avatar
  [key: string]: unknown;
}

export interface Game {
  id: string;
  name: string;
  notes?: string;
  combatants?: GameCombatant[];
  players?: GamePlayer[];
  // Allow for additional properties that might exist
  [key: string]: unknown;
}

// Currency types - derived from gameRules constants
export type CurrencyKey =
  | "platinum"
  | "gold"
  | "electrum"
  | "silver"
  | "copper";
export type CurrencyType = "pp" | "gp" | "ep" | "sp" | "cp";

// Treasure and game data types - derived from dataOrganization constants
export interface TreasureTypeConfig {
  value: string;
  label: string;
  icon: string;
}

export interface CoinConfig {
  key: string;
  label: string;
  color: string;
}

// Dice and mechanics types
export interface DiceResult {
  total: number;
  rolls: number[];
  formula: string;
  breakdown: string;
}

// Combat types
export interface CombatCharacterData {
  id: string;
  name: string;
  avatar?: string;
  equipment?: Array<{
    name: string;
    wearing?: boolean;
    AC?: number;
    [key: string]: unknown;
  }>;
  abilities?: {
    dexterity?: {
      value: number;
      modifier: number;
    };
  };
  hp?: { current?: number; max?: number } | number;
  currentHp?: number;
  maxHp?: number;
  [key: string]: unknown;
}

export interface CombatantHP {
  current: number;
  max: number;
}

export interface CombatantWithInitiative extends Record<string, unknown> {
  name: string;
  ac: number;
  initiative: number;
  isPlayer: boolean;
  _sortId: number;
  dexModifier: number;
  hp: CombatantHP;
  avatar?: string;
}

// Treasure types
export interface TreasureResult {
  type: string;
  level?: string;
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
  gemsAndJewelry: string[];
  magicItems: string[];
  description: string;
  breakdown: string[];
}

export type TreasureType = "lair" | "individual" | "unguarded";
export type LairTreasureType =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O";
export type IndividualTreasureType = "P" | "Q" | "R" | "S" | "T" | "U" | "V";
export type UnguardedTreasureLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// Skill system types
export interface SkillTableRow {
  id: string;
  level: number;
  characterName?: string;
  isPlayer: boolean;
  userId: string | undefined;
  characterId?: string;
  [skillKey: string]: string | number | boolean | undefined;
}

export interface ClassSkillData {
  classId: string;
  displayName: string;
  skills: SkillTableRow[];
}
