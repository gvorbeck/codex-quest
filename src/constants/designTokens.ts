/**
 * BFRPG Design Token System
 *
 * Centralized design tokens for consistent theming across the application.
 * Uses zinc color palette with amber accents for fantasy RPG aesthetic.
 */
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
        hover: "hover:bg-gradient-to-b hover:from-zinc-750/60 hover:to-zinc-800/80",
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
    // TailwindCSS v4: duration utilities work dynamically
    transition: "transition-all duration-200",
    rounded: "rounded-xl",
    roundedSm: "rounded-lg",
    /** Combined hover effect: border glow, shadow, and subtle scale */
    cardHover: "hover:border-amber-400/70 hover:shadow-lg hover:shadow-amber-400/5 hover:scale-[1.01]",
    /** Animated top accent bar that appears on card hover */
    cardAccent: "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300",
  },
  interactions: {
    // Semantic timing tokens aligned with TailwindCSS duration classes
    tooltipDelay: 500, // duration-500 - medium delay for tooltips
    animationDuration: 200, // duration-200 - fast transitions for UI interactions
    staggerDelay: 50, // Custom - minimal delay for staggered animations
    maxStaggerDelay: 300, // duration-300 - maximum stagger to prevent lag
  },
  inputs: {
    editableValue: {
      minValue: 0,
      maxValue: 999999,
    },
  },
  icons: {
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

// Legacy exports for backward compatibility
export const ICON_STYLES = DESIGN_TOKENS.icons;
export const CARD_DECORATION_SIZES = DESIGN_TOKENS.decorations;
