# Combat Utils Functions Reference

This file documents all functions in `combatUtils.ts` with simple explanations and return values.

## **calculateCombatantAC**
- **What it does**: Figures out a combatant's armor class from various possible data sources
- **Returns**: A number (the AC value, or 10 as default)

## **normalizeCombatantHP**
- **What it does**: Takes hit point data in different formats and standardizes it to current/max format
- **Returns**: An object with current and max HP numbers

## **calculateDexModifier**
- **What it does**: Gets the dexterity modifier for a character from various possible data sources
- **Returns**: A number (the dex modifier, or 0 as default)

## **sortCombatantsByInitiative**
- **What it does**: Sorts a list of combatants by their initiative rolls (highest first)
- **Returns**: A new array of combatants in initiative order

## **rollInitiative**
- **What it does**: Rolls a random initiative value (1d6 for Basic Fantasy)
- **Returns**: A number (1-6)

## **clearCorruptedCombatData**
- **What it does**: Removes broken combat data from localStorage
- **Returns**: Nothing (void)

## Notes
- Complex data normalization functions for combat system
- Handles multiple data formats from different sources
- Could potentially be simplified by standardizing data formats earlier in the pipeline