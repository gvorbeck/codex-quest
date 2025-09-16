/**
 * Consolidated formatting and display utilities
 * Contains small utility functions for consistent data presentation
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

/**
 * Truncates text to a specified maximum length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum number of characters (default: 150)
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

/**
 * Generates contextual deletion descriptions for confirmation modals
 * @param variant - The severity level of the deletion
 * @param _entityName - The name of the entity being deleted (unused but kept for API consistency)
 * @param title - The title context for determining deletion type
 * @returns Descriptive text explaining the deletion consequences
 */
export function getEntityDeletionDescription(
  variant: "error" | "warning",
  _entityName: string,
  title: string
): string {
  if (variant === "error") {
    return `and all their adventures, equipment, and memories will be lost to the void. This action cannot be undone, reversed, or recovered by any magic known to mortals.`;
  }

  if (variant === "warning" && title.includes("Player")) {
    return `will be removed from this game session. They will no longer appear in the player list or have access to game features. This action can be reversed by re-adding them to the game.`;
  }

  return `and all its campaigns, player data, and battle records will be lost to the void. This action cannot be undone, reversed, or recovered by any magic known to mortals.`;
}