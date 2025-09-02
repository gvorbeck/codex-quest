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