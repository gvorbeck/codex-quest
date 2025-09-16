/**
 * Game mechanics utilities - consolidated from dice.ts, combatUtils.ts, and gameConstants.ts
 * Contains dice rolling, combat mechanics, and game constants
 */

import type {
  DiceResult,
  CombatCharacterData,
  CombatantHP,
  CombatantWithInitiative,
} from "@/types";

// ============================================================================
// GAME CONSTANTS
// ============================================================================

export const GAME_MECHANICS = {
  // Armor Class defaults
  DEFAULT_UNARMORED_AC: 11 as number,

  // Movement rates (per round)
  DEFAULT_MOVEMENT_RATE: "40'",
  LEATHER_ARMOR_MOVEMENT: "30'",
  METAL_ARMOR_MOVEMENT: "20'",

  // Ability score modifier thresholds (BFRPG system)
  ABILITY_MODIFIERS: [
    { max: 3, modifier: -3 },
    { max: 5, modifier: -2 },
    { max: 8, modifier: -1 },
    { max: 12, modifier: 0 },
    { max: 15, modifier: 1 },
    { max: 17, modifier: 2 },
  ] as const,

  // Default modifier for scores above 17
  DEFAULT_HIGH_MODIFIER: 3,

  // Starting gold for first level characters
  STARTING_GOLD_DICE: "3d6",
  STARTING_GOLD_MULTIPLIER: 10,
} as const;

export const DICE_LIMITS = {
  MAX_DICE_COUNT: 100,
  MIN_DICE_SIDES: 1,
} as const;

export const ENCUMBRANCE = {
  GOLD_PIECE_WEIGHT: 1 / 20, // 1/20th of a pound per gold piece
  COINS_PER_CUBIC_INCH: 10, // Storage space estimation
} as const;

// ============================================================================
// DICE ROLLING SYSTEM
// ============================================================================

export function roller(formula: string): DiceResult {
  const cleanFormula = formula.replace(/\s+/g, "");

  try {
    const result = parseDiceExpression(cleanFormula);
    return {
      total: result.total,
      rolls: result.rolls,
      formula: formula,
      breakdown: result.breakdown,
    };
  } catch (error) {
    throw new Error(`Invalid dice formula: ${formula}. ${error}`);
  }
}

interface ParseResult {
  total: number;
  rolls: number[];
  breakdown: string;
}

function parseDiceExpression(expression: string): ParseResult {
  // First handle multiplication/division (higher precedence)
  const multiplyParts = expression.split(/([*/])/);
  if (multiplyParts.length > 1) {
    return parseMultiplicationExpression(multiplyParts);
  }

  // Handle multiple dice expressions separated by + or -
  const parts = expression.split(/([+-])/);
  let total = 0;
  const allRolls: number[] = [];
  let breakdown = "";

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]?.trim();
    if (!part) continue;

    if (part === "+" || part === "-") {
      breakdown += ` ${part} `;
      continue;
    }

    const operator = i > 0 ? parts[i - 1] : "+";
    const result = parseDicePart(part);

    if (operator === "-") {
      total -= result.total;
    } else {
      total += result.total;
    }

    allRolls.push(...result.rolls);
    breakdown += result.breakdown;
  }

  return { total, rolls: allRolls, breakdown };
}

function parseMultiplicationExpression(parts: string[]): ParseResult {
  let total = 0;
  let firstResult: ParseResult | null = null;
  let breakdown = "";

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]?.trim();
    if (!part) continue;

    if (part === "*" || part === "/") {
      breakdown += ` ${part} `;
      continue;
    }

    const operator = i > 0 ? parts[i - 1] : "*";

    if (firstResult === null) {
      // First part - should be dice expression
      firstResult = parseDicePart(part);
      total = firstResult.total;
      breakdown = firstResult.breakdown;
    } else {
      // Subsequent parts - should be numbers for multiplication
      const numberMatch = part.match(/^(\d+)$/);
      if (!numberMatch || !numberMatch[1]) {
        throw new Error(
          `Invalid multiplier: ${part}. Only numbers are supported for multiplication.`
        );
      }

      const multiplier = parseInt(numberMatch[1]);

      if (operator === "*") {
        total *= multiplier;
        breakdown += ` ${operator} ${multiplier} = ${total}`;
      } else if (operator === "/") {
        total = Math.floor(total / multiplier);
        breakdown += ` ${operator} ${multiplier} = ${total}`;
      }
    }
  }

  return {
    total,
    rolls: firstResult?.rolls || [],
    breakdown,
  };
}

function parseDicePart(part: string): ParseResult {
  // Check if it's just a number (modifier)
  const numberMatch = part.match(/^(\d+)$/);
  if (numberMatch) {
    const numberStr = numberMatch[1];
    if (!numberStr) {
      throw new Error(`Invalid number format: ${part}`);
    }
    const value = parseInt(numberStr);
    return {
      total: value,
      rolls: [],
      breakdown: value.toString(),
    };
  }

  // Parse dice notation with optional modifiers
  const diceMatch = part.match(/^(\d*)d(\d+)([A-Z]*\d*)?$/i);
  if (!diceMatch) {
    throw new Error(`Invalid dice notation: ${part}`);
  }

  const numDiceStr = diceMatch[1];
  const sidesStr = diceMatch[2];
  const modifierStr = diceMatch[3];

  if (!sidesStr) {
    throw new Error(`Invalid dice format: ${part}`);
  }

  const numDice = parseInt(numDiceStr || "1");
  const sides = parseInt(sidesStr);
  const modifier = modifierStr || "";

  if (numDice <= 0 || sides <= 0) {
    throw new Error("Number of dice and sides must be positive");
  }

  if (numDice > DICE_LIMITS.MAX_DICE_COUNT) {
    throw new Error(
      `Cannot roll more than ${DICE_LIMITS.MAX_DICE_COUNT} dice at once`
    );
  }

  // Roll the dice
  const rolls = Array.from({ length: numDice }, () => rollDie(sides));

  // Apply modifiers
  const modifiedResult = applyModifiers(rolls, modifier, sides);

  return {
    total: modifiedResult.total,
    rolls: modifiedResult.rolls,
    breakdown: `${numDice}d${sides}${modifier}(${modifiedResult.breakdown})`,
  };
}

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

interface ModifierResult {
  total: number;
  rolls: number[];
  breakdown: string;
}

function applyModifiers(
  rolls: number[],
  modifier: string,
  sides: number
): ModifierResult {
  let workingRolls = [...rolls];
  let breakdown = rolls.join(", ");

  if (!modifier) {
    return {
      total: workingRolls.reduce((sum, roll) => sum + roll, 0),
      rolls: workingRolls,
      breakdown,
    };
  }

  // Keep Highest (K)
  const keepHighMatch = modifier.match(/^K(\d*)$/i);
  if (keepHighMatch) {
    const keepCount = parseInt(
      keepHighMatch[1] || (workingRolls.length - 1).toString()
    );
    workingRolls.sort((a, b) => b - a);
    workingRolls = workingRolls.slice(0, keepCount);
    breakdown = `${rolls.join(
      ", "
    )} → keep highest ${keepCount}: ${workingRolls.join(", ")}`;
  }

  // Keep Lowest (KL)
  const keepLowMatch = modifier.match(/^KL(\d*)$/i);
  if (keepLowMatch) {
    const keepCount = parseInt(keepLowMatch[1] || "1");
    workingRolls.sort((a, b) => a - b);
    workingRolls = workingRolls.slice(0, keepCount);
    breakdown = `${rolls.join(
      ", "
    )} → keep lowest ${keepCount}: ${workingRolls.join(", ")}`;
  }

  // Drop Highest (H)
  const dropHighMatch = modifier.match(/^H(\d*)$/i);
  if (dropHighMatch) {
    const dropCount = parseInt(dropHighMatch[1] || "1");
    workingRolls.sort((a, b) => b - a);
    workingRolls = workingRolls.slice(dropCount);
    breakdown = `${rolls.join(
      ", "
    )} → drop highest ${dropCount}: ${workingRolls.join(", ")}`;
  }

  // Drop Lowest (L)
  const dropLowMatch = modifier.match(/^L(\d*)$/i);
  if (dropLowMatch) {
    const dropCount = parseInt(dropLowMatch[1] || "1");
    workingRolls.sort((a, b) => a - b);
    workingRolls = workingRolls.slice(dropCount);
    breakdown = `${rolls.join(
      ", "
    )} → drop lowest ${dropCount}: ${workingRolls.join(", ")}`;
  }

  // Explosion (!)
  const explodeMatch = modifier.match(/^!(\d*)$/);
  if (explodeMatch) {
    const explodeCount = parseInt(explodeMatch[1] || "1");
    const explodeTarget = sides;
    const exploded: number[] = [];

    for (const roll of workingRolls) {
      if (roll === explodeTarget) {
        for (let i = 0; i < explodeCount; i++) {
          exploded.push(rollDie(sides));
        }
      }
    }

    if (exploded.length > 0) {
      workingRolls.push(...exploded);
      breakdown = `${rolls.join(", ")} → exploded ${
        exploded.length
      } dice: ${workingRolls.join(", ")}`;
    }
  }

  // Reroll (R)
  const rerollMatch = modifier.match(/^R(\d*)$/);
  if (rerollMatch) {
    const rerollTarget = parseInt(rerollMatch[1] || "1");
    workingRolls = workingRolls.map((roll) => {
      if (roll === rerollTarget) {
        const newRoll = rollDie(sides);
        return newRoll;
      }
      return roll;
    });
    breakdown = `${rolls.join(
      ", "
    )} → rerolled ${rerollTarget}s: ${workingRolls.join(", ")}`;
  }

  return {
    total: workingRolls.reduce((sum, roll) => sum + roll, 0),
    rolls: workingRolls,
    breakdown,
  };
}

export function rollPercentage(): number {
  return roller("1d100").total;
}

export function randomArrayElement<T>(array: readonly T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index]!;
}

// ============================================================================
// COMBAT UTILITIES
// ============================================================================

export function normalizeCombatantHP(
  character: CombatCharacterData
): CombatantHP {
  let current = 0;
  let max = 0;

  if (character["currentHp"] !== undefined) {
    current = character["currentHp"] as number;
  } else if (
    typeof character.hp === "object" &&
    character.hp?.current !== undefined
  ) {
    current = character.hp.current;
  } else if (typeof character.hp === "number") {
    current = character.hp;
  }

  if (character["maxHp"] !== undefined) {
    max = character["maxHp"] as number;
  } else if (
    typeof character.hp === "object" &&
    character.hp?.max !== undefined
  ) {
    max = character.hp.max;
  } else if (typeof character.hp === "number") {
    max = character.hp;
  }

  return { current: Math.max(0, current), max: Math.max(1, max) };
}

export function sortCombatantsByInitiative(
  combatants: CombatantWithInitiative[]
): CombatantWithInitiative[] {
  return [...combatants].sort((a, b) => {
    if (b.initiative === a.initiative) {
      return (b._sortId || 0) - (a._sortId || 0);
    }
    return b.initiative - a.initiative;
  });
}

export function rollInitiative(): number {
  return roller("1d6").total;
}

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
