# Hit Dice Functions Reference

This file documents all functions in `hitDice.ts` with simple explanations and return values.

## **calculateHitDie**
- **What it does**: Figures out what dice a character should roll for hit points, including racial modifications
- **Returns**: A dice string like "1d6" or null if no class

## **applyRacialHitDiceModifications**
- **What it does**: Takes a base hit die and applies racial bonuses/restrictions
- **Returns**: A modified dice string

## **applyHitDiceRestriction** (private)
- **What it does**: Caps the hit die to a maximum size (like d6 max instead of d8)
- **Returns**: A restricted dice string

## **applyHitDiceDecrease** (private)
- **What it does**: Lowers the hit die size by one step (d8→d6, d6→d4, etc.)
- **Returns**: A decreased dice string

## **applyHitDiceIncrease** (private)
- **What it does**: Raises the hit die size by one step (d6→d8, d8→d10, etc.)
- **Returns**: An increased dice string

## **getRacialModificationInfo**
- **What it does**: Gets detailed info about what racial effects changed the hit die
- **Returns**: An object with modification details, or null if no changes

## Notes
- Complex racial modification system with multiple types of effects
- Could potentially be simplified or the racial effects could be stored differently
- Handles custom classes separately from standard classes