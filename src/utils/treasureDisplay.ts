import type { TreasureResult } from "./treasureGenerator";
import { COIN_CONFIGS } from "@/constants/treasureTypes";

/**
 * Utility function to render coin display components
 * @param treasure - The treasure result containing coin amounts
 * @returns Array of coin configurations with their values
 */
export function getCoinsToDisplay(treasure: TreasureResult) {
  return COIN_CONFIGS
    .filter(coin => treasure[coin.key] > 0)
    .map(coin => ({
      ...coin,
      amount: treasure[coin.key]
    }));
}

/**
 * Check if treasure has any coins
 * @param treasure - The treasure result to check
 * @returns True if any coin type has a value greater than 0
 */
export function hasCoins(treasure: TreasureResult): boolean {
  return COIN_CONFIGS.some(coin => treasure[coin.key] > 0);
}

/**
 * Get total coin value in gold pieces for sorting/comparison
 * @param treasure - The treasure result to evaluate
 * @returns Total value in gold piece equivalent
 */
export function getTotalCoinValue(treasure: TreasureResult): number {
  const conversionRates = {
    platinum: 10,
    gold: 1,
    electrum: 0.5,
    silver: 0.1,
    copper: 0.01
  };

  return COIN_CONFIGS.reduce((total, coin) => {
    return total + (treasure[coin.key] * conversionRates[coin.key]);
  }, 0);
}