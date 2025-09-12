# Character Creation Functions Reference

This file documents all functions in `characterCreation.ts` with simple explanations and return values.

## **getEffectiveSpellcastingClass**
- **What it does**: Finds the first spellcasting class from a character's classes and determines if it's standard or custom
- **Returns**: An object with type ("standard" or "custom") and classId, or null if no spellcasting classes

## **hasSpellcastingClass**
- **What it does**: Checks if a character has any classes that can cast spells (uses consolidated detection)
- **Returns**: true (has spellcasting) or false (no spellcasting)

## **getSpellcastingAbilityModifier**
- **What it does**: Gets the relevant ability modifier for spellcasting (Intelligence for arcane, Wisdom for divine)
- **Returns**: A number (the ability modifier)

## **assignStartingCantrips**
- **What it does**: Automatically assigns starting cantrips using 1d4 + ability modifier, following game rules
- **Returns**: An array of Cantrip objects (randomly selected starting cantrips)

## Logic Details

### **Spellcasting Class Priority**
1. Custom classes that use spells (default to arcane/Intelligence)
2. Standard arcane classes (magic-user, etc.) - use Intelligence
3. Standard divine classes (cleric, etc.) - use Wisdom

### **Starting Cantrips Rules**
- Rolls 1d4 + spellcasting ability modifier
- Randomly selects that many cantrips from available options
- Won't override manually selected cantrips
- Returns empty array if no spellcasting classes

## Notes
- Uses consolidated spellcasting detection from characterHelpers
- Follows official game rules for cantrip assignment
- Could potentially be consolidated with other character creation utilities
- Handles both standard and custom spellcasting classes