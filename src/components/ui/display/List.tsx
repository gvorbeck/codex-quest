import { forwardRef } from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/constants/styles";

// List Types
type ListVariant =
  | "bullet" // Standard bullet points
  | "disc" // CSS disc bullets
  | "custom" // Custom bullet with icon/element
  | "grid" // Grid layout for items
  | "feature" // Feature list with icons
  | "decimal" // Numbered list
  | "steps" // Step-by-step instructions
  | "breadcrumb"; // Navigation breadcrumbs

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
  grid: "list-none grid grid-cols-1 sm:grid-cols-2",
  feature: "list-none",
  decimal: "list-decimal list-inside",
  steps: "list-decimal list-inside",
  breadcrumb: "list-none flex items-center",
};

// List Component
const List = forwardRef<HTMLElement, ListProps>(
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
      variant === "breadcrumb" ? "space-x-2" : spacingStyles[spacing];

    // Grid spacing override
    const finalSpacing =
      variant === "grid"
        ? `${spacingStyles[spacing].replace("space-y-", "gap-")} gap-1`
        : spacingClass;

    const listClasses = cn(
      variantStyles[variant],
      sizeStyles[size].text,
      finalSpacing,
      variant === "steps" && "space-y-1", // Override for steps
      className
    );

    const commonProps = {
      className: listClasses,
      role: variant === "breadcrumb" ? "list" : undefined,
      ...props,
    };

    if (shouldBeOrdered) {
      return (
        <ol ref={ref as React.ForwardedRef<HTMLOListElement>} {...commonProps}>
          {children}
        </ol>
      );
    }

    return (
      <ul ref={ref as React.ForwardedRef<HTMLUListElement>} {...commonProps}>
        {children}
      </ul>
    );
  }
);

// List Item Component
const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ icon, children, className, ...props }, ref) => {
    const itemClasses = cn("flex items-start", icon ? "gap-2" : "", className);

    return (
      <li ref={ref} className={itemClasses} {...props}>
        {icon && (
          <span className="text-highlight-400 mt-1 flex-shrink-0">{icon}</span>
        )}
        {children}
      </li>
    );
  }
);

// Specialized List Item variants for common patterns
const FeatureListItem = forwardRef<HTMLLIElement, Omit<ListItemProps, "icon">>(
  ({ children, className, ...props }, ref) => (
    <ListItem
      ref={ref}
      icon="•"
      className={cn("text-primary-300", className)}
      {...props}
    >
      {children}
    </ListItem>
  )
);

const StepListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, className, ...props }, ref) => (
    <ListItem ref={ref} className={cn("", className)} {...props}>
      {children}
    </ListItem>
  )
);

const GridListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, className, ...props }, ref) => (
    <ListItem
      ref={ref}
      icon={
        <span className="inline-block w-1 h-1 bg-zinc-400 dark:bg-zinc-500 rounded-full"></span>
      }
      className={cn("text-zinc-700 dark:text-zinc-300 py-0.5", className)}
      {...props}
    >
      {children}
    </ListItem>
  )
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
