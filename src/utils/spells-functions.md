# Spells Functions Reference

This file documents all functions in `spells.ts` with simple explanations and return values.

## **getFirstLevelSpellsForClass**
- **What it does**: Gets all 1st level spells available to a specific class (excludes Read Magic for magic-users)
- **Returns**: A Promise with an array of Spell objects

## **getAllSpellsForCustomClass**
- **What it does**: Gets all spells of all levels for custom classes
- **Returns**: A Promise with an array of all Spell objects

## **characterHasSpellcasting** (re-exported)
- **What it does**: Checks if a character can cast spells (re-exported from characterHelpers)
- **Returns**: true (can cast) or false (cannot cast)

## **getFirstSpellcastingClass** (re-exported)
- **What it does**: Gets the first spellcasting class from character's classes (re-exported from characterHelpers)
- **Returns**: A string with class ID, or null if none

## Notes
- Mix of spell loading functions and re-exports
- Uses async data loading from services
- Could be consolidated or the re-exports could be handled differently