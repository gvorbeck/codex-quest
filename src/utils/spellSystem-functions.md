# Spell System Functions Reference

This file documents all functions in `spellSystem.ts` with simple explanations and return values.

## **calculateSpellSuccessRate**
- **What it does**: Calculates the percentage chance a spell will succeed based on caster level, intelligence, and spell level
- **Returns**: A number (percentage from 5 to 95)

## **calculateSpellCost**
- **What it does**: Figures out how much gold it costs to create a spell
- **Returns**: A number (cost in gold pieces)

## **calculateSpellTime**
- **What it does**: Calculates how many days it takes to create a spell
- **Returns**: A number (days required)

## **rollForEncounter**
- **What it does**: Rolls to see if a random encounter happens (1 in 6 chance)
- **Returns**: true (encounter happens) or false (no encounter)

## **getRandomTableResult**
- **What it does**: Picks a random item from a table/array using d12 rules
- **Returns**: A random item from the table, or null if empty

## **formatSpellLevel**
- **What it does**: Formats a spell level number with proper suffix (1st, 2nd, 3rd, 4th, etc.)
- **Returns**: A text string like "1st" or "3rd"

## **parseCreatureName**
- **What it does**: Cleans up creature names by removing special formatting
- **Returns**: A cleaned creature name string

## **generateDefaultAC**
- **What it does**: Creates a random armor class for encounters (AC 13-16)
- **Returns**: A number (the armor class)

## **delay**
- **What it does**: Creates a delay for better user experience timing
- **Returns**: A Promise that resolves after the specified time

## Notes
- Mix of spell-related and encounter-related functions that could be separated
- Some duplication with encounterUtils.ts functions
- Complex spell calculation system that might be over-engineered for the use case