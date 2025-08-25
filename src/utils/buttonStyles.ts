import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonStyleConfig {
  base: string[];
  variants: Record<ButtonVariant, string[]>;
  sizes: Record<ButtonSize, string>;
}

/**
 * Creates button style configurations for both regular and circular buttons
 * @param isCircular - Whether the button is circular (FAB) or rectangular
 * @returns Button style configuration object
 */
export const createButtonStyles = (isCircular = false): ButtonStyleConfig => {
  // Base styles differ between regular and circular buttons
  const baseStyles = isCircular
    ? [
        "relative inline-flex items-center justify-center",
        "font-semibold transition-all duration-200 ease-out",
        "border-2 rounded-full shadow-lg",
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

  // Shadow intensities differ for circular vs rectangular buttons
  const shadowConfig = isCircular
    ? { base: 6, hover: 8, active: 3, glow: true }
    : { base: 4, hover: 6, active: 2, glow: false };

  const createShadow = (color: string, intensity: number, withGlow = false) => {
    const glowEffect = withGlow ? `,0_0_20px_rgba(245,158,11,0.4)` : "";
    return `shadow-[0_${intensity}px_0_0_${color}${glowEffect}]`;
  };

  const createHoverShadow = (color: string, intensity: number, withGlow = false) => {
    const glowEffect = withGlow ? `,0_0_25px_rgba(245,158,11,0.5)` : "";
    return `hover:shadow-[0_${intensity}px_0_0_${color}${glowEffect}]`;
  };

  const createActiveShadow = (color: string, intensity: number, withGlow = false) => {
    const glowEffect = withGlow ? `,0_0_15px_rgba(245,158,11,0.3)` : "";
    return `active:shadow-[0_${intensity}px_0_0_${color}${glowEffect}]`;
  };

  // Variant styles with consistent color scheme but different shadows
  const variantStyles: Record<ButtonVariant, string[]> = {
    primary: [
      "bg-amber-400 text-zinc-900 border-amber-500",
      createShadow("#b45309", shadowConfig.base, shadowConfig.glow),
      createHoverShadow("#b45309", shadowConfig.hover, shadowConfig.glow),
      "hover:bg-amber-300 hover:border-amber-400",
      createActiveShadow("#b45309", shadowConfig.active, shadowConfig.glow),
      ...(isCircular ? [] : ["active:bg-amber-500"]),
    ],
    secondary: isCircular
      ? [
          "bg-zinc-700 text-amber-400 border-zinc-600",
          createShadow("#3f3f46", shadowConfig.base, false),
          createHoverShadow("#3f3f46", shadowConfig.hover, false),
          "hover:bg-zinc-600 hover:text-amber-300",
          createActiveShadow("#3f3f46", shadowConfig.active, false),
        ]
      : [
          "bg-transparent text-amber-400 border-amber-400",
          createShadow("#b45309", shadowConfig.base),
          createHoverShadow("#b45309", shadowConfig.hover),
          "hover:bg-amber-400 hover:text-zinc-900 hover:border-amber-500",
          createActiveShadow("#b45309", shadowConfig.active),
          "active:bg-amber-500 active:text-zinc-900",
        ],
    ghost: [
      isCircular ? "bg-zinc-800/80 backdrop-blur-sm" : "bg-transparent",
      "text-zinc-300 border-zinc-600",
      createShadow("#3f3f46", shadowConfig.base),
      createHoverShadow("#3f3f46", shadowConfig.hover),
      "hover:bg-zinc-700 hover:text-zinc-100 hover:border-zinc-500",
      createActiveShadow("#3f3f46", shadowConfig.active),
      ...(isCircular ? [] : ["active:bg-zinc-800"]),
    ],
    destructive: [
      "bg-red-500 text-white border-red-600",
      createShadow("#b91c1c", shadowConfig.base),
      createHoverShadow("#b91c1c", shadowConfig.hover),
      "hover:bg-red-400 hover:border-red-500",
      createActiveShadow("#b91c1c", shadowConfig.active),
      ...(isCircular ? [] : ["active:bg-red-600"]),
    ],
    accent: [
      "bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-900 border-amber-600",
      createShadow("#b45309", shadowConfig.base, shadowConfig.glow),
      createHoverShadow("#b45309", shadowConfig.hover, shadowConfig.glow),
      "hover:from-amber-300 hover:to-amber-400",
      createActiveShadow("#b45309", shadowConfig.active, shadowConfig.glow),
    ],
  };

  // Size styles differ for circular vs rectangular buttons
  const sizeStyles: Record<ButtonSize, string> = isCircular
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
  return [...base, ...variant, size, className].join(" ");
};

/**
 * Common button props interface for consistency
 */
export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}
