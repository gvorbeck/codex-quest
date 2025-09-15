# Encounter Utils Functions Reference

This file documents all functions in `encounterUtils.ts` with simple explanations and return values.

## **rollForEncounter**
- **What it does**: Rolls a d6 to check if a random encounter happens (1 = encounter)
- **Returns**: true (encounter happens) or false (no encounter)

## **getRandomTableResult**
- **What it does**: Picks a random item from an encounter table
- **Returns**: A random item from the table, or null if table is empty

## **parseCreatureName**
- **What it does**: Removes special notations (like asterisks) from creature names
- **Returns**: A cleaned creature name string

## **generateDefaultAC**
- **What it does**: Creates a random armor class for creatures (AC 10-18)
- **Returns**: A number (the armor class)

## **delay**
- **What it does**: Creates a delay for better user experience timing
- **Returns**: A Promise that resolves after the specified time

## **createCombatantFromEncounter**
- **What it does**: Takes an encounter result and creates a combatant for combat tracking
- **Returns**: A GameCombatant object with name, AC, and default initiative

## Notes
- Some duplication with spellSystem.ts functions
- Simple encounter generation utilities
- Could be consolidated with other encounter-related functions