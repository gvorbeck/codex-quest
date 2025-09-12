# Cantrips Functions Reference

This file documents all functions in `cantrips.ts` with simple explanations and return values.

## **getAvailableCantrips**

- **What it does**: Gets all cantrips/orisons a character can learn based on their classes
- **Returns**: An array of Cantrip objects available to the character

## **getSpellTypeInfo**

- **What it does**: Determines terminology (cantrips vs orisons) and relevant ability score based on character classes
- **Returns**: A SpellTypeInfo object with type names and ability score

## **getCantripOptions**

- **What it does**: Creates options for a Select component, filtering out cantrips the character already knows
- **Returns**: An array of option objects with value and label properties

## Types

### **SpellTypeInfo**

Contains terminology and ability score information:

- **type**: "orisons" or "cantrips"
- **singular**: "orison" or "cantrip"
- **capitalized**: "Orisons" or "Cantrips"
- **capitalizedSingular**: "Orison" or "Cantrip"
- **abilityScore**: "Intelligence", "Wisdom", or "Intelligence/Wisdom"

## Notes

- Handles the distinction between arcane cantrips and divine orisons
- Uses consolidated spellcasting detection from characterHelpers
- Custom spellcasting classes default to arcane (Intelligence-based)
- Could potentially be simplified or consolidated with spell utilities
