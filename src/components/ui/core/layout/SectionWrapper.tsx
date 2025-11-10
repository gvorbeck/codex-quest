import { forwardRef, useState, useCallback } from "react";
import { SectionHeader } from "@/components";
import { DESIGN_TOKENS } from "@/constants";
import { cn } from "@/utils";
import { useUiStore } from "@/stores";

interface SectionWrapperProps {
  title: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  collapsible?: boolean;
  collapsibleKey?: string; // Optional key for localStorage persistence
}

const SectionWrapper = forwardRef<HTMLDivElement, SectionWrapperProps>(
  (
    {
      title,
      className = "",
      size = "md",
      children,
      collapsible = false,
      collapsibleKey,
    },
    ref
  ) => {
    // Use Zustand store to persist collapse state if collapsibleKey is provided
    const collapsedSections = useUiStore((state) => state.collapsedSections);
    const setSectionCollapsed = useUiStore(
      (state) => state.setSectionCollapsed
    );

    // Use local state if no collapsibleKey provided
    const [localCollapsed, setLocalCollapsed] = useState(false);

    // Determine which state to use
    const isCollapsed = collapsibleKey
      ? (collapsedSections[collapsibleKey] || false)
      : localCollapsed;

    const toggleCollapse = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (collapsibleKey) {
        setSectionCollapsed(collapsibleKey, !isCollapsed);
      } else {
        setLocalCollapsed(!isCollapsed);
      }
    }, [isCollapsed, collapsibleKey, setSectionCollapsed, setLocalCollapsed]);

    const containerClasses = cn(
      DESIGN_TOKENS.colors.bg.accent,
      DESIGN_TOKENS.effects.rounded,
      "overflow-hidden relative",
      "border-2",
      DESIGN_TOKENS.colors.border.primary,
      DESIGN_TOKENS.effects.shadow,
      DESIGN_TOKENS.effects.transition,
      "hover:shadow-[0_6px_0_0_#3f3f46,0_0_25px_rgba(0,0,0,0.4)]",
      "group",
      className
    );

    const collapseButtonClasses = cn(
      "p-1 rounded transition-transform duration-200",
      "hover:bg-white/10 focus:bg-white/10 focus:outline-none",
      "focus:ring-2 focus:ring-amber-400/50",
      isCollapsed && "rotate-180"
    );

    // Create collapse button as extra content if collapsible
    const collapseButton = collapsible ? (
      <button
        type="button"
        onClick={toggleCollapse}
        className={collapseButtonClasses}
        aria-label={isCollapsed ? "Expand section" : "Collapse section"}
        aria-expanded={!isCollapsed}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    ) : undefined;

    return (
      <div ref={ref} className={containerClasses}>
        <SectionHeader title={title} extra={collapseButton} size={size} />
        {!isCollapsed && children}
      </div>
    );
  }
);

SectionWrapper.displayName = "SectionWrapper";

export default SectionWrapper;
