import type {
  TreasureType,
  TreasureResult,
  LairTreasureType,
  IndividualTreasureType,
  UnguardedTreasureLevel
} from "./types";
import {
  generateLairTreasure,
  generateIndividualTreasure,
  generateUnguardedTreasure
} from "./generators";
import { formatTreasureResult } from "./formatter";

// Re-export types for consumers
export type {
  TreasureResult,
  TreasureType,
  LairTreasureType,
  IndividualTreasureType,
  UnguardedTreasureLevel
};

// Main generation function
export function generateTreasure(
  type: TreasureType,
  subtype: LairTreasureType | IndividualTreasureType | UnguardedTreasureLevel
): TreasureResult {
  switch (type) {
    case "lair":
      return generateLairTreasure(subtype as LairTreasureType);
    case "individual":
      return generateIndividualTreasure(subtype as IndividualTreasureType);
    case "unguarded":
      return generateUnguardedTreasure(subtype as UnguardedTreasureLevel);
    default:
      throw new Error(`Unknown treasure type: ${type}`);
  }
}

// Export formatter
export { formatTreasureResult };