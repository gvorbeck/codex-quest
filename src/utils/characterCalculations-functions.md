# Character Calculations Functions Reference

This file documents all functions in `characterCalculations.ts` with simple explanations and return values.

## **isWornArmor**
- **What it does**: Checks if an equipment item is armor that's being worn
- **Returns**: true (it's worn armor) or false (not worn armor)

## **isWornShield**
- **What it does**: Checks if an equipment item is a shield that's being worn
- **Returns**: true (it's a worn shield) or false (not a worn shield)

## **parseShieldBonus** (private)
- **What it does**: Extracts the AC bonus number from shield AC strings like "+1" or "+2"
- **Returns**: A number (the shield bonus, or 0 if invalid)

## **calculateArmorClass**
- **What it does**: Calculates a character's total AC based on worn armor and shields
- **Returns**: A number (the total armor class)

## **calculateMovementRate**
- **What it does**: Determines how fast a character moves based on their armor
- **Returns**: A text string like "40'" or "30'" (movement rate)

## **calculateModifier**
- **What it does**: Converts ability scores (like 15 Strength) to modifiers (like +1)
- **Returns**: A number (the modifier, typically -3 to +3)

## **formatModifier**
- **What it does**: Adds proper + or - signs to modifiers for display
- **Returns**: A text string like "+2" or "-1"

## **getAbilityScoreCategory**
- **What it does**: Categorizes ability scores as highest, lowest, or normal compared to other scores
- **Returns**: One of these words: "highest", "lowest", or "normal"

## **cleanEquipmentArray**
- **What it does**: Removes equipment items that have 0 or negative amounts
- **Returns**: A filtered array of equipment with only positive amounts

## **ensureEquipmentAmount**
- **What it does**: Makes sure equipment has at least an amount of 1
- **Returns**: An equipment object with amount guaranteed to be at least 1

## Notes
- Core character stat calculations
- AC calculation is complex but well-documented
- Several utility functions for equipment management
- Movement calculation is simplified (doesn't include full encumbrance rules yet)