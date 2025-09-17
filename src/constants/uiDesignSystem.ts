/**
 * UI Design System Constants
 * Centralized design tokens, styling patterns, and UI configuration
 */

import type { CurrencyKey } from "@/types";

// Core Design Tokens
export const DESIGN_TOKENS = {
  colors: {
    bg: {
      primary: "bg-zinc-800",
      /** Subtle depth gradient for accent backgrounds */
      accent: "bg-gradient-to-br from-zinc-800 to-zinc-900",
      /** Ability score card gradient with tactile depth */
      ability: "bg-gradient-to-br from-zinc-700 to-zinc-800",
      /** Interactive hover state for ability scores */
      abilityHover: "bg-gradient-to-br from-zinc-600 to-zinc-700",
      /** Semi-transparent header gradient for visual hierarchy */
      header: "bg-gradient-to-r from-zinc-700/50 to-zinc-750/30",
      label: "bg-zinc-750/40",
      stripe: "bg-zinc-800/30",
      hover: "hover:bg-zinc-700/30",
      input: "bg-zinc-700",
      inputHover: "hover:bg-zinc-600",
      card: {
        /** Main card gradient with depth and transparency */
        base: "bg-gradient-to-b from-zinc-800/50 to-zinc-900/70",
        /** Enhanced hover state with increased opacity */
        hover:
          "hover:bg-gradient-to-b hover:from-zinc-750/60 hover:to-zinc-800/80",
        /** Minimal card background for simple content */
        simple: "bg-zinc-750/30",
        simpleHover: "hover:bg-zinc-700/40",
        /** Light vertical card background */
        vertical: "bg-zinc-750/20",
        verticalHover: "hover:bg-zinc-700/30",
      },
    },
    text: {
      primary: "text-zinc-100",
      secondary: "text-zinc-400",
      muted: "text-zinc-300",
      accent: "text-amber-400",
      modifier: "text-lime-400",
    },
    border: {
      primary: "border-zinc-600",
      secondary: "border-zinc-700/60",
      accent: "border-amber-500/20",
      ability: "border-zinc-600/80",
      input: "border-amber-400",
      inputFocus: "focus:border-amber-300",
    },
  },
  effects: {
    // TailwindCSS v4 compatible: custom shadows use arbitrary values
    shadow: "shadow-[0_4px_0_0_#3f3f46,0_0_20px_rgba(0,0,0,0.3)]",
    shadowSm: "shadow-[0_2px_0_0_#52525b,0_0_10px_rgba(0,0,0,0.2)]",
    abilityShadow:
      "shadow-[0_3px_0_0_#3f3f46,inset_0_1px_0_0_rgba(255,255,255,0.1)]",
    transition: "transition-all duration-200",
    rounded: "rounded-xl",
    roundedSm: "rounded-lg",
    /** Combined hover effect: border glow, shadow, and subtle scale */
    cardHover:
      "hover:border-amber-400/70 hover:shadow-lg hover:shadow-amber-400/5 hover:scale-[1.01]",
    /** Animated top accent bar that appears on card hover */
    cardAccent:
      "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300",
  },
  interactions: {
    tooltipDelay: 500,
    animationDuration: 200,
    staggerDelay: 50,
    maxStaggerDelay: 300,
  },
  inputs: {
    editableValue: {
      minValue: 0,
      maxValue: 999999,
    },
  },
  icons: {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  },
  decorations: {
    large: "w-24 h-24",
    medium: "w-16 h-16",
  },
} as const;

// Size-based styling configurations
export const SIZE_STYLES = {
  sm: {
    container: "p-2",
    header: "px-4 py-3",
    abilityContainer: "p-3",
    abilityName: "text-xs font-semibold tracking-wide uppercase mb-2",
    abilityScore: "text-lg font-bold",
    abilityModifier: "text-xs font-medium",
    itemSpacing: "gap-3",
    labelText: "text-xs font-semibold tracking-wide uppercase",
    contentText: "text-sm font-medium",
    grid: "grid-cols-1 gap-3",
  },
  md: {
    container: "p-4",
    header: "px-5 py-4",
    abilityContainer: "p-4",
    abilityName: "text-sm font-semibold tracking-wide uppercase mb-3",
    abilityScore: "text-2xl font-bold",
    abilityModifier: "text-sm font-medium",
    itemSpacing: "gap-4",
    labelText: "text-sm font-semibold tracking-wide uppercase",
    contentText: "text-base font-medium",
    grid: "grid-cols-1 gap-4",
  },
  lg: {
    container: "p-6",
    header: "px-6 py-5",
    abilityContainer: "p-5",
    abilityName: "text-base font-semibold tracking-wide uppercase mb-4",
    abilityScore: "text-3xl font-bold",
    abilityModifier: "text-base font-medium",
    itemSpacing: "gap-6",
    labelText: "text-base font-semibold tracking-wide uppercase",
    contentText: "text-lg font-medium",
    grid: "grid-cols-1 gap-6",
  },
} as const;

// Layout Styles for common patterns
export const LAYOUT_STYLES = {
  iconText: "flex items-center gap-2",
  iconTextLarge: "flex items-center gap-3",
  infoGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  tagContainer: "flex flex-wrap gap-2",
} as const;

// DOM Element Configuration
export const DOM_IDS = {
  MAIN_CONTENT: "main-content",
  MOBILE_MENU: "mobile-menu",
  ROOT: "root",
} as const;

export const CSS_CLASSES = {
  SKIP_LINK: "skip-link",
  SR_ONLY: "sr-only",
} as const;

export const HTML_ROLES = {
  BANNER: "banner",
  NAVIGATION: "navigation",
  MAIN: "main",
  CONTENTINFO: "contentinfo",
  STATUS: "status",
} as const;

// Currency UI Configuration
export const CURRENCY_UI_CONFIG = [
  {
    key: "platinum" as const,
    label: "Platinum",
    abbrev: "pp",
    color: "from-slate-300 to-slate-500",
    ring: "ring-slate-400/30",
    textColor: "text-purple-600",
  },
  {
    key: "gold" as const,
    label: "Gold",
    abbrev: "gp",
    color: "from-yellow-300 to-yellow-600",
    ring: "ring-yellow-400/30",
    textColor: "text-yellow-600",
  },
  {
    key: "electrum" as const,
    label: "Electrum",
    abbrev: "ep",
    color: "from-amber-200 to-amber-500",
    ring: "ring-amber-400/30",
    textColor: "text-blue-600",
  },
  {
    key: "silver" as const,
    label: "Silver",
    abbrev: "sp",
    color: "from-gray-200 to-gray-400",
    ring: "ring-gray-400/30",
    textColor: "text-gray-600",
  },
  {
    key: "copper" as const,
    label: "Copper",
    abbrev: "cp",
    color: "from-orange-400 to-orange-700",
    ring: "ring-orange-400/30",
    textColor: "text-orange-600",
  },
] as const;

// Badge variant mapping for special abilities
export const ABILITY_BADGE_VARIANTS = {
  darkvision: "primary",
  "turn undead": "warning",
  "sneak attack": "danger",
  backstab: "danger",
  immunity: "success",
  detect: "supplemental",
  "secret door": "supplemental",
  spellcasting: "status",
  rage: "danger",
  tracking: "supplemental",
  stealth: "status",
  hide: "status",
  climb: "status",
  "move silently": "status",
  "ghoul immunity": "success",
} as const;

// Notification System Styling
export const NOTIFICATION_CONSTANTS = {
  ANIMATION_DURATION: 400,
  DEFAULT_DURATION: 0,
  STAGGER_DELAY: 150,
  FOCUS_DELAY: 100,
  MAX_NOTIFICATIONS: 5,
} as const;

export const PRIORITY_STYLES = {
  info: {
    bg: "bg-gradient-to-br from-slate-50/95 to-slate-100/95 dark:from-slate-900/90 dark:to-slate-800/90",
    border: "border-slate-200 dark:border-slate-700",
    shadow: "shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50",
    titleColor: "slate" as const,
    messageColor: "slate" as const,
    accent: "bg-blue-500",
  },
  success: {
    bg: "bg-gradient-to-br from-lime-50/95 to-lime-100/95 dark:from-lime-950/80 dark:to-lime-900/80",
    border: "border-lime-200 dark:border-lime-800",
    shadow: "shadow-lg shadow-lime-200/50 dark:shadow-lime-900/30",
    titleColor: "slate" as const,
    messageColor: "slate" as const,
    accent: "bg-lime-500",
  },
  warning: {
    bg: "bg-gradient-to-br from-amber-50/95 to-orange-100/95 dark:from-amber-950/80 dark:to-orange-900/80",
    border: "border-amber-200 dark:border-amber-800",
    shadow: "shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30",
    titleColor: "slate" as const,
    messageColor: "slate" as const,
    accent: "bg-amber-500",
  },
  error: {
    bg: "bg-gradient-to-br from-red-50/90 to-rose-100/90 dark:from-red-950/80 dark:to-rose-900/80",
    border: "border-red-200 dark:border-red-700",
    shadow: "shadow-lg shadow-red-200/50 dark:shadow-red-900/40",
    titleColor: "slate" as const,
    messageColor: "slate" as const,
    accent: "bg-red-500",
  },
} as const;

export const POSITION_ANIMATIONS = {
  "top-right": {
    enter: "translate-x-0 translate-y-0 scale-100",
    exit: "translate-x-full translate-y-0 scale-95",
    initial: "translate-x-full translate-y-0 scale-95",
  },
  "top-left": {
    enter: "translate-x-0 translate-y-0 scale-100",
    exit: "-translate-x-full translate-y-0 scale-95",
    initial: "-translate-x-full translate-y-0 scale-95",
  },
  "bottom-right": {
    enter: "translate-x-0 translate-y-0 scale-100",
    exit: "translate-x-full translate-y-0 scale-95",
    initial: "translate-x-full translate-y-0 scale-95",
  },
  "bottom-left": {
    enter: "translate-x-0 translate-y-0 scale-100",
    exit: "-translate-x-full translate-y-0 scale-95",
    initial: "-translate-x-full translate-y-0 scale-95",
  },
  "top-center": {
    enter: "translate-x-0 translate-y-0 scale-100",
    exit: "translate-x-0 -translate-y-full scale-95",
    initial: "translate-x-0 -translate-y-full scale-95",
  },
  "bottom-center": {
    enter: "translate-x-0 translate-y-0 scale-100",
    exit: "translate-x-0 translate-y-full scale-95",
    initial: "translate-x-0 translate-y-full scale-95",
  },
} as const;

export const PRIORITY_PROGRESS_COLORS = {
  info: "bg-blue-500",
  success: "bg-lime-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
} as const;

export const BASE_NOTIFICATION_STYLES = [
  "border",
  "rounded-xl",
  "p-5",
  "max-w-md",
  "min-w-80",
  "transition-all",
  "duration-500",
  "ease-out",
  "backdrop-blur-md",
  "relative",
  "overflow-hidden",
] as const;

// Game Sheet Specific Styles
export const GAME_SHEET_STYLES = {
  spacing: {
    section: "mb-8",
    element: "mb-4",
    content: "space-y-6",
    cardGap: "gap-4",
    innerSpacing: "space-y-2",
  },
  layout: {
    cardGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    statusMessage: "status-message",
    centeredContent: "text-center py-12",
  },
  colors: {
    card: "bg-zinc-800 border border-zinc-700 rounded-lg",
    text: {
      primary: "text-zinc-100",
      secondary: "text-zinc-400",
      error: "text-red-400",
      loading: "text-zinc-400",
    },
  },
  accessibility: {
    skipLink:
      "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber-400 text-zinc-900 px-4 py-2 rounded",
  },
} as const;

// Error and Loading Messages
export const ERROR_MESSAGES = {
  gameNotFound: "Game not found",
  loadError: "Failed to load game",
  updateError: "Failed to update game. Please try again.",
  invalidUrl: "Invalid game URL",
  permissionDenied: "You do not have permission to edit this game",
} as const;

export const LOADING_MESSAGES = {
  loadingGame: "Loading game...",
  updatingGame: "Updating game...",
  savingChanges: "Saving changes...",
  loadingPlayerData: "Loading player data...",
} as const;

// Helper function for currency configuration
export function getCurrencyConfig(key: CurrencyKey) {
  return CURRENCY_UI_CONFIG.find((config) => config.key === key);
}
