# Monster To Combatant Functions Reference

This file documents all functions in `monsterToCombatant.ts` with simple explanations and return values.

## **parseArmorClass**
- **What it does**: Extracts a number from an armor class string like "14" or "17 (s)"
- **Returns**: A number (the AC value, or 11 if it can't parse)

## **monsterToCombatant**
- **What it does**: Converts a monster from the monster database into a combatant for combat tracking
- **Returns**: A GameCombatant object with name, AC, and initiative

## **getMonsterVariantName**
- **What it does**: Gets the display name for a specific monster variant
- **Returns**: A text string with the monster name (and variant name if applicable)

## Notes
- Handles monsters with multiple variants
- Simple conversion utility
- Could potentially be simplified or merged with combat utilities