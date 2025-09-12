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

// Lair treasure types
export type LairTreasureType = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O";

// Individual treasure types
export type IndividualTreasureType = "P" | "Q" | "R" | "S" | "T" | "U" | "V";

// Unguarded treasure levels
export type UnguardedTreasureLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface TreasureConfig {
  copper: { chance: number; amount: string };
  silver: { chance: number; amount: string };
  electrum: { chance: number; amount: string };
  gold: { chance: number; amount: string };
  platinum: { chance: number; amount: string };
  gems: { chance: number; amount: string };
  jewelry: { chance: number; amount: string };
  magic: { chance: number; amount: number };
}

export interface IndividualTreasureConfig {
  copper: { amount: string; chance?: number };
  silver: { amount: string; chance?: number };
  electrum: { amount: string; chance?: number };
  gold: { amount: string; chance?: number };
  platinum: { amount: string; chance?: number };
  gems: { amount: string; chance?: number };
  jewelry: { amount: string; chance?: number };
  magic: { amount: number; chance?: number };
}

export interface UnguardedTreasureConfig {
  copper: { chance: number; amount: string };
  silver: { chance: number; amount: string };
  electrum: { chance: number; amount: string };
  gold: { chance: number; amount: string };
  platinum: { chance: number; amount: string };
  gems: { chance: number; amount: string };
  jewelry: { chance: number; amount: string };
  magic: { chance: number; amount: number };
}