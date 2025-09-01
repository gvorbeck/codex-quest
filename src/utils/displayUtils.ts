/**
 * Display utility functions for consistent data presentation
 */

/**
 * Returns a display value or fallback for undefined/empty values
 * @param value - The value to display
 * @param fallback - The fallback value to display if value is undefined/empty
 * @returns The display value or fallback
 */
export const displayValue = (value: string | undefined | null, fallback = "—"): string => {
  return value || fallback;
};

/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Formats a string for display by replacing dashes/underscores with spaces and capitalizing
 * @param str - The string to format
 * @returns The formatted string
 */
export const formatDisplayName = (str: string): string => {
  return str
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(capitalize)
    .join(' ');
};