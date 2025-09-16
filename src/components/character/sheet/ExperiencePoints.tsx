import { forwardRef } from "react";
import { SectionWrapper } from "@/components/ui/layout";
import { ExperienceTracker } from "@/components/character/sheet";
import { InfoTooltip } from "@/components/ui/feedback";
import { DESIGN_TOKENS, SIZE_STYLES } from "@/constants";
import type { Character, Class } from "@/types";

interface ExperiencePointsProps {
  character: Character & { id?: string };
  classes: Class[];
  editable?: boolean;
  onChange?: (xp: number) => void;
  onCharacterChange?: (character: Character) => void;
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
      onCharacterChange,
      className = "",
      size = "md",
    },
    ref
  ) => {
    const currentSize = SIZE_STYLES[size];

    const titleWithTooltip = (
      <div className="flex items-center gap-2">
        Experience Points
        <InfoTooltip content="Try: +100, -50, or enter a number directly" />
      </div>
    );

    return (
      <SectionWrapper
        ref={ref}
        title={titleWithTooltip}
        size={size}
        className={className}
      >
        {/* Content */}
        <div className={currentSize.container}>
          {editable ? (
            <ExperienceTracker
              character={character}
              classes={classes}
              {...(onChange && { onChange })}
              {...(onCharacterChange && { onCharacterChange })}
            />
          ) : (
            <div className="text-center">
              <div
                className={`${DESIGN_TOKENS.colors.text.primary} text-2xl font-bold`}
              >
                {character.xp}
              </div>
            </div>
          )}
        </div>
      </SectionWrapper>
    );
  }
);

ExperiencePoints.displayName = "ExperiencePoints";

export default ExperiencePoints;
