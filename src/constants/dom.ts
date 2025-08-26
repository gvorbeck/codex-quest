/**
 * Constants for DOM element IDs, classes, and ARIA attributes
 */

/**
 * HTML element IDs used in the application
 */
export const DOM_IDS = {
  MAIN_CONTENT: "main-content",
  MOBILE_MENU: "mobile-menu",
  ROOT: "root",
} as const;

/**
 * CSS classes used throughout the application
 */
export const CSS_CLASSES = {
  SKIP_LINK: "skip-link",
  SR_ONLY: "sr-only",
} as const;

/**
 * HTML roles
 */
export const HTML_ROLES = {
  BANNER: "banner",
  NAVIGATION: "navigation",
  MAIN: "main",
  CONTENTINFO: "contentinfo",
  STATUS: "status",
} as const;

// Removed unused constants: ARIA_ATTRIBUTES, SVG_ATTRIBUTES and their types