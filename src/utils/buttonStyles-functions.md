# Button Styles Functions Reference

This file documents all functions in `buttonStyles.ts` with simple explanations and return values.

## **createButtonStyles**
- **What it does**: Creates CSS classes for buttons, with different styles for regular buttons vs FAB (floating action buttons)
- **Returns**: An object with base styles, variant styles, and size styles

## **combineButtonStyles**
- **What it does**: Takes different style arrays and combines them into one CSS class string
- **Returns**: A text string with all CSS classes combined

## Notes
- Complex styling system for buttons
- Handles both regular and FAB button variations
- Lots of hardcoded CSS classes that could potentially be simplified
- Creates shadows, hover effects, and different button variants