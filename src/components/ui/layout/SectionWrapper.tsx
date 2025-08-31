import { forwardRef } from "react";
import { SectionHeader } from "@/components/ui/display";
import { DESIGN_TOKENS } from "@/constants/designTokens";
import { cn } from "@/constants/styles";

interface SectionWrapperProps {
  title: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const SectionWrapper = forwardRef<HTMLDivElement, SectionWrapperProps>(
  ({ title, className = "", size = "md", children }, ref) => {
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
      className,
    );

    return (
      <div ref={ref} className={containerClasses}>
        <SectionHeader title={title} size={size} />
        {children}
      </div>
    );
  }
);

SectionWrapper.displayName = "SectionWrapper";

export default SectionWrapper;