# Treasure Display Functions Reference

This file documents all functions in `treasureDisplay.ts` with simple explanations and return values.

## **getCoinsToDisplay**
- **What it does**: Gets a list of coin types that have positive amounts for display
- **Returns**: An array of coin configurations with their amounts

## **hasCoins**
- **What it does**: Checks if treasure has any coins at all
- **Returns**: true (has coins) or false (no coins)

## **getTotalCoinValue**
- **What it does**: Calculates the total value of all coins in gold piece equivalent
- **Returns**: A number (total value in gold pieces)

## Notes
- Simple utility functions for treasure display
- Uses currency conversion functions from currency.ts
- Could potentially be consolidated with other display utilities