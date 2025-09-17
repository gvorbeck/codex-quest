import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/utils";

type SkeletonVariant =
  | "text"
  | "card"
  | "circle"
  | "rect"
  | "stat"
  | "table-row";
type SkeletonSize = "sm" | "md" | "lg" | "xl";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the skeleton */
  variant?: SkeletonVariant;
  /** Size of the skeleton */
  size?: SkeletonSize;
  /** Custom width (overrides size-based width) */
  width?: string | number;
  /** Custom height (overrides size-based height) */
  height?: string | number;
  /** Number of lines for text variant */
  lines?: number;
  /** Whether to show shimmer animation */
  animate?: boolean;
  /** Accessible label for screen readers */
  label?: string;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = "text",
      size = "md",
      width,
      height,
      lines = 1,
      animate = true,
      label = "Loading...",
      className,
      ...props
    },
    ref
  ) => {
    // Base skeleton styles with shimmer animation
    const baseStyles = cn(
      "bg-zinc-700 rounded",
      animate && "relative overflow-hidden",
      animate &&
        "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-zinc-600/40 before:to-transparent before:animate-[shimmer_1.5s_infinite]"
    );

    // Variant-specific styles
    const getVariantStyles = () => {
      switch (variant) {
        case "text":
          return "rounded-md";
        case "card":
          return "rounded-lg";
        case "circle":
          return "rounded-full";
        case "rect":
          return "rounded";
        case "stat":
          return "rounded-lg";
        case "table-row":
          return "rounded-sm";
        default:
          return "rounded-md";
      }
    };

    // Size-based dimensions
    const getSizeDimensions = () => {
      if (width || height) {
        return null;
      }

      const dimensions = {
        text: {
          sm: { width: "w-16", height: "h-3" },
          md: { width: "w-24", height: "h-4" },
          lg: { width: "w-32", height: "h-5" },
          xl: { width: "w-48", height: "h-6" },
        },
        card: {
          sm: { width: "w-32", height: "h-20" },
          md: { width: "w-48", height: "h-32" },
          lg: { width: "w-64", height: "h-40" },
          xl: { width: "w-80", height: "h-48" },
        },
        circle: {
          sm: { width: "w-6", height: "w-6" },
          md: { width: "w-8", height: "w-8" },
          lg: { width: "w-12", height: "w-12" },
          xl: { width: "w-16", height: "w-16" },
        },
        rect: {
          sm: { width: "w-16", height: "h-8" },
          md: { width: "w-24", height: "h-12" },
          lg: { width: "w-32", height: "h-16" },
          xl: { width: "w-48", height: "h-20" },
        },
        stat: {
          sm: { width: "w-20", height: "h-12" },
          md: { width: "w-24", height: "h-16" },
          lg: { width: "w-32", height: "h-20" },
          xl: { width: "w-40", height: "h-24" },
        },
        "table-row": {
          sm: { width: "w-full", height: "h-8" },
          md: { width: "w-full", height: "h-10" },
          lg: { width: "w-full", height: "h-12" },
          xl: { width: "w-full", height: "h-14" },
        },
      } as const;

      return dimensions[variant]?.[size] || dimensions.text.md;
    };

    // Custom dimensions override size-based ones
    const getCustomStyles = () => {
      const styles: Record<string, string | number> = {};

      if (width) {
        styles["width"] = typeof width === "number" ? `${width}px` : width;
      }
      if (height) {
        styles["height"] = typeof height === "number" ? `${height}px` : height;
      }

      return styles;
    };

    const sizeDimensions = getSizeDimensions();
    const customStyles = getCustomStyles();
    const hasCustomDimensions = width || height;

    const skeletonClasses = cn(
      baseStyles,
      getVariantStyles(),
      !hasCustomDimensions && sizeDimensions?.width,
      !hasCustomDimensions && sizeDimensions?.height,
      className
    );

    // For text variant with multiple lines
    if (variant === "text" && lines > 1) {
      return (
        <div
          ref={ref}
          className="space-y-2"
          role="status"
          aria-label={label}
          aria-hidden="true"
          {...props}
        >
          {Array.from({ length: lines }).map((_, index) => {
            const lineClasses = cn(
              skeletonClasses,
              // Make last line slightly shorter for more realistic look
              index === lines - 1 && !hasCustomDimensions && "w-3/4"
            );

            return (
              <div key={index} className={lineClasses} style={customStyles} />
            );
          })}
        </div>
      );
    }

    // Single skeleton element
    return (
      <div
        ref={ref}
        className={skeletonClasses}
        style={customStyles}
        role="status"
        aria-label={label}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Compound components for common patterns
export const SkeletonText = forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "variant">
>((props, ref) => <Skeleton ref={ref} variant="text" {...props} />);
SkeletonText.displayName = "SkeletonText";

export const SkeletonCard = forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "variant">
>((props, ref) => <Skeleton ref={ref} variant="card" {...props} />);
SkeletonCard.displayName = "SkeletonCard";

export const SkeletonCircle = forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "variant">
>((props, ref) => <Skeleton ref={ref} variant="circle" {...props} />);
SkeletonCircle.displayName = "SkeletonCircle";

export const SkeletonStat = forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "variant">
>((props, ref) => <Skeleton ref={ref} variant="stat" {...props} />);
SkeletonStat.displayName = "SkeletonStat";

export const SkeletonTableRow = forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "variant">
>((props, ref) => <Skeleton ref={ref} variant="table-row" {...props} />);
SkeletonTableRow.displayName = "SkeletonTableRow";

// Composite skeleton patterns for RPG-specific content
interface SkeletonStatBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of stats to show */
  stats?: number;
  /** Whether to show a title skeleton */
  showTitle?: boolean;
  /** Custom label for accessibility */
  label?: string;
}

export const SkeletonStatBlock = forwardRef<
  HTMLDivElement,
  SkeletonStatBlockProps
>(
  (
    {
      stats = 6,
      showTitle = true,
      label = "Loading character stats...",
      className,
      ...props
    },
    ref
  ) => {
    const blockClasses = cn("space-y-4", className);

    return (
      <div
        ref={ref}
        className={blockClasses}
        role="status"
        aria-label={label}
        {...props}
      >
        {showTitle && <SkeletonText size="lg" width="60%" />}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: stats }).map((_, index) => (
            <SkeletonStat key={index} size="md" />
          ))}
        </div>
      </div>
    );
  }
);
SkeletonStatBlock.displayName = "SkeletonStatBlock";

interface SkeletonListProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of list items */
  items?: number;
  /** Whether to show avatars/icons */
  showAvatar?: boolean;
  /** Custom label for accessibility */
  label?: string;
}

export const SkeletonList = forwardRef<HTMLDivElement, SkeletonListProps>(
  (
    {
      items = 3,
      showAvatar = false,
      label = "Loading list...",
      className,
      ...props
    },
    ref
  ) => {
    const listClasses = cn("space-y-3", className);

    return (
      <div
        ref={ref}
        className={listClasses}
        role="status"
        aria-label={label}
        {...props}
      >
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            {showAvatar && <SkeletonCircle size="md" />}
            <div className="flex-1 space-y-2">
              <SkeletonText size="md" width="40%" />
              <SkeletonText size="sm" width="60%" />
            </div>
          </div>
        ))}
      </div>
    );
  }
);
SkeletonList.displayName = "SkeletonList";

export { Skeleton };
