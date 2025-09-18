/**
 * Currency utility functions for BFRPG character management
 * Handles gold/silver/copper conversions and equipment weight calculations
 */

import { ENCUMBRANCE } from "./mechanics";
import { CURRENCY_TO_COPPER_RATES, CURRENCY_ORDER } from "@/constants";
import type { CurrencyKey } from "@/types";

// Shared currency interface
export interface CurrencyAmount {
  platinum?: number;
  gold?: number;
  electrum?: number;
  silver?: number;
  copper?: number;
}

// BFRPG Currency conversion rates (derived from official CURRENCY_TO_COPPER_RATES)
const CURRENCY_RATES = {
  PLATINUM_TO_GOLD:
    CURRENCY_TO_COPPER_RATES.platinum / CURRENCY_TO_COPPER_RATES.gold, // 1 pp = 5 gp
  GOLD_TO_SILVER:
    CURRENCY_TO_COPPER_RATES.gold / CURRENCY_TO_COPPER_RATES.silver, // 1 gp = 10 sp
  ELECTRUM_TO_SILVER:
    CURRENCY_TO_COPPER_RATES.electrum / CURRENCY_TO_COPPER_RATES.silver, // 1 ep = 5 sp
  SILVER_TO_COPPER:
    CURRENCY_TO_COPPER_RATES.silver / CURRENCY_TO_COPPER_RATES.copper, // 1 sp = 10 cp
  GOLD_TO_COPPER: CURRENCY_TO_COPPER_RATES.gold, // 1 gp = 100 cp
  PLATINUM_TO_COPPER: CURRENCY_TO_COPPER_RATES.platinum, // 1 pp = 500 cp
  ELECTRUM_TO_COPPER: CURRENCY_TO_COPPER_RATES.electrum, // 1 ep = 50 cp
} as const;

// Export for tests
export { CURRENCY_RATES };

// Currency types for conversion
export type CurrencyType =
  | "platinum"
  | "gold"
  | "electrum"
  | "silver"
  | "copper";

// Type-safe conversion key type for supported conversions
type SupportedConversionKey =
  | "platinum-gold"
  | "gold-silver"
  | "electrum-silver"
  | "silver-copper"
  | "gold-copper"
  | "platinum-copper"
  | "electrum-copper"
  // Bidirectional conversions
  | "gold-platinum"
  | "silver-gold"
  | "silver-platinum"
  | "silver-electrum"
  | "copper-silver"
  | "copper-gold"
  | "copper-platinum"
  | "copper-electrum";

// Conversion map for generic currency conversion
const CONVERSION_MAP: Record<SupportedConversionKey, number> = {
  // Standard downward conversions
  "platinum-gold": CURRENCY_RATES.PLATINUM_TO_GOLD,
  "gold-silver": CURRENCY_RATES.GOLD_TO_SILVER,
  "electrum-silver": CURRENCY_RATES.ELECTRUM_TO_SILVER,
  "silver-copper": CURRENCY_RATES.SILVER_TO_COPPER,
  "gold-copper": CURRENCY_RATES.GOLD_TO_COPPER,
  "platinum-copper": CURRENCY_RATES.PLATINUM_TO_COPPER,
  "electrum-copper": CURRENCY_RATES.ELECTRUM_TO_COPPER,
  // Bidirectional upward conversions
  "gold-platinum": 1 / CURRENCY_RATES.PLATINUM_TO_GOLD,
  "silver-gold": 1 / CURRENCY_RATES.GOLD_TO_SILVER,
  "silver-platinum":
    1 / CURRENCY_RATES.PLATINUM_TO_GOLD / CURRENCY_RATES.GOLD_TO_SILVER, // silver -> gold -> platinum
  "silver-electrum": 1 / CURRENCY_RATES.ELECTRUM_TO_SILVER,
  "copper-silver": 1 / CURRENCY_RATES.SILVER_TO_COPPER,
  "copper-gold": 1 / CURRENCY_RATES.GOLD_TO_COPPER,
  "copper-platinum": 1 / CURRENCY_RATES.PLATINUM_TO_COPPER,
  "copper-electrum": 1 / CURRENCY_RATES.ELECTRUM_TO_COPPER,
};

/**
 * Validate currency amount is not negative
 */
function validateCurrency(amount: number, type: string): void {
  if (amount < 0) throw new Error(`${type} amount cannot be negative`);
}

/**
 * Generic currency conversion function
 * Supports bidirectional conversions between all BFRPG currency types
 */
export function convertCurrency(
  amount: number,
  from: CurrencyType,
  to: CurrencyType
): number {
  validateCurrency(amount, from);

  if (from === to) return amount;

  const conversionKey = `${from}-${to}` as SupportedConversionKey;
  const rate = CONVERSION_MAP[conversionKey];

  if (!rate) {
    throw new Error(`Conversion from ${from} to ${to} is not supported`);
  }

  return amount * rate;
}

/**
 * Calculate total value in gold pieces from mixed currency (all BFRPG currency types)
 */
export function calculateTotalGoldValue(currency: CurrencyAmount): number {
  const platinum = currency.platinum || 0;
  const gold = currency.gold || 0;
  const electrum = currency.electrum || 0;
  const silver = currency.silver || 0;
  const copper = currency.copper || 0;

  return (
    platinum * CURRENCY_RATES.PLATINUM_TO_GOLD +
    gold +
    (electrum * CURRENCY_RATES.ELECTRUM_TO_SILVER) /
      CURRENCY_RATES.GOLD_TO_SILVER +
    silver / CURRENCY_RATES.GOLD_TO_SILVER +
    copper / CURRENCY_RATES.GOLD_TO_COPPER
  );
}

/**
 * Calculate total coin count (for weight calculations)
 */
export function calculateTotalCoinCount(currency: CurrencyAmount): number {
  return (
    (currency.platinum || 0) +
    (currency.gold || 0) +
    (currency.electrum || 0) +
    (currency.silver || 0) +
    (currency.copper || 0)
  );
}

/**
 * Calculate total equipment weight in pounds
 * Supports both quantity and amount properties for flexibility
 */
export function calculateTotalWeight(
  equipment: Array<{
    weight: number;
    quantity?: number;
    amount?: number;
  }>
): number {
  return equipment.reduce((total, item) => {
    const weight = item.weight || 0;
    const quantity = item.quantity || item.amount || 1;
    return total + weight * quantity;
  }, 0);
}

/**
 * Calculate coin weight in pounds
 */
export function calculateCoinWeight(totalCoins: number): number {
  return totalCoins * ENCUMBRANCE.GOLD_PIECE_WEIGHT;
}

/**
 * Normalize currency amounts to follow BFRPG rules - no fractional pieces allowed
 * Converts fractional amounts to smaller denominations following official exchange rates
 * Example: 69.9 gp becomes 69 gp + 9 sp (0.9 * 10 = 9 sp)
 */
export function normalizeCurrency(currency: CurrencyAmount): CurrencyAmount {
  let result: CurrencyAmount = {
    platinum: currency.platinum || 0,
    gold: currency.gold || 0,
    electrum: currency.electrum || 0,
    silver: currency.silver || 0,
    copper: currency.copper || 0,
  };

  // Maximum iterations to prevent infinite loops during currency normalization
  // 10 iterations is sufficient because BFRPG has 5 currency types maximum,
  // and each iteration can only create one new fractional amount at most
  const MAX_ITERATIONS = 10;
  let iterations = 0;

  // Iteratively normalize until no fractional amounts remain
  while (iterations < MAX_ITERATIONS) {
    const newResult: CurrencyAmount = {
      platinum: 0,
      gold: 0,
      electrum: 0,
      silver: 0,
      copper: 0,
    };

    // Process from highest to lowest denomination to properly handle fractional parts
    const currencyOrder = CURRENCY_ORDER;

    for (const currencyType of currencyOrder) {
      const amount = result[currencyType] || 0;
      const wholePart = Math.floor(amount);
      const fractionalPart = amount - wholePart;

      // Set the whole part
      newResult[currencyType] = wholePart;

      // Convert fractional part to smaller denomination
      if (fractionalPart > 0) {
        switch (currencyType) {
          case "platinum":
            // 1 pp = 5 gp, so fractional pp becomes gp
            newResult.gold =
              (newResult.gold || 0) +
              fractionalPart * CURRENCY_RATES.PLATINUM_TO_GOLD;
            break;
          case "gold":
            // 1 gp = 10 sp, so fractional gp becomes sp
            newResult.silver =
              (newResult.silver || 0) +
              fractionalPart * CURRENCY_RATES.GOLD_TO_SILVER;
            break;
          case "electrum":
            // 1 ep = 5 sp, so fractional ep becomes sp
            newResult.silver =
              (newResult.silver || 0) +
              fractionalPart * CURRENCY_RATES.ELECTRUM_TO_SILVER;
            break;
          case "silver":
            // 1 sp = 10 cp, so fractional sp becomes cp
            newResult.copper =
              (newResult.copper || 0) +
              fractionalPart * CURRENCY_RATES.SILVER_TO_COPPER;
            break;
          case "copper":
            // Copper is the smallest denomination - round to nearest whole
            newResult.copper = Math.round(amount);
            break;
        }
      }
    }

    result = newResult;

    // Check if we still have fractional amounts
    const hasNewFractionalAmounts = Object.values(result).some(
      (amount) => amount % 1 !== 0
    );
    if (!hasNewFractionalAmounts) {
      break;
    }

    iterations++;
  }

  // Final safety check - ensure all amounts are whole numbers
  return {
    platinum: Math.floor(result.platinum || 0),
    gold: Math.floor(result.gold || 0),
    electrum: Math.floor(result.electrum || 0),
    silver: Math.floor(result.silver || 0),
    copper: Math.floor(result.copper || 0),
  };
}

/**
 * Validate that currency follows BFRPG rules (whole numbers only)
 */
export function validateCurrencyAmount(amount: number): number {
  return Math.max(0, Math.floor(amount));
}

/**
 * Check if currency has any fractional amounts (violates BFRPG rules)
 */
export function hasFractionalCurrency(currency: CurrencyAmount): boolean {
  return Object.values(currency).some((amount) => amount && amount % 1 !== 0);
}

/**
 * Update character currency with a new amount for a specific currency type
 */
export function updateCharacterCurrency<T extends { currency: CurrencyAmount }>(
  character: T,
  currencyType: keyof CurrencyAmount,
  newAmount: number
): T {
  const updatedCurrency = {
    ...character.currency,
    [currencyType]: validateCurrencyAmount(newAmount),
  };

  // Normalize to ensure BFRPG compliance
  const normalizedCurrency = normalizeCurrency(updatedCurrency);

  return {
    ...character,
    currency: normalizedCurrency,
  };
}

/**
 * Calculate total currency value in copper pieces
 */
export function getTotalCurrencyValueInCopper(
  currency: CurrencyAmount
): number {
  return (
    (currency.platinum || 0) * CURRENCY_TO_COPPER_RATES.platinum +
    (currency.gold || 0) * CURRENCY_TO_COPPER_RATES.gold +
    (currency.electrum || 0) * CURRENCY_TO_COPPER_RATES.electrum +
    (currency.silver || 0) * CURRENCY_TO_COPPER_RATES.silver +
    (currency.copper || 0) * CURRENCY_TO_COPPER_RATES.copper
  );
}

// ============================================================================
// LEGACY CURRENCY UTILITIES (moved from data.ts)
// ============================================================================

/**
 * Map legacy currency abbreviations to modern CurrencyKey format
 * Note: CurrencyKey values are identical to CurrencyType values for type safety
 */
function mapLegacyCurrency(
  currency: "gp" | "sp" | "cp" | "ep" | "pp"
): CurrencyKey {
  const currencyMap: Record<"gp" | "sp" | "cp" | "ep" | "pp", CurrencyKey> = {
    gp: "gold",
    sp: "silver",
    cp: "copper",
    ep: "electrum",
    pp: "platinum",
  };

  return currencyMap[currency];
}

/**
 * Convert legacy currency abbreviation to gold value
 * Uses type assertion since CurrencyKey and CurrencyType have identical values
 */
export function convertToGoldFromAbbreviation(
  value: number,
  currency: "gp" | "sp" | "cp" | "ep" | "pp"
): number {
  const currencyKey = mapLegacyCurrency(currency);
  // Safe type assertion: CurrencyKey and CurrencyType have identical string values
  return convertCurrency(value, currencyKey as CurrencyType, "gold");
}
