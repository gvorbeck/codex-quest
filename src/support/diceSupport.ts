/**
 * A comprehensive dice roller implementation that covers standard RPG dice notation
 * Compatible with dice notation from Wikipedia: https://en.wikipedia.org/wiki/Dice_notation
 *
 * Supports:
 * - Basic notation: d6, 3d6, 1d20
 * - Modifiers: 3d6+2, 1d20-1
 * - Multipliers: 2d8*100, 5d6*10
 * - Percentile dice: d%, d100
 * - Keep/Drop: 4d6k3, 4d6kh3, 4d6kl1, 4d6d1
 * - Exploding dice: 3d6!, 2d10*
 * - Complex expressions: 2d6+1d8, 3d6+2*5
 */

interface DiceRollResult {
  total: number;
  output: string;
  breakdown?: string[];
}

class DiceRoller {
  // Compiled regex patterns for better performance
  private readonly DICE_REGEX =
    /^(\d+)?d(\d+|%)([!*])?([kKdD]([hHlL])?(\d+))?([+-]\d+)?(\*\d+)?$/;
  private readonly DICE_GROUP_REGEX =
    /(\d*d(\d+|%)[!*]?([kKdD]([hHlL])?(\d+))?([+-]\d+)?(\*\d+)?)/g;

  private random(): number {
    return Math.random();
  }

  private rollSingleDie(sides: number): number {
    return Math.floor(this.random() * sides) + 1;
  }

  private rollMultipleDice(count: number, sides: number): number[] {
    return Array.from({ length: count }, () => this.rollSingleDie(sides));
  }

  private parseBasicDiceNotation(notation: string): {
    count: number;
    sides: number;
    modifier: number;
    multiplier: number;
    keepHigh?: number;
    keepLow?: number;
    drop?: number;
    exploding: boolean;
  } {
    // Handle percentile dice first
    if (notation === "d%") {
      return {
        count: 1,
        sides: 100,
        modifier: 0,
        multiplier: 1,
        exploding: false,
      };
    }

    // Enhanced regex to capture all possible dice notation elements
    const match = notation.match(this.DICE_REGEX);

    if (!match) {
      throw new Error(`Invalid dice notation: ${notation}`);
    }

    const [
      ,
      countStr,
      sidesStr,
      explodingChar,
      keepDropGroup,
      keepDropType,
      keepDropNum,
      modifierStr,
      multiplierStr,
    ] = match;

    const count = countStr ? parseInt(countStr, 10) : 1;
    const sides = sidesStr === "%" ? 100 : parseInt(sidesStr, 10);
    const modifier = modifierStr ? parseInt(modifierStr, 10) : 0;
    const multiplier = multiplierStr
      ? parseInt(multiplierStr.substring(1), 10)
      : 1;
    const exploding = explodingChar === "!" || explodingChar === "*";

    // Parse keep/drop notation
    let keepHigh: number | undefined;
    let keepLow: number | undefined;
    let drop: number | undefined;

    if (keepDropGroup && keepDropNum) {
      const num = parseInt(keepDropNum, 10);
      const operation = keepDropGroup.toLowerCase().charAt(0); // First char: k or d

      if (operation === "k") {
        if (keepDropType?.toLowerCase() === "l") {
          keepLow = num;
        } else {
          keepHigh = num; // default to keep high
        }
      } else if (operation === "d") {
        drop = num;
      }
    }

    return {
      count,
      sides,
      modifier,
      multiplier,
      keepHigh,
      keepLow,
      drop,
      exploding,
    };
  }

  private rollExplodingDice(count: number, sides: number): number[] {
    const results: number[] = [];

    for (let i = 0; i < count; i++) {
      let total = 0;
      let roll = this.rollSingleDie(sides);
      total += roll;

      // Keep rolling while we get max value
      while (roll === sides) {
        roll = this.rollSingleDie(sides);
        total += roll;
      }

      results.push(total);
    }

    return results;
  }

  private applyKeepDrop(
    rolls: number[],
    keepHigh?: number,
    keepLow?: number,
    drop?: number,
  ): number[] {
    let result = [...rolls];

    if (drop) {
      // Sort and remove the lowest 'drop' dice
      result.sort((a, b) => a - b);
      result = result.slice(drop);
    }

    if (keepHigh) {
      // Sort descending and keep the highest 'keepHigh' dice
      result.sort((a, b) => b - a);
      result = result.slice(0, keepHigh);
    }

    if (keepLow) {
      // Sort ascending and keep the lowest 'keepLow' dice
      result.sort((a, b) => a - b);
      result = result.slice(0, keepLow);
    }

    return result;
  }

  private rollSingleDiceGroup(notation: string): DiceRollResult {
    const {
      count,
      sides,
      modifier,
      multiplier,
      keepHigh,
      keepLow,
      drop,
      exploding,
    } = this.parseBasicDiceNotation(notation);

    let rolls: number[];

    if (exploding) {
      rolls = this.rollExplodingDice(count, sides);
    } else {
      rolls = this.rollMultipleDice(count, sides);
    }

    // Apply keep/drop logic
    const finalRolls = this.applyKeepDrop(rolls, keepHigh, keepLow, drop);

    const sum = finalRolls.reduce((acc, roll) => acc + roll, 0);
    const total = (sum + modifier) * multiplier;

    // Build output string
    const output = notation;
    const breakdown: string[] = [];

    // Add details for complex rolls
    if (rolls.length > 1 || keepHigh || keepLow || drop || exploding) {
      if (keepHigh || keepLow || drop) {
        breakdown.push(`Rolled: [${rolls.join(", ")}]`);
        breakdown.push(`Kept: [${finalRolls.join(", ")}]`);
      } else {
        breakdown.push(`Rolls: [${finalRolls.join(", ")}]`);
      }
    }

    if (modifier !== 0) {
      breakdown.push(
        `Sum: ${sum}, Modifier: ${modifier > 0 ? "+" : ""}${modifier}`,
      );
    }

    if (multiplier !== 1) {
      breakdown.push(`Multiplier: ×${multiplier}`);
    }

    return {
      total,
      output: `${output} = ${total}`,
      breakdown: breakdown.length > 0 ? breakdown : undefined,
    };
  }

  private evaluateExpression(expression: string): number {
    // Simple expression evaluator for basic arithmetic
    // Handles +, -, *, / with proper precedence
    try {
      // Remove whitespace and validate characters
      const cleaned = expression.replace(/\s/g, "");
      if (!/^[\d+\-*/().]+$/.test(cleaned)) {
        throw new Error("Invalid characters in expression");
      }

      // Use Function constructor for safe evaluation of mathematical expressions
      // This is safer than eval() as it runs in a restricted context
      return new Function(`"use strict"; return (${cleaned})`)();
    } catch {
      throw new Error(`Invalid mathematical expression: ${expression}`);
    }
  }

  roll(notation: string): DiceRollResult {
    try {
      // Handle empty or whitespace-only input
      if (!notation || !notation.trim()) {
        throw new Error("Empty dice notation");
      }

      notation = notation.trim().toLowerCase();

      // Check if this is a complex expression with multiple dice groups
      const diceGroups = notation.match(this.DICE_GROUP_REGEX);

      if (!diceGroups) {
        // Try to evaluate as a simple mathematical expression
        const result = this.evaluateExpression(notation);
        return {
          total: result,
          output: `${notation} = ${result}`,
        };
      }

      if (diceGroups.length === 1 && diceGroups[0] === notation) {
        // Single dice group
        return this.rollSingleDiceGroup(notation);
      }

      // Complex expression with multiple dice groups
      let modifiedExpression = notation;
      const results: DiceRollResult[] = [];

      // Replace each dice group with its result
      for (const group of diceGroups) {
        const result = this.rollSingleDiceGroup(group);
        results.push(result);
        // Replace the first occurrence of this group with its total
        modifiedExpression = modifiedExpression.replace(
          group,
          result.total.toString(),
        );
      }

      // Evaluate the final expression
      const finalTotal = this.evaluateExpression(modifiedExpression);

      // Build comprehensive output
      const breakdownParts: string[] = [];
      results.forEach((result, index) => {
        breakdownParts.push(`${diceGroups[index]}: ${result.total}`);
        if (result.breakdown) {
          result.breakdown.forEach((detail) =>
            breakdownParts.push(`  ${detail}`),
          );
        }
      });

      return {
        total: finalTotal,
        output: `${notation} = ${finalTotal}`,
        breakdown: breakdownParts,
      };
    } catch (error) {
      console.error("Dice rolling error:", error);
      throw new Error(
        `Failed to roll dice: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

// Create a singleton instance
const diceRoller = new DiceRoller();

/**
 * Roll dice using standard RPG notation (single roll)
 * @param notation - Dice notation string (e.g., "3d6", "1d20+5", "2d8*100")
 * @returns The total result as a number
 */
export function rollDice(notation: string): number;

/**
 * Roll dice using standard RPG notation (multiple rolls)
 * @param notation - Dice notation string (e.g., "3d6", "1d20+5", "2d8*100")
 * @param count - Number of times to repeat the roll (must be > 1)
 * @returns Array of results
 */
export function rollDice(notation: string, count: number): number[];

/**
 * Roll dice using standard RPG notation - implementation
 * @param notation - Dice notation string (e.g., "3d6", "1d20+5", "2d8*100")
 * @param count - Optional: number of times to repeat the roll
 * @returns The total result or array of results if count > 1
 */
export function rollDice(notation: string, count?: number): number | number[] {
  // Input validation
  if (!notation?.trim()) {
    throw new Error("Dice notation cannot be empty");
  }

  if (count !== undefined && (count < 1 || !Number.isInteger(count))) {
    throw new Error("Count must be a positive integer");
  }

  if (!count || count === 1) {
    return diceRoller.roll(notation).total;
  }

  return Array.from({ length: count }, () => diceRoller.roll(notation).total);
}

/**
 * Roll dice and get detailed results including breakdown
 * @param notation - Dice notation string
 * @returns Complete roll result with breakdown
 */
export const rollDiceDetailed = (notation: string): DiceRollResult => {
  return diceRoller.roll(notation);
};

/**
 * Validate dice notation string
 * @param notation - Dice notation to validate
 * @returns true if valid, false otherwise
 */
export const validateDiceNotation = (notation: string): boolean => {
  try {
    diceRoller.roll(notation);
    return true;
  } catch {
    return false;
  }
};
