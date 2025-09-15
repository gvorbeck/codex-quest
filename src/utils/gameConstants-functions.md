# Game Constants Functions Reference

This file documents all constants in `gameConstants.ts` with simple explanations.

## Constants Groups

### **GAME_MECHANICS**
- **DEFAULT_UNARMORED_AC**: 11 (base armor class with no armor)
- **DEFAULT_MOVEMENT_RATE**: "40'" (movement per round unencumbered)  
- **LEATHER_ARMOR_MOVEMENT**: "30'" (movement in leather armor)
- **METAL_ARMOR_MOVEMENT**: "20'" (movement in metal armor)
- **ABILITY_MODIFIERS**: Array of ability score ranges and their modifiers
- **DEFAULT_HIGH_MODIFIER**: 3 (modifier for scores above 17)
- **STARTING_GOLD_DICE**: "3d6" (dice to roll for starting gold)
- **STARTING_GOLD_MULTIPLIER**: 10 (multiply dice result by this)

### **DICE_LIMITS**
- **MAX_DICE_COUNT**: 100 (maximum dice that can be rolled at once)
- **MIN_DICE_SIDES**: 1 (minimum sides a die can have)

### **ENCUMBRANCE**
- **GOLD_PIECE_WEIGHT**: 1/20 (weight of one gold piece in pounds)
- **COINS_PER_CUBIC_INCH**: 10 (for storage space calculations)

## Backward Compatibility Exports
Individual constants are also exported separately for older code that imported them directly.

## Notes
- This is purely a constants file with no functions
- Centralizes game mechanics values that were scattered across multiple files
- Based on Basic Fantasy Role-Playing Game official rules
- Could potentially be simplified by removing individual exports if all code uses the grouped constants