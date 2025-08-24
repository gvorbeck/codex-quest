import { forwardRef } from "react";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { ExperienceTracker } from "@/components/character/sheet";
import { InfoTooltip } from "@/components/ui/feedback";
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


    const titleWithTooltip = (
      <div className="flex items-center gap-2">
        Experience Points
        <InfoTooltip content="Try: +100, -50, or enter a number directly" />
      </div>
    );

    return (
      <CharacterSheetSectionWrapper 
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
            />
          ) : (
            <div className="text-center">
              <div className={`${DESIGN_TOKENS.colors.text.primary} text-2xl font-bold`}>
                {character.xp}
              </div>
            </div>
          )}
        </div>
      </CharacterSheetSectionWrapper>
    );
  }
);

ExperiencePoints.displayName = "ExperiencePoints";

export default ExperiencePoints;