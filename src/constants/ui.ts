/**
 * UI Constants
 * Consolidates layout styles and UI-related utilities
 */

// Layout Styles for common patterns
export const LAYOUT_STYLES = {
  // Flex container with icon and text
  iconText: "flex items-center gap-2",

  // Flex container with icon and text (larger gap)
  iconTextLarge: "flex items-center gap-3",

  // Grid for info boxes
  infoGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4",

  // Flex wrap for tags/badges
  tagContainer: "flex flex-wrap gap-2",
} as const;

/**
 * Utility function to combine CSS classes
 * Filters out falsy values and joins with spaces
 */
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};