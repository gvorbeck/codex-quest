# Service Error Handler Functions Reference

This file documents all functions in `serviceErrorHandler.ts` with simple explanations and return values.

## **ServiceError (constructor)**
- **What it does**: Creates a custom error object with extra info for debugging
- **Returns**: A new ServiceError object

## **handleServiceError**
- **What it does**: Logs an error and then throws a new ServiceError
- **Returns**: Never returns (always throws an error)

## **handleServiceErrorAsync**
- **What it does**: Wraps an async function and handles any errors that happen
- **Returns**: A Promise that either succeeds or throws a ServiceError

## Notes
- Simple error handling wrapper system
- Adds consistent logging and error formatting
- Could potentially be simplified or the logic could be moved inline where it's used