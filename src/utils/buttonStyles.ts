import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/constants";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "accent";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonStyleConfig {
  base: string[];
  variants: Record<ButtonVariant, string[]>;
  sizes: Record<ButtonSize, string>;
}

/**
 * Creates button style configurations for both regular and FAB buttons
 * @param isFAB - Whether the button is a FAB (rounded square) or rectangular
 * @returns Button style configuration object
 */
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
    ? { base: 6, hover: 8, active: 3, glow: true } as const
    : { base: 4, hover: 6, active: 2, glow: false } as const;

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
      SHADOW_GENERATORS.createBase("#b45309", shadowConfig.base, shadowConfig.glow),
      SHADOW_GENERATORS.createHover("#b45309", shadowConfig.hover, shadowConfig.glow),
      "hover:bg-amber-600 hover:text-white hover:border-amber-700",
      SHADOW_GENERATORS.createActive("#b45309", shadowConfig.active, shadowConfig.glow),
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
      SHADOW_GENERATORS.createBase("#b45309", shadowConfig.base, shadowConfig.glow),
      SHADOW_GENERATORS.createHover("#b45309", shadowConfig.hover, shadowConfig.glow),
      "hover:from-amber-600 hover:to-amber-700 hover:text-white",
      SHADOW_GENERATORS.createActive("#b45309", shadowConfig.active, shadowConfig.glow),
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

/**
 * Combines style arrays into a single className string
 */
export const combineButtonStyles = (
  base: string[],
  variant: string[],
  size: string,
  className = ""
): string => {
  return cn(...base, ...variant, size, className);
};

/**
 * Common button props interface for consistency
 */
export interface BaseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}
