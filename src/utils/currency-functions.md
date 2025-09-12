# Currency Functions Reference

This file documents all functions in `currency.ts` with simple explanations and return values.

## **convertCurrency**
- **What it does**: Converts any currency type to any other currency type (like 10 gold to 100 silver)
- **Returns**: A number (the converted amount)

## **convertToGold**
- **What it does**: Converts any currency to gold pieces
- **Returns**: A number (amount in gold)

## **convertToCopper**
- **What it does**: Converts any currency to copper pieces
- **Returns**: A number (amount in copper)

## **mapLegacyCurrency** (private)
- **What it does**: Converts old abbreviations (gp, sp, cp) to new format (gold, silver, copper)
- **Returns**: The new currency format

## **convertToGoldFromAbbreviation**
- **What it does**: Converts currency using old abbreviation format to gold
- **Returns**: A number (amount in gold)

## **convertToWholeCoins**
- **What it does**: Takes fractional currency amounts and breaks them down into whole coins
- **Returns**: A currency object with only whole numbers

## **updateCharacterCurrency**
- **What it does**: Updates a specific currency amount for a character
- **Returns**: A new character object with updated currency

## **getTotalCurrencyValueInCopper**
- **What it does**: Adds up all a character's currency and returns the total value in copper
- **Returns**: A number (total value in copper)

## **getTotalCurrencyValueInGold**
- **What it does**: Adds up all a character's currency and returns the total value in gold
- **Returns**: A number (total value in gold)

## **cleanFractionalCurrency**
- **What it does**: Fixes characters that have fractional currency amounts by converting to whole coins
- **Returns**: A currency object with only whole numbers

## Notes
- Comprehensive currency system with lots of conversion functions
- Some functions might be redundant or could be simplified
- Handles both new and legacy currency formats