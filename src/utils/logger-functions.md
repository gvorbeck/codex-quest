# Logger Functions Reference

This file documents all functions in `logger.ts` with simple explanations and return values.

## **createLogger**
- **What it does**: Creates a logging system that behaves differently in development vs production
- **Returns**: An object with 4 logging functions (error, warn, info, debug)

## **logger.error**
- **What it does**: Always prints error messages to the console
- **Returns**: Nothing (void)

## **logger.warn**
- **What it does**: Prints warning messages in development only, silent in production
- **Returns**: Nothing (void)

## **logger.info**
- **What it does**: Prints info messages in development only, silent in production
- **Returns**: Nothing (void)

## **logger.debug**
- **What it does**: Prints debug messages in development only, silent in production
- **Returns**: Nothing (void)

## Notes
- Very simple logging utility
- Production only shows errors, development shows everything
- Could potentially be consolidated or replaced with existing console methods