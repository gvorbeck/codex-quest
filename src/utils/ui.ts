/**
 * UI utilities - consolidated from formatters.ts, buttonStyles.ts, tooltipUtils.ts, and fabValidation.ts
 * Contains formatting, styling, positioning, and validation utilities for UI components
 */

import type { ReactNode } from "react";
import type {
  ButtonVariant,
  ButtonSize,
  PositioningOptions,
  TooltipPositionResult,
  PropValidationResult,
} from "@/types";

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | { [key: string]: boolean | undefined | null }
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}

export const displayValue = (
  value: string | number | undefined | null,
  fallback = "—"
): string => {
  return value !== null && value !== undefined && value !== ""
    ? String(value)
    : fallback;
};

export const formatLargeNumber = (
  value: number,
  threshold = 999999
): string => {
  if (value <= threshold) {
    return value.toLocaleString();
  }

  if (value >= 1000000) {
    const millions = value / 1000000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }

  const thousands = value / 1000;
  return `${
    thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)
  }K`;
};

export const truncateText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

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

// ============================================================================
// BUTTON STYLING
// ============================================================================

interface ButtonStyleConfig {
  base: string[];
  variants: Record<ButtonVariant, string[]>;
  sizes: Record<ButtonSize, string>;
}

export const createButtonStyles = (isFAB = false): ButtonStyleConfig => {
  // Base styles differ between regular and FAB buttons
  const baseStyles = isFAB
    ? [
        "relative inline-flex items-center justify-center",
        "font-semibold transition-all duration-200 ease-out",
        "border-2 rounded-2xl shadow-lg",
        "transform hover:scale-105 active:scale-95",
        "focus:outline-none focus:ring-4 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-zinc-900",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none",
      ]
    : [
        "inline-flex items-center justify-center gap-2",
        "font-semibold transition-all duration-150",
        "border-2 rounded-lg whitespace-nowrap",
        "transform active:translate-y-0.5 active:shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none disabled:shadow-none",
      ];

  // Shadow intensities differ for FAB vs rectangular buttons
  const shadowConfig = isFAB
    ? ({ base: 6, hover: 8, active: 3, glow: true } as const)
    : ({ base: 4, hover: 6, active: 2, glow: false } as const);

  const GLOW_EFFECTS = {
    base: `,0_0_20px_rgba(245,158,11,0.4)`,
    hover: `,0_0_25px_rgba(245,158,11,0.5)`,
    active: `,0_0_15px_rgba(245,158,11,0.3)`,
  } as const;

  const SHADOW_GENERATORS = {
    createBase: (color: string, intensity: number, withGlow = false) => {
      const glow = withGlow ? GLOW_EFFECTS.base : "";
      return `shadow-[0_${intensity}px_0_0_${color}${glow}]`;
    },
    createHover: (color: string, intensity: number, withGlow = false) => {
      const glow = withGlow ? GLOW_EFFECTS.hover : "";
      return `hover:shadow-[0_${intensity}px_0_0_${color}${glow}]`;
    },
    createActive: (color: string, intensity: number, withGlow = false) => {
      const glow = withGlow ? GLOW_EFFECTS.active : "";
      return `active:shadow-[0_${intensity}px_0_0_${color}${glow}]`;
    },
  } as const;

  // Variant styles with consistent color scheme but different shadows
  const variantStyles: Record<ButtonVariant, string[]> = {
    primary: [
      "bg-amber-500 text-white border-amber-600 font-bold",
      SHADOW_GENERATORS.createBase(
        "#b45309",
        shadowConfig.base,
        shadowConfig.glow
      ),
      SHADOW_GENERATORS.createHover(
        "#b45309",
        shadowConfig.hover,
        shadowConfig.glow
      ),
      "hover:bg-amber-600 hover:text-white hover:border-amber-700",
      SHADOW_GENERATORS.createActive(
        "#b45309",
        shadowConfig.active,
        shadowConfig.glow
      ),
      ...(isFAB ? [] : ["active:bg-amber-700 active:text-white"]),
    ],
    secondary: isFAB
      ? [
          "bg-zinc-700 text-amber-400 border-zinc-600",
          SHADOW_GENERATORS.createBase("#3f3f46", shadowConfig.base, false),
          SHADOW_GENERATORS.createHover("#3f3f46", shadowConfig.hover, false),
          "hover:bg-zinc-600 hover:text-amber-300",
          SHADOW_GENERATORS.createActive("#3f3f46", shadowConfig.active, false),
        ]
      : [
          "bg-transparent text-amber-400 border-amber-400",
          SHADOW_GENERATORS.createBase("#b45309", shadowConfig.base),
          SHADOW_GENERATORS.createHover("#b45309", shadowConfig.hover),
          "hover:bg-amber-400 hover:text-white hover:border-amber-500",
          SHADOW_GENERATORS.createActive("#b45309", shadowConfig.active),
          "active:bg-amber-500 active:text-white",
        ],
    ghost: [
      isFAB ? "bg-zinc-800/80 backdrop-blur-sm" : "bg-transparent",
      "text-zinc-300 border-zinc-600",
      SHADOW_GENERATORS.createBase("#3f3f46", shadowConfig.base),
      SHADOW_GENERATORS.createHover("#3f3f46", shadowConfig.hover),
      "hover:bg-zinc-700 hover:text-zinc-100 hover:border-zinc-500",
      SHADOW_GENERATORS.createActive("#3f3f46", shadowConfig.active),
      ...(isFAB ? [] : ["active:bg-zinc-800"]),
    ],
    destructive: [
      "bg-red-500 text-white border-red-600",
      SHADOW_GENERATORS.createBase("#b91c1c", shadowConfig.base),
      SHADOW_GENERATORS.createHover("#b91c1c", shadowConfig.hover),
      "hover:bg-red-400 hover:border-red-500",
      SHADOW_GENERATORS.createActive("#b91c1c", shadowConfig.active),
      ...(isFAB ? [] : ["active:bg-red-600"]),
    ],
    accent: [
      "bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-700 font-bold",
      SHADOW_GENERATORS.createBase(
        "#b45309",
        shadowConfig.base,
        shadowConfig.glow
      ),
      SHADOW_GENERATORS.createHover(
        "#b45309",
        shadowConfig.hover,
        shadowConfig.glow
      ),
      "hover:from-amber-600 hover:to-amber-700 hover:text-white",
      SHADOW_GENERATORS.createActive(
        "#b45309",
        shadowConfig.active,
        shadowConfig.glow
      ),
    ],
  };

  // Size styles differ for FAB vs rectangular buttons
  const sizeStyles: Record<ButtonSize, string> = isFAB
    ? {
        sm: "w-12 h-12 text-sm",
        md: "w-14 h-14 text-base",
        lg: "w-16 h-16 text-lg",
      }
    : {
        sm: "px-4 py-3 text-sm min-h-[40px]",
        md: "px-6 py-4 text-base min-h-[48px]",
        lg: "px-8 py-5 text-lg min-h-[56px]",
      };

  return {
    base: baseStyles,
    variants: variantStyles,
    sizes: sizeStyles,
  };
};

export const combineButtonStyles = (
  base: string[],
  variant: string[],
  size: string,
  className = ""
): string => {
  return cn(...base, ...variant, size, className);
};

// ============================================================================
// TOOLTIP POSITIONING
// ============================================================================

const positionCache = new Map<string, TooltipPositionResult>();
const CACHE_SIZE_LIMIT = 100;

export const getResponsivePadding = (): number => {
  return window.innerWidth < 640 ? 16 : 8; // More padding on mobile
};

export const calculateArrowOffset = (
  triggerCenterX: number,
  tooltipLeft: number,
  tooltipWidth: number
): number => {
  const arrowOffsetFromCenter = triggerCenterX - tooltipLeft;
  const halfTooltipWidth = tooltipWidth / 2;
  const maxArrowOffset = halfTooltipWidth - 12; // 12px from edge

  return Math.max(
    -maxArrowOffset,
    Math.min(maxArrowOffset, arrowOffsetFromCenter)
  );
};

export const shouldPositionBelow = (
  triggerRect: DOMRect,
  tooltipHeight: number,
  options: PositioningOptions
): boolean => {
  const spaceAbove = triggerRect.top - options.padding - options.gap;
  const spaceBelow =
    window.innerHeight - triggerRect.bottom - options.padding - options.gap;

  // If preferred position is below and there's enough space, use below
  if (options.preferredPosition === "below" && spaceBelow >= tooltipHeight) {
    return true;
  }

  // If preferred position is above and there's enough space, use above
  if (options.preferredPosition === "above" && spaceAbove >= tooltipHeight) {
    return false;
  }

  // Choose position with more available space
  return spaceBelow >= spaceAbove;
};

export const calculateVerticalPosition = (
  triggerRect: DOMRect,
  tooltipHeight: number,
  isBelow: boolean,
  options: PositioningOptions
): number => {
  if (isBelow) {
    return triggerRect.bottom + options.gap;
  }

  return triggerRect.top - tooltipHeight - options.gap;
};

export const calculateHorizontalPosition = (
  triggerRect: DOMRect,
  tooltipWidth: number,
  options: PositioningOptions
): number => {
  const triggerCenterX = triggerRect.left + triggerRect.width / 2;
  const halfTooltipWidth = tooltipWidth / 2;
  let tooltipLeft = triggerCenterX;

  // Check if tooltip would go off the left edge
  if (tooltipLeft - halfTooltipWidth < options.padding) {
    tooltipLeft = options.padding + halfTooltipWidth;
  }
  // Check if tooltip would go off the right edge
  else if (
    tooltipLeft + halfTooltipWidth >
    window.innerWidth - options.padding
  ) {
    tooltipLeft = window.innerWidth - options.padding - halfTooltipWidth;
  }

  return tooltipLeft;
};

function createCacheKey(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  options: PositioningOptions
): string {
  return `${triggerRect.left},${triggerRect.top},${triggerRect.width},${triggerRect.height}|${tooltipRect.width},${tooltipRect.height}|${options.padding},${options.gap},${options.preferredPosition}`;
}

function manageCacheSize(): void {
  if (positionCache.size > CACHE_SIZE_LIMIT) {
    const firstKey = positionCache.keys().next().value as string;
    if (firstKey) {
      positionCache.delete(firstKey);
    }
  }
}

export const calculateTooltipPosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  options: PositioningOptions = {
    padding: getResponsivePadding(),
    gap: 4,
    preferredPosition: "above",
  }
): TooltipPositionResult => {
  // Check cache first
  const cacheKey = createCacheKey(triggerRect, tooltipRect, options);
  if (positionCache.has(cacheKey)) {
    return positionCache.get(cacheKey)!;
  }

  const tooltipWidth = tooltipRect.width || 200; // Fallback width
  const tooltipHeight = tooltipRect.height || 40; // Fallback height

  // Determine vertical positioning
  const isBelow = shouldPositionBelow(triggerRect, tooltipHeight, options);

  // Calculate positions
  const top = calculateVerticalPosition(
    triggerRect,
    tooltipHeight,
    isBelow,
    options
  );
  const left = calculateHorizontalPosition(triggerRect, tooltipWidth, options);

  // Calculate arrow offset
  const triggerCenterX = triggerRect.left + triggerRect.width / 2;
  const arrowOffset = calculateArrowOffset(triggerCenterX, left, tooltipWidth);

  const result: TooltipPositionResult = {
    position: { top, left },
    isBelow,
    arrowOffset,
  };

  // Cache the result
  manageCacheSize();
  positionCache.set(cacheKey, result);

  return result;
};

export const createTooltipPositioner = (
  defaultOptions: Partial<PositioningOptions> = {}
) => {
  const options: PositioningOptions = {
    padding: getResponsivePadding(),
    gap: 4,
    preferredPosition: "above",
    ...defaultOptions,
  };

  return (
    triggerRect: DOMRect,
    tooltipRect: DOMRect,
    overrides?: Partial<PositioningOptions>
  ) => {
    const finalOptions = { ...options, ...overrides };
    return calculateTooltipPosition(triggerRect, tooltipRect, finalOptions);
  };
};

// ============================================================================
// COMPONENT VALIDATION
// ============================================================================

export const validateFABProps = (props: {
  variant?: string;
  size?: string;
  children?: ReactNode;
  tooltip?: string;
  "aria-label"?: string;
}): PropValidationResult => {
  const result: PropValidationResult = {
    isValid: true,
    warnings: [],
    errors: [],
  };

  const { variant, size, children, tooltip, "aria-label": ariaLabel } = props;

  // Validate required children
  if (!children) {
    result.errors.push("FloatingActionButton requires children content");
    result.isValid = false;
  }

  // Validate variant
  const validVariants = [
    "primary",
    "secondary",
    "ghost",
    "destructive",
    "accent",
  ];
  if (variant && !validVariants.includes(variant)) {
    result.warnings.push(
      `Invalid variant '${variant}'. Valid options: ${validVariants.join(", ")}`
    );
  }

  // Validate size
  const validSizes = ["sm", "md", "lg"];
  if (size && !validSizes.includes(size)) {
    result.warnings.push(
      `Invalid size '${size}'. Valid options: ${validSizes.join(", ")}`
    );
  }

  // Accessibility validation
  if (!ariaLabel && !tooltip) {
    result.warnings.push(
      "FloatingActionButton should have either 'aria-label' or 'tooltip' for accessibility"
    );
  }

  return result;
};

export const logValidationResults = (
  componentName: string,
  results: PropValidationResult
): void => {
  // Only log in development mode
  if (import.meta.env.MODE !== "development") return;

  // Note: Minimal logger to avoid circular dependency
  const log = {
    error: (message: string, ...args: unknown[]) =>
      // eslint-disable-next-line no-console
      console.error(message, ...args),
    warn: (message: string, ...args: unknown[]) =>
      // eslint-disable-next-line no-console
      console.warn(message, ...args),
  };

  const prefix = `[${componentName}]`;

  if (results.errors.length > 0) {
    log.error(`${prefix} Validation Errors:`, results.errors);
  }

  if (results.warnings.length > 0) {
    log.warn(`${prefix} Validation Warnings:`, results.warnings);
  }
};

export const createFallbackProps = <T extends Record<string, unknown>>(
  props: T,
  fallbacks: Partial<T>
): T => {
  const result = { ...props };

  Object.entries(fallbacks).forEach(([key, fallbackValue]) => {
    if (result[key] === undefined || result[key] === null) {
      (result as Record<string, unknown>)[key] = fallbackValue;
    }
  });

  return result;
};
