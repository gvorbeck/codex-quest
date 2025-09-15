/**
 * Display utility functions for consistent data presentation
 */

/**
 * Returns a display value or fallback for undefined/empty values
 * @param value - The value to display
 * @param fallback - The fallback value to display if value is undefined/empty
 * @returns The display value or fallback
 */
export const displayValue = (value: string | number | undefined | null, fallback = "—"): string => {
  return (value !== null && value !== undefined && value !== "") ? String(value) : fallback;
};

/**
 * Formats large numbers with abbreviations for compact display
 * @param value - The number to format
 * @param threshold - Numbers above this threshold will be abbreviated (default: 999,999)
 * @returns Formatted number string with abbreviations (e.g., "1.2M", "500K")
 */
export const formatLargeNumber = (value: number, threshold = 999999): string => {
  if (value <= threshold) {
    return value.toLocaleString();
  }

  if (value >= 1000000) {
    const millions = value / 1000000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }

  const thousands = value / 1000;
  return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
};