# Character Helpers Functions Reference

This file documents all functions in `characterHelpers.ts` with simple explanations and return values.

## **getCharacterSpellSystemType**
- **What it does**: Looks at a character and figures out what kind of magic they use
- **Returns**: One of these words: "magic-user", "cleric", "custom", or "none"

## **characterHasSpellcasting** 
- **What it does**: Checks if a character can cast any spells at all
- **Returns**: true (yes they can) or false (no they can't)

## **getFirstSpellcastingClass**
- **What it does**: Finds the first class in a character's list that can cast spells
- **Returns**: The name of that class, or null if none can cast spells

## **hasCustomClasses**
- **What it does**: Checks if a character has any custom-made classes (not from the standard game)
- **Returns**: true (yes they have custom classes) or false (no, all standard)

## **isCustomClass**
- **What it does**: Checks if one specific class is custom-made
- **Returns**: true (it's custom) or false (it's standard)

## **getCustomClass**
- **What it does**: Gets the details about a custom class
- **Returns**: An object with the custom class info, or null if not found

## **getClassName**
- **What it does**: Gets the display name of any class (custom or standard)
- **Returns**: A text string with the class name

## **hasClassType**
- **What it does**: Checks if a character has any classes of a specific type (like "magic-user" or "cleric")
- **Returns**: true (yes they do) or false (no they don't)

## **isCustomRace**
- **What it does**: Checks if a character uses a custom race instead of standard ones
- **Returns**: true (custom race) or false (standard race)

## **getPrimaryClassInfo**
- **What it does**: Gets detailed info about a character's main class (their first one)
- **Returns**: An object with class details, or null if no class found

## **canCastSpells**
- **What it does**: Same as characterHasSpellcasting - checks if character can cast spells
- **Returns**: true (can cast) or false (can't cast)

## **getHitDie**
- **What it does**: Finds what dice to roll when the character gains hit points
- **Returns**: A dice string like "1d8" or "1d6"

## **canLevelUp**
- **What it does**: Checks if a character has enough experience points to go up a level
- **Returns**: true (can level up) or false (not enough XP)

## **getSpellLevel**
- **What it does**: Figures out what level a spell is for a specific character's classes
- **Returns**: A number (the spell level)

## **getSpellSlots**
- **What it does**: Calculates how many spells of each level a character can cast per day
- **Returns**: An object showing spell slots by level (like {1: 3, 2: 1} means 3 first-level spells and 1 second-level spell)

## Potential Consolidation Opportunities

- **canCastSpells** and **characterHasSpellcasting** do the same thing - one can be removed
- Multiple functions check for custom classes - could be consolidated
- Spell-related functions might be grouped into a separate utility file