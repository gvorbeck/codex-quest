# Dice Functions Reference

This file documents all functions in `dice.ts` with simple explanations and return values.

## **roller**
- **What it does**: Rolls dice using standard notation like "3d6+2" or "2d20L" (with modifiers)
- **Returns**: A DiceResult object with total, individual rolls, formula, and breakdown

## **parseDiceExpression** (private)
- **What it does**: Parses complex dice expressions with multiple parts and operators
- **Returns**: A ParseResult with total, rolls, and breakdown

## **parseMultiplicationExpression** (private)
- **What it does**: Handles dice expressions with multiplication/division
- **Returns**: A ParseResult with calculated results

## **parseDicePart** (private)
- **What it does**: Parses individual dice parts like "3d6" or "d20K"
- **Returns**: A ParseResult for that dice part

## **rollDie** (private)
- **What it does**: Rolls a single die with specified number of sides
- **Returns**: A number (the roll result)

## **applyModifiers** (private)
- **What it does**: Applies special modifiers like "keep highest", "drop lowest", "exploding dice", etc.
- **Returns**: A ModifierResult with modified rolls and totals

## **rollPercentage**
- **What it does**: Convenience function to roll 1d100
- **Returns**: A number (1-100)

## **randomArrayElement**
- **What it does**: Picks a random item from an array
- **Returns**: A random element from the array

## Supported Modifiers
- **K**: Keep highest rolls
- **KL**: Keep lowest rolls  
- **H**: Drop highest rolls
- **L**: Drop lowest rolls
- **!**: Exploding dice (roll again on max)
- **R**: Reroll specific values

## Notes
- Very comprehensive dice system supporting complex notation
- Handles advanced modifiers for RPG dice rolling
- Could potentially be simplified for basic use cases
- Well-documented with error handling