/**
 * HTML sanitization utilities for security
 * These functions help prevent XSS attacks by sanitizing user input
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param text - The text to escape
 * @returns The escaped text safe for HTML rendering
 */
export function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Strips HTML tags from a string, leaving only the text content
 * @param html - The HTML string to strip
 * @returns Plain text with HTML tags removed
 */
export function stripHtml(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

/**
 * Sanitizes character name input by removing potentially dangerous characters
 * while preserving legitimate characters used in names
 * @param name - The character name to sanitize
 * @returns Sanitized character name
 */
export function sanitizeCharacterName(name: string): string {
  // Remove any HTML tags first
  const plainText = stripHtml(name);

  // Allow only letters, spaces, hyphens, apostrophes, and periods
  // This matches the validation schema pattern
  return plainText.replace(/[^a-zA-Z\s\-'.]/g, "").trim();
}

/**
 * Basic sanitization for general text input
 * Removes HTML tags and trims whitespace
 * @param input - The input to sanitize
 * @returns Sanitized text
 */
export function sanitizeTextInput(input: string): string {
  return stripHtml(input).trim();
}

/**
 * Validates that a string contains only safe characters for display
 * @param text - Text to validate
 * @returns true if the text is safe for display
 */
export function isTextSafe(text: string): boolean {
  // Check for common XSS patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(text));
}
