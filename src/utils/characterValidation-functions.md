# Character Validation Functions Reference

This file documents all functions in `characterValidation.ts` with simple explanations and return values.

## **canEquipItem**
- **What it does**: Checks if a character's race allows them to use a specific weapon/equipment
- **Returns**: true (can equip) or false (race prohibits it)

## **isRaceEligible**
- **What it does**: Checks if a character's ability scores meet the requirements for a specific race
- **Returns**: true (meets requirements) or false (doesn't qualify)

## **getEligibleRaces**
- **What it does**: Gets all races a character qualifies for based on ability scores
- **Returns**: An array of Race objects the character can choose

## **hasValidAbilityScores**
- **What it does**: Checks if all ability scores are between 3 and 18
- **Returns**: true (all valid) or false (some are out of range)

## **isCurrentRaceStillValid**
- **What it does**: Checks if a character still qualifies for their current race after ability changes
- **Returns**: true (still valid) or false (no longer qualifies)

## **isCurrentClassStillValid**
- **What it does**: Checks if character's classes are still allowed by their race and content settings
- **Returns**: true (classes still valid) or false (classes need to be cleared)

## **areCurrentSpellsStillValid**
- **What it does**: Checks if character's spells are still valid for their current classes
- **Returns**: true (spells still valid) or false (spells need to be cleared)

## **hasRequiredStartingSpells**
- **What it does**: Checks if spellcasting classes have selected their required starting spells
- **Returns**: true (has required spells) or false (missing required spells)

## **isValidClassCombination**
- **What it does**: Checks if multiple classes can be combined (like fighter/magic-user for elves)
- **Returns**: true (valid combination) or false (invalid combination)

## **cascadeValidateCharacter**
- **What it does**: Validates entire character and clears invalid selections in proper order
- **Returns**: A new character object with invalid selections cleared

## **hasValidHitPoints**
- **What it does**: Checks if character has proper hit points set
- **Returns**: true (has valid HP) or false (HP not set properly)

## Validation Schemas
- **abilityScoreSchema**: Rules for individual ability scores
- **characterNameSchema**: Rules for character names
- **raceSelectionSchema**: Rules for race selection
- **classSelectionSchema**: Rules for class selection
- **characterSchema**: Complete character validation rules

## Notes
- Very complex validation system with cascade effects
- Many interdependent checks that could potentially be simplified
- Handles both standard and custom classes/races
- Some functions have overlapping responsibilities