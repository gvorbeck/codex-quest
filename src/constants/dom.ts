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
 * ARIA attributes and roles
 */
export const ARIA_ATTRIBUTES = {
  CONTROLS_MOBILE_MENU: "mobile-menu",
  LIVE_POLITE: "polite",
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

/**
 * SVG attributes
 */
export const SVG_ATTRIBUTES = {
  FILL_NONE: "none",
  STROKE_CURRENT_COLOR: "currentColor",
  STROKE_LINECAP_ROUND: "round",
  STROKE_LINEJOIN_ROUND: "round",
  ARIA_HIDDEN_TRUE: "true",
} as const;

export type DomId = (typeof DOM_IDS)[keyof typeof DOM_IDS];
export type CssClass = (typeof CSS_CLASSES)[keyof typeof CSS_CLASSES];
export type AriaAttribute = (typeof ARIA_ATTRIBUTES)[keyof typeof ARIA_ATTRIBUTES];
export type HtmlRole = (typeof HTML_ROLES)[keyof typeof HTML_ROLES];