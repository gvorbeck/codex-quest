/**
 * Centralized style constants to reduce repetition and ensure consistency
 */

// Card Styles - removed unused CARD_STYLES constant

// Icon Styles
export const ICON_STYLES = {
  // Small icons (most common)
  sm: "w-4 h-4",

  // Medium icons
  md: "w-5 h-5",

  // Large icons
  lg: "w-6 h-6",

  // Extra large icons
  xl: "w-8 h-8",
} as const;

// Removed unused BADGE_STYLES and TEXT_STYLES constants

// Layout Styles
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

// Removed unused component mapping constants

// Utility function to combine styles
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};
