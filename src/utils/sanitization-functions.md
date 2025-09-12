# Sanitization Functions Reference

This file documents all functions in `sanitization.ts` with simple explanations and return values.

## **stripHtml**
- **What it does**: Removes HTML tags from text, keeping only the plain text content
- **Returns**: A text string with no HTML tags

## **sanitizeCharacterName**
- **What it does**: Cleans up character names by removing HTML and dangerous characters, keeping only letters, spaces, hyphens, apostrophes, and periods
- **Returns**: A clean text string safe for character names

## Notes
- Security-focused functions to prevent XSS attacks
- Simple but important for user input safety
- Could potentially be expanded for other types of input sanitization