# GM Binder Utils Functions Reference

This file documents all functions in `gmBinderUtils.ts` with simple explanations and return values.

## **categorizeSpell**
- **What it does**: Sorts a spell into a category based on its level (low/mid/high)
- **Returns**: A text string with the category name

## **categorizeMonster**
- **What it does**: Sorts a monster into a category based on patterns in its name
- **Returns**: A text string with the category name

## **createSearchableText**
- **What it does**: Makes a searchable text string from a monster including all its variant names
- **Returns**: A text string with all names combined

## Notes
- Very specific utility functions for GMBinder categorization
- Simple pattern matching and text processing
- Could be consolidated or made more generic