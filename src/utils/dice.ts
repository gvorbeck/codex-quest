/**
 * Dice rolling utility that supports standard dice notation
 * Based on Sophie's Dice notation: https://sophiehoulden.com/dice/documentation/notation.html
 */

export interface DiceResult {
  total: number;
  rolls: number[];
  formula: string;
  breakdown: string;
}

/**
 * Rolls dice based on dice notation formula
 * @param formula - Dice notation string (e.g., "3d6", "2d20+5", "4d6L")
 * @returns DiceResult object with total, individual rolls, and breakdown
 */
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
      if (!numberMatch) {
        throw new Error(
          `Invalid multiplier: ${part}. Only numbers are supported for multiplication.`
        );
      }

      const multiplier = parseInt(numberMatch[1]!);

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
    if (!numberStr) throw new Error(`Invalid number format: ${part}`);
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

  const numDice = parseInt(diceMatch[1] || "1");
  const sidesStr = diceMatch[2];
  if (!sidesStr) throw new Error(`Invalid dice format: ${part}`);
  const sides = parseInt(sidesStr);
  const modifier = diceMatch[3] || "";

  if (numDice <= 0 || sides <= 0) {
    throw new Error("Number of dice and sides must be positive");
  }

  if (numDice > 100) {
    throw new Error("Cannot roll more than 100 dice at once");
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
