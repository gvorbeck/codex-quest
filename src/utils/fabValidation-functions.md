# FAB Validation Functions Reference

This file documents all functions in `fabValidation.ts` with simple explanations and return values.

## **validateFABProps**
- **What it does**: Checks if floating action button props are valid and creates warnings/errors
- **Returns**: An object with validation results (isValid, warnings, errors)

## **logValidationResults**
- **What it does**: Prints validation warnings and errors to the console in development mode
- **Returns**: Nothing (void)

## **createFallbackProps**
- **What it does**: Takes broken props and fills in missing values with safe defaults
- **Returns**: A new props object with fallbacks applied

## Notes
- Development-time validation system for FAB components
- Could be simplified or the validation could be moved into the component itself
- Specific to floating action buttons only