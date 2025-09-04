import { forwardRef, useState, useCallback } from "react";
import { SectionHeader } from "@/components/ui/display";
import { DESIGN_TOKENS } from "@/constants/designTokens";
import { cn } from "@/constants/styles";
import { useLocalStorage } from "@/hooks";

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
    // Use localStorage to persist collapse state if collapsibleKey is provided
    const [persistedCollapsed, setPersistedCollapsed] = useLocalStorage(
      collapsibleKey ? `section-collapsed-${collapsibleKey}` : "temp-key",
      false
    );

    // Use local state if no collapsibleKey provided
    const [localCollapsed, setLocalCollapsed] = useState(false);

    // Determine which state to use
    const isCollapsed = collapsibleKey ? persistedCollapsed : localCollapsed;
    const setIsCollapsed = collapsibleKey
      ? setPersistedCollapsed
      : setLocalCollapsed;

    const toggleCollapse = useCallback(() => {
      setIsCollapsed(!isCollapsed);
    }, [isCollapsed, setIsCollapsed]);

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
