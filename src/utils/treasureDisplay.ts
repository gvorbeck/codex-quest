import type { TreasureResult } from "./treasureGenerator";
import { convertToGold } from "@/utils/currency";
import { CURRENCY_UI_CONFIG, COIN_CONFIGS } from "@/constants";

/**
 * Utility function to render coin display components
 * @param treasure - The treasure result containing coin amounts
 * @returns Array of coin configurations with their values
 */
export function getCoinsToDisplay(treasure: TreasureResult) {
  return COIN_CONFIGS.filter((coin) => treasure[coin.key] > 0).map((coin) => ({
    ...coin,
    amount: treasure[coin.key],
  }));
}

/**
 * Check if treasure has any coins
 * @param treasure - The treasure result to check
 * @returns True if any coin type has a value greater than 0
 */
export function hasCoins(treasure: TreasureResult): boolean {
  return COIN_CONFIGS.some((coin) => treasure[coin.key] > 0);
}

/**
 * Get total coin value in gold pieces for sorting/comparison
 * Uses consolidated currency conversion logic from currency utility
 * @param treasure - The treasure result to evaluate
 * @returns Total value in gold piece equivalent
 */
export function getTotalCoinValue(treasure: TreasureResult): number {
  return CURRENCY_UI_CONFIG.reduce((total, coin) => {
    const amount = treasure[coin.key];
    return amount > 0 ? total + convertToGold(amount, coin.key) : total;
  }, 0);
}
