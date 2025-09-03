import { calculateArmorClass, calculateModifier } from "@/utils/characterCalculations";

// Combat-specific character data interface
export interface CombatCharacterData {
  id: string;
  name: string;
  ac?: number;
  armorClass?: number;
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

// Normalized HP interface
export interface CombatantHP {
  current: number;
  max: number;
}

// Simplified combatant interface
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

// Constants for initiative dice (Basic Fantasy uses 1d6 for initiative)
export const INITIATIVE_DICE_SIDES = 6;
export const MIN_INITIATIVE_ROLL = 1;

// Utility functions
export function calculateCombatantAC(character: CombatCharacterData): number {
  return character.ac || character.armorClass || calculateArmorClass(character) || 10;
}

export function normalizeCombatantHP(character: CombatCharacterData): CombatantHP {
  let current = 0;
  let max = 0;

  if (character["currentHp"] !== undefined) {
    current = character["currentHp"] as number;
  } else if (typeof character.hp === "object" && character.hp?.current !== undefined) {
    current = character.hp.current;
  } else if (typeof character.hp === "number") {
    current = character.hp;
  }

  if (character["maxHp"] !== undefined) {
    max = character["maxHp"] as number;
  } else if (typeof character.hp === "object" && character.hp?.max !== undefined) {
    max = character.hp.max;
  } else if (typeof character.hp === "number") {
    max = character.hp;
  }

  return { current: Math.max(0, current), max: Math.max(1, max) };
}

export function calculateDexModifier(character: CombatCharacterData): number {
  if (character.abilities?.dexterity?.modifier !== undefined) {
    return character.abilities.dexterity.modifier;
  } else if (character.abilities?.dexterity?.value !== undefined) {
    return calculateModifier(character.abilities.dexterity.value);
  } else if (character["dexterity"] !== undefined) {
    return calculateModifier(character["dexterity"] as number);
  }
  return 0;
}

// Sort combatants by initiative (descending) with stable sorting
export function sortCombatantsByInitiative(combatants: CombatantWithInitiative[]): CombatantWithInitiative[] {
  return [...combatants].sort((a, b) => {
    if (b.initiative === a.initiative) {
      return (b._sortId || 0) - (a._sortId || 0);
    }
    return b.initiative - a.initiative;
  });
}

// Generate a random initiative roll
export function rollInitiative(): number {
  return Math.floor(Math.random() * INITIATIVE_DICE_SIDES) + MIN_INITIATIVE_ROLL;
}

// Clear corrupted localStorage data
export function clearCorruptedCombatData(gameId: string): void {
  const keys = [
    `combat-tracker-${gameId || "temp"}`,
    `pre-combat-initiatives-${gameId || "temp"}`,
  ];

  keys.forEach((key) => {
    try {
      const item = localStorage.getItem(key);
      if (item && item.includes("undefined")) {
        localStorage.removeItem(key);
      }
    } catch {
      localStorage.removeItem(key);
    }
  });
}