import { forwardRef, useMemo } from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/constants/styles";
import { DESIGN_TOKENS } from "@/constants/designTokens";

// List design token mappings
const LIST_DESIGN_TOKENS = {
  icon: DESIGN_TOKENS.colors.text.accent,
  feature: DESIGN_TOKENS.colors.text.secondary,
  grid: DESIGN_TOKENS.colors.text.muted,
} as const;

// List Types
type ListVariant =
  | "bullet" // Standard bullet points
  | "disc" // CSS disc bullets
  | "custom" // Custom bullet with icon/element
  | "grid" // Grid layout for items
  | "feature" // Feature list with icons
  | "decimal" // Numbered list
  | "steps" // Step-by-step instructions
  | "breadcrumb" // Navigation breadcrumbs
  | "animated"; // Animated list items

type ListSize = "sm" | "md" | "lg";
type ListSpacing = "tight" | "normal" | "loose";

// List Props
interface ListProps
  extends Omit<
    HTMLAttributes<HTMLUListElement | HTMLOListElement>,
    "children"
  > {
  variant?: ListVariant;
  size?: ListSize;
  spacing?: ListSpacing;
  children: ReactNode;
  ordered?: boolean; // Force ordered list regardless of variant
  className?: string;
}

// List Item Props
interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

// Size mappings
const sizeStyles = {
  sm: {
    text: "text-xs",
    spacing: "gap-1",
  },
  md: {
    text: "text-sm",
    spacing: "gap-2",
  },
  lg: {
    text: "text-base",
    spacing: "gap-3",
  },
};

// Spacing mappings
const spacingStyles = {
  tight: "space-y-1",
  normal: "space-y-2",
  loose: "space-y-3",
};

// Variant styles
const variantStyles = {
  bullet: "list-none",
  disc: "list-disc list-inside",
  custom: "list-none",
  grid: "list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  feature: "list-none",
  decimal: "list-decimal list-inside",
  steps: "list-decimal list-inside",
  breadcrumb: "list-none flex items-center",
  animated:
    "list-none space-y-2 [&>li]:transition-all [&>li]:duration-200 [&>li]:ease-in-out",
};

/**
 * A flexible list component supporting multiple variants and styling options.
 *
 * @param variant - The visual style of the list (bullet, disc, custom, grid, feature, decimal, steps, breadcrumb)
 * @param size - Text size and spacing (sm, md, lg)
 * @param spacing - Vertical spacing between items (tight, normal, loose)
 * @param ordered - Force ordered list element regardless of variant
 * @param children - List content (typically ListItem components)
 * @param className - Additional CSS classes to apply
 */
const List = forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  (
    {
      variant = "bullet",
      size = "md",
      spacing = "normal",
      ordered = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    // Determine element type
    const shouldBeOrdered =
      ordered || variant === "decimal" || variant === "steps";

    // Special case for breadcrumb spacing
    const spacingClass =
      variant === "breadcrumb" ? "gap-2" : spacingStyles[spacing];

    // Grid spacing override
    const finalSpacing =
      variant === "grid"
        ? `${spacingStyles[spacing].replace("space-y-", "gap-")} gap-1`
        : spacingClass;

    // Memoize style calculations for performance
    const listClasses = useMemo(
      () =>
        cn(
          variantStyles[variant],
          sizeStyles[size].text,
          finalSpacing,
          variant === "steps" && "space-y-1", // Override for steps
          className
        ),
      [variant, size, finalSpacing, className]
    );

    const commonProps = {
      className: listClasses,
      role: variant === "breadcrumb" ? "list" : undefined,
      "aria-label":
        variant === "steps"
          ? "Step-by-step instructions"
          : variant === "feature"
          ? "Feature list"
          : undefined,
      ...props,
    };

    if (shouldBeOrdered) {
      return (
        <ol ref={ref as React.RefObject<HTMLOListElement>} {...commonProps}>
          {children}
        </ol>
      );
    }

    return (
      <ul ref={ref as React.RefObject<HTMLUListElement>} {...commonProps}>
        {children}
      </ul>
    );
  }
);

/**
 * A flexible list item component that can display icons and custom content.
 *
 * @param icon - Optional icon or element to display before the content
 * @param children - The main content of the list item
 * @param className - Additional CSS classes to apply
 */
const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ icon, children, className, ...props }, ref) => {
    const itemClasses = cn("flex items-start", icon ? "gap-2" : "", className);
    const iconClasses = cn(LIST_DESIGN_TOKENS.icon, "mt-1 flex-shrink-0");

    return (
      <li ref={ref} className={itemClasses} {...props}>
        {icon && <span className={iconClasses}>{icon}</span>}
        {children}
      </li>
    );
  }
);

/**
 * Specialized list item for feature highlights with consistent bullet styling.
 * Pre-configured with a bullet icon and secondary text color.
 */
const FeatureListItem = forwardRef<HTMLLIElement, Omit<ListItemProps, "icon">>(
  ({ children, className, ...props }, ref) => {
    const featureClasses = cn(LIST_DESIGN_TOKENS.feature, className);

    return (
      <ListItem ref={ref} icon="•" className={featureClasses} {...props}>
        {children}
      </ListItem>
    );
  }
);

/**
 * Specialized list item for step-by-step instructions.
 * Used with ordered lists (variant="steps") for numbered instructions.
 */
const StepListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, className, ...props }, ref) => {
    const stepClasses = cn("", className);

    return (
      <ListItem ref={ref} className={stepClasses} {...props}>
        {children}
      </ListItem>
    );
  }
);

/**
 * Specialized list item for grid layouts with subtle bullet points.
 * Pre-configured with a small circular bullet and muted text color.
 */
const GridListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, className, ...props }, ref) => {
    const gridClasses = cn(LIST_DESIGN_TOKENS.grid, "py-0.5", className);

    return (
      <ListItem
        ref={ref}
        icon={
          <span className="inline-block w-1 h-1 bg-zinc-400 dark:bg-zinc-500 rounded-full"></span>
        }
        className={gridClasses}
        {...props}
      >
        {children}
      </ListItem>
    );
  }
);

// Display names
List.displayName = "List";
ListItem.displayName = "ListItem";
FeatureListItem.displayName = "FeatureListItem";
StepListItem.displayName = "StepListItem";
GridListItem.displayName = "GridListItem";

export default List;
export { ListItem, FeatureListItem, StepListItem, GridListItem };
export type { ListProps, ListItemProps, ListVariant, ListSize, ListSpacing };
