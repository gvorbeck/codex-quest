/**
 * HTML sanitization utilities for security
 * These functions help prevent XSS attacks by sanitizing user input
 */

/**
 * Strips HTML tags from a string, leaving only the text content
 * Uses regex to safely remove HTML without DOM manipulation
 * @param html - The HTML string to strip
 * @returns Plain text with HTML tags removed
 */
function stripHtml(html: string): string {
  // Remove HTML tags using regex (safer than innerHTML)
  return html.replace(/<[^>]*>/g, '');
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
