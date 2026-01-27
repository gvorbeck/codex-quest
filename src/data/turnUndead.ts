/**
 * Turn Undead Table
 * From BFRPG Core Rules, page 57
 *
 * Clerics can Turn the undead by rolling 1d20.
 * The table shows the minimum roll needed for success.
 * "T" means the undead are automatically turned (no roll needed)
 * "D" means the undead are automatically destroyed (no roll needed)
 * "No" means the cleric cannot affect these undead
 */

export interface TurnUndeadEntry {
  undeadType: string;
  hitDice: string;
  levelRequirements: Record<number, string | number>;
}

export const TURN_UNDEAD_TABLE: TurnUndeadEntry[] = [
  {
    undeadType: "Skeleton",
    hitDice: "1 Hit Die",
    levelRequirements: {
      1: 13, 2: 11, 3: 9, 4: 7, 5: 5, 6: 3, 7: 2,
      8: "T", 9: "T", 10: "T", 11: "D", 12: "D", 13: "D",
      14: "D", 15: "D", 16: "D", 17: "D", 18: "D", 19: "D", 20: "D"
    }
  },
  {
    undeadType: "Zombie",
    hitDice: "2 Hit Dice",
    levelRequirements: {
      1: 17, 2: 15, 3: 13, 4: 11, 5: 9, 6: 7, 7: 5, 8: 3, 9: 2,
      10: "T", 11: "T", 12: "T", 13: "D", 14: "D", 15: "D", 16: "D",
      17: "D", 18: "D", 19: "D", 20: "D"
    }
  },
  {
    undeadType: "Ghoul",
    hitDice: "3 Hit Dice",
    levelRequirements: {
      1: 19, 2: 18, 3: 17, 4: 15, 5: 13, 6: 11, 7: 9, 8: 7, 9: 5,
      10: 3, 11: 2, 12: "T", 13: "T", 14: "T", 15: "D", 16: "D",
      17: "D", 18: "D", 19: "D", 20: "D"
    }
  },
  {
    undeadType: "Wight",
    hitDice: "4 Hit Dice",
    levelRequirements: {
      1: "No", 2: 20, 3: 19, 4: 18, 5: 17, 6: 15, 7: 13, 8: 11,
      9: 9, 10: 7, 11: 5, 12: 3, 13: 2, 14: "T", 15: "T", 16: "T",
      17: "D", 18: "D", 19: "D", 20: "D"
    }
  },
  {
    undeadType: "Wraith",
    hitDice: "5 Hit Dice",
    levelRequirements: {
      1: "No", 2: "No", 3: 20, 4: 19, 5: 18, 6: 17, 7: 15, 8: 13,
      9: 11, 10: 9, 11: 7, 12: 5, 13: 3, 14: 2, 15: "T", 16: "T",
      17: "T", 18: "D", 19: "D", 20: "D"
    }
  },
  {
    undeadType: "Mummy",
    hitDice: "6 Hit Dice",
    levelRequirements: {
      1: "No", 2: "No", 3: "No", 4: 20, 5: 19, 6: 18, 7: 17, 8: 15,
      9: 13, 10: 11, 11: 9, 12: 7, 13: 5, 14: 3, 15: 2, 16: "T",
      17: "T", 18: "T", 19: "D", 20: "D"
    }
  },
  {
    undeadType: "Spectre",
    hitDice: "7 Hit Dice",
    levelRequirements: {
      1: "No", 2: "No", 3: "No", 4: "No", 5: 20, 6: 19, 7: 18, 8: 17,
      9: 15, 10: 13, 11: 11, 12: 9, 13: 7, 14: 5, 15: 3, 16: 2,
      17: "T", 18: "T", 19: "T", 20: "D"
    }
  },
  {
    undeadType: "Vampire",
    hitDice: "8 Hit Dice",
    levelRequirements: {
      1: "No", 2: "No", 3: "No", 4: "No", 5: "No", 6: 20, 7: 19, 8: 18,
      9: 17, 10: 15, 11: 13, 12: 11, 13: 9, 14: 7, 15: 5, 16: 3,
      17: 2, 18: "T", 19: "T", 20: "T"
    }
  },
  {
    undeadType: "Ghost",
    hitDice: "9+ Hit Dice",
    levelRequirements: {
      1: "No", 2: "No", 3: "No", 4: "No", 5: "No", 6: "No", 7: 20, 8: 19,
      9: 18, 10: 17, 11: 15, 12: 13, 13: 11, 14: 9, 15: 7, 16: 5,
      17: 3, 18: 2, 19: "T", 20: "T"
    }
  }
];

/**
 * Get the turn undead result for a specific cleric level and undead type
 */
export function getTurnUndeadResult(
  clericLevel: number,
  undeadType: string
): string | number {
  const entry = TURN_UNDEAD_TABLE.find(
    (e) => e.undeadType.toLowerCase() === undeadType.toLowerCase()
  );

  if (!entry) return "No";

  const result = entry.levelRequirements[clericLevel];
  return result ?? "No";
}

/**
 * Format the turn undead result for display
 */
export function formatTurnUndeadResult(result: string | number): string {
  if (result === "No") return "Cannot Turn";
  if (result === "T") return "Auto Turn";
  if (result === "D") return "Auto Destroy";
  return `${result}+`;
}
