/**
 * Centralized style constants to reduce repetition and ensure consistency
 */

// Card Styles
export const CARD_STYLES = {
  // Main information/warning cards with amber styling
  info: "bg-amber-950/20 border-2 border-amber-600 rounded-lg p-6 shadow-[0_3px_0_0_#b45309]",
  
  // Compact version of info card
  infoCompact: "bg-amber-950/20 border-2 border-amber-600 rounded-lg p-4 shadow-[0_3px_0_0_#d97706]",

  // Success/positive cards with lime styling
  success: "bg-lime-950/20 border-2 border-lime-600 rounded-lg p-6 shadow-[0_3px_0_0_#65a30d]",

  // Standard content cards with zinc styling
  standard:
    "bg-zinc-800 border-2 border-zinc-600 rounded-lg p-6 shadow-[0_3px_0_0_#3f3f46]",

  // Compact version of standard card
  standardCompact:
    "bg-zinc-800 border-2 border-zinc-600 rounded-lg p-4 shadow-[0_3px_0_0_#3f3f46]",

  // Nested detail boxes within cards
  nested: "bg-zinc-800/50 border border-amber-700/30 rounded-lg p-4",
} as const;

// Badge Styles
export const BADGE_STYLES = {
  // Status/category badges
  status: "bg-lime-600 text-zinc-900 text-xs font-medium px-2 py-1 rounded",

  // Supplemental content indicator
  supplemental:
    "bg-lime-600 text-zinc-900 text-xs font-medium px-2 py-1 rounded",

  // Combination class indicator
  combination:
    "bg-lime-600 text-zinc-900 text-xs font-medium px-2 py-1 rounded",
} as const;

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

// Common Text Styles
export const TEXT_STYLES = {
  // Section headings
  sectionHeading: "text-lg font-semibold text-zinc-100 mb-6",
  
  // Base section headings
  baseSectionHeading: "text-base font-semibold text-zinc-100 mb-4",

  // Info headings within cards
  infoHeading: "text-xl font-semibold text-amber-100 m-0",

  // Subheadings with icons
  subHeading: "font-semibold mb-2 text-amber-400 flex items-center gap-2",
  
  // Subheadings with icons (mb-3 variant)
  subHeadingSpaced: "font-semibold mb-3 text-amber-400 flex items-center gap-2",

  // Description text
  description: "text-amber-50 text-sm leading-relaxed m-0",
  
  // Compact description text
  descriptionCompact: "text-amber-100 text-sm m-0 leading-relaxed",

  // Helper text
  helper: "text-zinc-400 text-sm",
} as const;

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

// Utility function to combine styles
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};
