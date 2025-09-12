import { rollPercentage, roller } from "../dice";

interface CurrencyConfig {
  chance?: number;
  amount: string;
}

interface CurrencyGenerationResult {
  amount: number;
  breakdown: string;
}

/**
 * Generates currency amount based on configuration
 * Handles all treasure generation patterns: lair, individual, and unguarded
 */
export function generateCurrency(
  config: CurrencyConfig,
  currencyName: string,
  isRequired = false
): CurrencyGenerationResult | null {
  const result: CurrencyGenerationResult = {
    amount: 0,
    breakdown: ""
  };

  // Skip if amount is "0"
  if (config.amount === "0") {
    return null;
  }

  // Check if we should generate based on chance or requirement
  const shouldGenerate = isRequired || 
    !config.chance || 
    rollPercentage() <= config.chance;

  if (!shouldGenerate) {
    return null;
  }

  // Handle special multiplier cases (x10)
  let diceFormula = config.amount;
  let multiplier = 1;
  
  if (diceFormula.includes('x10')) {
    diceFormula = diceFormula.replace('x10', '');
    multiplier = 10;
  }

  // Generate the amount
  result.amount = roller(diceFormula).total * multiplier;
  result.breakdown = `${currencyName}: ${result.amount} (${config.amount})`;

  return result;
}

/**
 * Generates all currency types for a treasure configuration
 */
export function generateAllCurrency(
  config: {
    copper: CurrencyConfig;
    silver: CurrencyConfig;
    electrum: CurrencyConfig;
    gold: CurrencyConfig;
    platinum: CurrencyConfig;
  },
  result: {
    copper: number;
    silver: number;
    electrum: number;
    gold: number;
    platinum: number;
    breakdown: string[];
  }
): void {
  const currencies = [
    { name: "Copper", key: "copper" as const, config: config.copper },
    { name: "Silver", key: "silver" as const, config: config.silver },
    { name: "Electrum", key: "electrum" as const, config: config.electrum },
    { name: "Gold", key: "gold" as const, config: config.gold },
    { name: "Platinum", key: "platinum" as const, config: config.platinum }
  ];

  for (const currency of currencies) {
    const generated = generateCurrency(currency.config, currency.name);
    if (generated) {
      result[currency.key] = generated.amount;
      result.breakdown.push(generated.breakdown);
    }
  }
}

/**
 * Generates currency with individual treasure logic (handles optional chance)
 */
export function generateIndividualCurrency(
  config: {
    copper: { amount: string; chance?: number };
    silver: { amount: string; chance?: number };
    electrum: { amount: string; chance?: number };
    gold: { amount: string; chance?: number };
    platinum: { amount: string; chance?: number };
  },
  result: {
    copper: number;
    silver: number;
    electrum: number;
    gold: number;
    platinum: number;
    breakdown: string[];
  }
): void {
  const currencies = [
    { name: "Copper", key: "copper" as const, config: config.copper },
    { name: "Silver", key: "silver" as const, config: config.silver },
    { name: "Electrum", key: "electrum" as const, config: config.electrum },
    { name: "Gold", key: "gold" as const, config: config.gold },
    { name: "Platinum", key: "platinum" as const, config: config.platinum }
  ];

  for (const currency of currencies) {
    // Individual treasures are required unless they have a chance specified
    const isRequired = !currency.config.chance;
    const generated = generateCurrency(currency.config, currency.name, isRequired);
    if (generated) {
      result[currency.key] = generated.amount;
      result.breakdown.push(generated.breakdown);
    }
  }
}