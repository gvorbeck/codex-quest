import { forwardRef, createElement } from "react";
import type { ReactNode, HTMLAttributes, ElementType } from "react";
import { cn } from "@/constants/styles";

type TypographyVariant = 
  | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  | "sectionHeading" | "baseSectionHeading" | "infoHeading" 
  | "subHeading" | "subHeadingSpaced" | "subHeadingLime"
  | "body" | "bodySmall" | "description" | "descriptionCompact" 
  | "helper" | "caption";

type TypographyColor = 
  | "primary" | "secondary" | "muted" | "accent" 
  | "amber" | "lime" | "zinc" | "white" | "slate";

type TypographyWeight = "normal" | "medium" | "semibold" | "bold";

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: TypographyWeight;
  as?: ElementType;
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      children,
      variant = "body",
      color,
      weight,
      as,
      className,
      ...props
    },
    ref
  ) => {
    // Auto-detect element based on variant if 'as' not provided
    const getDefaultElement = (variant: TypographyVariant): ElementType => {
      if (variant.startsWith('h')) return variant as ElementType;
      if (variant.includes('Heading')) return 'h4';
      if (variant === 'caption') return 'span';
      return 'p';
    };

    const Element = as || getDefaultElement(variant);

    // Variant styles mapping
    const variantStyles = {
      h1: "text-4xl font-bold",
      h2: "text-3xl font-bold", 
      h3: "text-2xl font-bold",
      h4: "text-xl font-semibold",
      h5: "text-lg font-semibold",
      h6: "text-base font-semibold",
      sectionHeading: "text-lg font-semibold mb-6",
      baseSectionHeading: "text-base font-semibold mb-4",
      infoHeading: "text-xl font-semibold m-0",
      subHeading: "font-semibold mb-2 flex items-center gap-2",
      subHeadingSpaced: "font-semibold mb-3 flex items-center gap-2",
      subHeadingLime: "font-semibold mb-1 flex items-center gap-2",
      body: "text-base leading-relaxed",
      bodySmall: "text-sm leading-relaxed",
      description: "text-sm leading-relaxed m-0",
      descriptionCompact: "text-sm m-0 leading-relaxed",
      helper: "text-sm",
      caption: "text-xs",
    };

    // Color styles mapping
    const colorStyles = {
      primary: "text-primary-100", // zinc-100
      secondary: "text-primary-400", // zinc-400  
      muted: "text-primary-500", // zinc-500
      accent: "text-accent-100", // stone-100
      amber: variant.includes('info') ? "text-amber-100" : variant.includes('sub') ? "text-amber-400" : "text-amber-50",
      lime: "text-lime-400",
      zinc: "text-zinc-100",
      white: "text-white",
      slate: "text-slate-800 dark:text-slate-200",
    };

    // Weight styles
    const weightStyles = {
      normal: "font-normal",
      medium: "font-medium", 
      semibold: "font-semibold",
      bold: "font-bold",
    };

    // Auto-assign color based on variant if not explicitly provided
    const getDefaultColor = (variant: TypographyVariant): TypographyColor => {
      if (variant.includes('info')) return 'amber';
      if (variant.includes('Lime')) return 'lime';
      if (variant.includes('sub')) return 'amber';
      if (variant.includes('helper')) return 'secondary';
      if (variant.includes('Heading')) return 'primary';
      return 'primary';
    };

    const finalColor = color || getDefaultColor(variant);

    const typographyClasses = cn(
      variantStyles[variant],
      colorStyles[finalColor],
      weight && weightStyles[weight],
      className
    );

    return createElement(
      Element,
      {
        ref,
        className: typographyClasses,
        ...props,
      },
      children
    );
  }
);

Typography.displayName = "Typography";

export default Typography;