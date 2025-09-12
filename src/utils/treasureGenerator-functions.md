# Treasure Generator Functions Reference

This file documents all functions in `treasureGenerator.ts` with simple explanations and return values.

## **generateTreasure** (re-exported)
- **What it does**: Creates random treasure based on treasure type and level
- **Returns**: A treasure result object with coins, gems, magic items, etc.

## **formatTreasureResult** (re-exported)
- **What it does**: Formats treasure results for display
- **Returns**: A formatted string or object for showing treasure

## Notes
- This is just a re-export file that imports functions from "./treasure"
- The actual implementation is in the treasure module
- Simple wrapper that could be eliminated by importing directly from the source