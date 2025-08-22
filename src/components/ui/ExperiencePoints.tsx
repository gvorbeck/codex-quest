import { forwardRef } from "react";
import SectionHeader from "./SectionHeader";
import ExperienceTracker from "./ExperienceTracker";
import InfoTooltip from "./InfoTooltip";
import { DESIGN_TOKENS, SIZE_STYLES } from "@/constants/designTokens";
import type { Character, Class } from "@/types/character";

interface ExperiencePointsProps {
  character: Character & { id?: string };
  classes: Class[];
  editable?: boolean;
  onChange?: (xp: number) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}


const ExperiencePoints = forwardRef<HTMLDivElement, ExperiencePointsProps>(
  (
    {
      character,
      classes,
      editable = false,
      onChange,
      className = "",
      size = "md",
    },
    ref
  ) => {
    const currentSize = SIZE_STYLES[size];

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

    const titleWithTooltip = (
      <div className="flex items-center gap-2">
        Experience Points
        <InfoTooltip content="Try: +100, -50, or enter a number directly" />
      </div>
    );

    return (
      <div ref={ref} className={containerClasses}>
        {/* Header */}
        <SectionHeader title={titleWithTooltip} size={size} />

        {/* Content */}
        <div className={currentSize.container}>
          {editable ? (
            <ExperienceTracker
              character={character}
              classes={classes}
              {...(onChange && { onChange })}
            />
          ) : (
            <div className="text-center">
              <div className={`${DESIGN_TOKENS.colors.text.primary} text-2xl font-bold`}>
                {character.xp}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ExperiencePoints.displayName = "ExperiencePoints";

export default ExperiencePoints;