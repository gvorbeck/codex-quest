/**
 * Currency utility functions for handling conversions and calculations
 * Based on official Basic Fantasy Role-Playing Game rules
 */

import type { Character } from "@/types/character";
import { 
  CURRENCY_TO_COPPER_RATES, 
  type CurrencyKey, 
  validateCurrencyAmount 
} from "@/constants/currency";

/**
 * Universal currency converter - converts any currency to any other currency
 * @param amount - The amount to convert
 * @param fromCurrency - The source currency type
 * @param toCurrency - The target currency type
 * @returns The converted amount
 * @throws Error if invalid currency types or negative amounts
 */
export function convertCurrency(
  amount: number, 
  fromCurrency: CurrencyKey, 
  toCurrency: CurrencyKey
): number {
  if (amount < 0) {
    throw new Error('Currency amounts cannot be negative');
  }
  
  if (!CURRENCY_TO_COPPER_RATES[fromCurrency]) {
    throw new Error(`Invalid source currency: ${fromCurrency}`);
  }
  
  if (!CURRENCY_TO_COPPER_RATES[toCurrency]) {
    throw new Error(`Invalid target currency: ${toCurrency}`);
  }
  
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to copper first, then to target currency
  const copperAmount = amount * CURRENCY_TO_COPPER_RATES[fromCurrency];
  return copperAmount / CURRENCY_TO_COPPER_RATES[toCurrency];
}

/**
 * Converts any currency to gold pieces for calculations
 * @param amount - The currency amount
 * @param fromCurrency - The source currency type
 * @returns The amount converted to gold pieces
 */
export function convertToGold(amount: number, fromCurrency: CurrencyKey): number {
  return convertCurrency(amount, fromCurrency, 'gold');
}

/**
 * Converts any currency to copper pieces for calculations
 * @param amount - The currency amount
 * @param fromCurrency - The source currency type
 * @returns The amount converted to copper pieces
 */
export function convertToCopper(amount: number, fromCurrency: CurrencyKey): number {
  return convertCurrency(amount, fromCurrency, 'copper');
}

/**
 * Converts legacy currency abbreviations to new CurrencyKey format
 */
function mapLegacyCurrency(currency: "gp" | "sp" | "cp" | "ep" | "pp"): CurrencyKey {
  const currencyMap: Record<"gp" | "sp" | "cp" | "ep" | "pp", CurrencyKey> = {
    "gp": "gold",
    "sp": "silver", 
    "cp": "copper",
    "ep": "electrum",
    "pp": "platinum"
  };
  
  return currencyMap[currency];
}

/**
 * Converts any currency to gold pieces using legacy abbreviation format
 * Used by equipment system that stores currency as abbreviations
 */
export function convertToGoldFromAbbreviation(
  value: number,
  currency: "gp" | "sp" | "cp" | "ep" | "pp"
): number {
  return convertToGold(value, mapLegacyCurrency(currency));
}

/**
 * Converts fractional currency amounts to whole coins by breaking them down
 * into smaller denominations
 * @param amount - The currency amount (may be fractional)
 * @param currency - The currency type
 * @param existingCurrency - Current character currency to add to
 * @returns Updated currency object with only whole coins
 */
export function convertToWholeCoins(
  amount: number,
  currency: CurrencyKey,
  existingCurrency: Character["currency"]
): Partial<Character["currency"]> {
  // If amount is already a whole number, just validate and return
  if (Number.isInteger(amount)) {
    return { [currency]: validateCurrencyAmount(amount) };
  }

  const wholePart = Math.floor(amount);
  const fractionalPart = amount - wholePart;
  const result: Partial<Character["currency"]> = {};

  // Set the whole part
  if (wholePart > 0) {
    result[currency] = wholePart;
  }

  // Convert fractional part to copper, then break down to larger denominations
  let remainingCopper = Math.round(fractionalPart * CURRENCY_TO_COPPER_RATES[currency]);

  // Convert copper to larger denominations, working from largest to smallest
  // Skip platinum and electrum for simplicity (convert to gold, silver, copper only)
  const denominations = [
    { key: 'gold' as const, copperValue: CURRENCY_TO_COPPER_RATES.gold },
    { key: 'silver' as const, copperValue: CURRENCY_TO_COPPER_RATES.silver },
    { key: 'copper' as const, copperValue: CURRENCY_TO_COPPER_RATES.copper }
  ];

  for (const { key, copperValue } of denominations) {
    if (remainingCopper >= copperValue) {
      const coins = Math.floor(remainingCopper / copperValue);
      if (coins > 0) {
        result[key] = (existingCurrency[key] || 0) + coins;
        remainingCopper -= coins * copperValue;
      }
    }
  }

  return result;
}


/**
 * Updates a character's currency amount for a specific currency type
 * @param character - The character object
 * @param currencyType - The type of currency to update
 * @param newAmount - The new currency amount
 * @returns Updated character with new currency amount
 */
export function updateCharacterCurrency(
  character: Character,
  currencyType: CurrencyKey,
  newAmount: number
): Character {
  return {
    ...character,
    currency: {
      ...character.currency,
      [currencyType]: validateCurrencyAmount(newAmount)
    },
  };
}


/**
 * Calculates the total value of all currency in copper pieces
 * @param currency - The character's currency object
 * @returns Total value in copper pieces
 */
export function getTotalCurrencyValueInCopper(currency: Character["currency"]): number {
  let total = 0;
  
  for (const [currencyType, amount] of Object.entries(currency)) {
    if (amount && CURRENCY_TO_COPPER_RATES[currencyType as CurrencyKey]) {
      total += amount * CURRENCY_TO_COPPER_RATES[currencyType as CurrencyKey];
    }
  }
  
  return total;
}

/**
 * Calculates the total value of all currency in gold pieces
 * @param currency - The character's currency object
 * @returns Total value in gold pieces
 */
export function getTotalCurrencyValueInGold(currency: Character["currency"]): number {
  const totalCopper = getTotalCurrencyValueInCopper(currency);
  return totalCopper / CURRENCY_TO_COPPER_RATES.gold;
}

/**
 * Checks if a character's currency contains any fractional amounts
 * @param currency - The character's currency object
 * @returns True if any currency amount is fractional, false otherwise
 */
export function hasFractionalCurrency(currency: Character["currency"]): boolean {
  return Object.values(currency).some(amount => amount && !Number.isInteger(amount));
}

/**
 * Cleans up fractional currency amounts by converting them to whole coins
 * Used for data migration to fix existing characters with fractional currency
 * @param currency - The character's currency object
 * @returns Currency object with only whole coins
 */
export function cleanFractionalCurrency(currency: Character["currency"]): Character["currency"] {
  const cleaned: Character["currency"] = {
    platinum: 0,
    gold: 0,
    electrum: 0,
    silver: 0,
    copper: 0
  };
  
  // Process each currency type, converting fractional amounts
  for (const [currencyKey, amount] of Object.entries(currency)) {
    if (amount && amount > 0) {
      const key = currencyKey as CurrencyKey;
      const wholeCoins = convertToWholeCoins(amount, key, cleaned);
      
      // Merge the results
      for (const [resultKey, resultAmount] of Object.entries(wholeCoins)) {
        if (resultAmount) {
          cleaned[resultKey as CurrencyKey] += resultAmount;
        }
      }
    }
  }
  
  return cleaned;
}
