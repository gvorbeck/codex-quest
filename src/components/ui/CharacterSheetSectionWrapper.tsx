import { forwardRef } from "react";
import SectionHeader from "./SectionHeader";
import { DESIGN_TOKENS } from "@/constants/designTokens";

interface CharacterSheetSectionWrapperProps {
  title: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const CharacterSheetSectionWrapper = forwardRef<HTMLDivElement, CharacterSheetSectionWrapperProps>(
  ({ title, className = "", size = "md", children }, ref) => {
    const containerClasses = [
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
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={containerClasses}>
        <SectionHeader title={title} size={size} />
        {children}
      </div>
    );
  }
);

CharacterSheetSectionWrapper.displayName = "CharacterSheetSectionWrapper";

export default CharacterSheetSectionWrapper;