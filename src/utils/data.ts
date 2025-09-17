/**
 * Data utilities - consolidated from currency.ts, sanitization.ts, logger.ts, serviceErrorHandler.ts, and gmBinderUtils.ts
 * Contains currency conversion, data sanitization, logging, error handling, and GMBinder utilities
 */
import {
  CURRENCY_TO_COPPER_RATES,
  SPELL_CATEGORIES,
  SPELL_LEVEL_THRESHOLDS,
  MONSTER_CATEGORIES,
  MONSTER_NAME_PATTERNS,
} from "@/constants";
import type {
  CurrencyKey,
  Monster,
  Character,
  Spell,
  ServiceErrorOptions,
} from "@/types";

// ============================================================================
// LOGGING
// ============================================================================

interface Logger {
  error: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

const isDevelopment = import.meta.env.DEV;

const createLogger = (): Logger => {
  if (!isDevelopment) {
    // In production, only log errors
    return {
      error: (message: string, ...args: unknown[]) =>
        // eslint-disable-next-line no-console
        console.error(message, ...args),
      warn: () => {}, // Silent in production
      info: () => {}, // Silent in production
      debug: () => {}, // Silent in production
    };
  }

  // In development, log everything
  return {
    error: (message: string, ...args: unknown[]) =>
      // eslint-disable-next-line no-console
      console.error(message, ...args),
    warn: (message: string, ...args: unknown[]) =>
      // eslint-disable-next-line no-console
      console.warn(message, ...args),
    info: (message: string, ...args: unknown[]) =>
      // eslint-disable-next-line no-console
      console.log(message, ...args),
    debug: (message: string, ...args: unknown[]) =>
      // eslint-disable-next-line no-console
      console.debug(message, ...args),
  };
};

export const logger = createLogger();

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class ServiceError extends Error {
  public readonly action: string;
  public readonly context: Record<string, unknown> | undefined;
  public readonly originalError: unknown;

  constructor(
    action: string,
    originalError: unknown,
    context?: Record<string, unknown>,
    fallbackMessage?: string
  ) {
    const message = fallbackMessage || `Failed to ${action}`;
    super(message);
    this.name = "ServiceError";
    this.action = action;
    this.originalError = originalError;
    this.context = context;
  }
}

export function handleServiceError(
  error: unknown,
  options: ServiceErrorOptions
): never {
  const { action, context, fallbackMessage } = options;

  logger.error(`Error ${action}:`, error);

  throw new ServiceError(action, error, context, fallbackMessage);
}

export function handleServiceErrorAsync<T>(
  asyncFn: () => Promise<T>,
  options: ServiceErrorOptions
): Promise<T> {
  return asyncFn().catch((error) => {
    handleServiceError(error, options);
  });
}

/**
 * Extracts error message from unknown error type
 * Provides consistent error handling across components
 */
export function getErrorMessage(
  error: unknown,
  fallbackMessage?: string
): string | null {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === "string") {
    return error;
  }
  
  return fallbackMessage || null;
}

// ============================================================================
// DATA SANITIZATION
// ============================================================================

function stripHtml(html: string): string {
  // Remove HTML tags using regex (safer than innerHTML)
  return html.replace(/<[^>]*>/g, "");
}

export function sanitizeCharacterName(name: string): string {
  // Remove any HTML tags first
  const plainText = stripHtml(name);

  // Allow only letters, spaces, hyphens, apostrophes, and periods
  // This matches the validation schema pattern
  return plainText.replace(/[^a-zA-Z\s\-'.]/g, "").trim();
}

// ============================================================================
// CURRENCY UTILITIES
// ============================================================================

export function validateCurrencyAmount(amount: number): number {
  return Math.max(0, Math.floor(amount));
}

const conversionRateCache = new Map<string, number>();

function createCacheKey(
  fromCurrency: CurrencyKey,
  toCurrency: CurrencyKey
): string {
  return `${fromCurrency}->${toCurrency}`;
}

function getConversionRate(
  fromCurrency: CurrencyKey,
  toCurrency: CurrencyKey
): number {
  if (fromCurrency === toCurrency) return 1;

  const cacheKey = createCacheKey(fromCurrency, toCurrency);

  if (conversionRateCache.has(cacheKey)) {
    return conversionRateCache.get(cacheKey)!;
  }

  // Calculate rate: convert to copper first, then to target currency
  const rate =
    CURRENCY_TO_COPPER_RATES[fromCurrency] /
    CURRENCY_TO_COPPER_RATES[toCurrency];
  conversionRateCache.set(cacheKey, rate);

  return rate;
}

export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyKey,
  toCurrency: CurrencyKey
): number {
  if (amount < 0) {
    throw new Error("Currency amounts cannot be negative");
  }

  if (!CURRENCY_TO_COPPER_RATES[fromCurrency]) {
    throw new Error(`Invalid source currency: ${fromCurrency}`);
  }

  if (!CURRENCY_TO_COPPER_RATES[toCurrency]) {
    throw new Error(`Invalid target currency: ${toCurrency}`);
  }

  if (fromCurrency === toCurrency) return amount;

  // Use memoized conversion rate
  const conversionRate = getConversionRate(fromCurrency, toCurrency);
  return amount * conversionRate;
}

export function convertToGold(
  amount: number,
  fromCurrency: CurrencyKey
): number {
  return convertCurrency(amount, fromCurrency, "gold");
}

export function convertToCopper(
  amount: number,
  fromCurrency: CurrencyKey
): number {
  return convertCurrency(amount, fromCurrency, "copper");
}

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

export function convertToGoldFromAbbreviation(
  value: number,
  currency: "gp" | "sp" | "cp" | "ep" | "pp"
): number {
  return convertToGold(value, mapLegacyCurrency(currency));
}

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
  let remainingCopper = Math.round(
    fractionalPart * CURRENCY_TO_COPPER_RATES[currency]
  );

  // Convert copper to larger denominations, working from largest to smallest
  // Skip platinum and electrum for simplicity (convert to gold, silver, copper only)
  const denominations = [
    { key: "gold" as const, copperValue: CURRENCY_TO_COPPER_RATES.gold },
    { key: "silver" as const, copperValue: CURRENCY_TO_COPPER_RATES.silver },
    { key: "copper" as const, copperValue: CURRENCY_TO_COPPER_RATES.copper },
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

export function updateCharacterCurrency(
  character: Character,
  currencyType: CurrencyKey,
  newAmount: number
): Character {
  return {
    ...character,
    currency: {
      ...character.currency,
      [currencyType]: validateCurrencyAmount(newAmount),
    },
  };
}

export function getTotalCurrencyValueInCopper(
  currency: Character["currency"]
): number {
  let total = 0;

  for (const [currencyType, amount] of Object.entries(currency)) {
    if (amount && CURRENCY_TO_COPPER_RATES[currencyType as CurrencyKey]) {
      total += amount * CURRENCY_TO_COPPER_RATES[currencyType as CurrencyKey];
    }
  }

  return total;
}

export function getTotalCurrencyValueInGold(
  currency: Character["currency"]
): number {
  const totalCopper = getTotalCurrencyValueInCopper(currency);
  return totalCopper / CURRENCY_TO_COPPER_RATES.gold;
}

export function hasFractionalCurrency(
  currency: Character["currency"]
): boolean {
  return Object.values(currency).some(
    (amount) => amount && !Number.isInteger(amount)
  );
}

export function cleanFractionalCurrency(
  currency: Character["currency"]
): Character["currency"] {
  const cleaned: Character["currency"] = {
    platinum: 0,
    gold: 0,
    electrum: 0,
    silver: 0,
    copper: 0,
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

// ============================================================================
// GMBINDER UTILITIES
// ============================================================================

export function categorizeSpell(spell: Spell): string {
  const levels = Object.values(spell.level).filter((level) => level !== null);
  const maxLevel = Math.max(...(levels as number[]));

  if (maxLevel <= SPELL_LEVEL_THRESHOLDS.LOW_MAX) {
    return SPELL_CATEGORIES.LOW_LEVEL;
  }

  if (maxLevel <= SPELL_LEVEL_THRESHOLDS.MID_MAX) {
    return SPELL_CATEGORIES.MID_LEVEL;
  }

  if (maxLevel <= SPELL_LEVEL_THRESHOLDS.HIGH_5_6_MAX) {
    return SPELL_CATEGORIES.HIGH_LEVEL_5_6;
  }

  return SPELL_CATEGORIES.HIGH_LEVEL_7_9;
}

export function categorizeMonster(monster: Monster): string {
  const name = monster.name.toLowerCase();

  // Check each category's patterns
  for (const [category, patterns] of Object.entries(MONSTER_NAME_PATTERNS)) {
    if (patterns.some((pattern) => name.includes(pattern))) {
      return category;
    }
  }

  // Default category if no patterns match
  return MONSTER_CATEGORIES.MISCELLANEOUS;
}

export function createSearchableText(monster: Monster): string {
  return [
    monster.name,
    ...(monster.variants || [])
      .map(([variantName]) => variantName)
      .filter(Boolean),
  ]
    .join(" ")
    .toLowerCase();
}
