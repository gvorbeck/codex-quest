import { useMemo } from "react";
import { useModal } from "@/hooks/useModal";
import { SectionWrapper } from "@/components/ui/layout";
import { Card, Typography } from "@/components/ui/design-system";
import { SkillDescriptionItem, TextHeader } from "@/components/ui/display";
import { SIZE_STYLES } from "@/constants/designTokens";
import RollableButton from "@/components/ui/dice/RollableButton";
import Button from "@/components/ui/inputs/Button";
import { useDiceRoll } from "@/hooks/useDiceRoll";
import { allClasses } from "@/data/classes";
import { logger } from "@/utils/logger";
import {
  ALL_SKILLS,
  SKILL_DESCRIPTIONS,
  CLASSES_WITH_SKILLS,
  SKILL_CONSTANTS,
  type SkillKey,
  type SkillClassKey,
} from "@/constants/skills";
import type { Character } from "@/types/character";

interface ClassSkillsProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
  id?: string;
}


export default function ClassSkills({
  character,
  className = "",
  size = "md",
  id = SKILL_CONSTANTS.COMPONENT_ID_PREFIX,
}: ClassSkillsProps) {
  const { isOpen: showDetails, toggle: toggleDetails } = useModal();
  const currentSize = SIZE_STYLES[size];
  const { rollPercentile } = useDiceRoll();

  // Check if character has a class with skills using optimized lookup
  const characterClassInfo = useMemo(() => {
    const skillClass = character.class?.find((cls): cls is SkillClassKey => 
      cls in CLASSES_WITH_SKILLS
    );
    
    if (skillClass) {
      const classInfo = CLASSES_WITH_SKILLS[skillClass];
      return {
        hasSkills: true,
        className: skillClass,
        displayName: classInfo.displayName,
        abilityType: classInfo.abilityType,
      };
    }

    return { 
      hasSkills: false, 
      className: null, 
      displayName: null, 
      abilityType: "Skill" as const 
    };
  }, [character.class]);

  // Get class skills for current level
  const classSkills = useMemo(() => {
    if (!characterClassInfo.hasSkills || !characterClassInfo.className) {
      return null;
    }

    // Find the appropriate class data
    const classData = allClasses.find(
      (cls) => cls.id === characterClassInfo.className
    );
    
    if (!classData?.thiefSkills) {
      logger.warn(`Missing skills for class: ${characterClassInfo.className}`);
      return null;
    }

    // Get skills for current level (or closest lower level)
    // Ensure level is at least 1
    const level = Math.max(
      SKILL_CONSTANTS.DEFAULT_LEVEL, 
      character.level || SKILL_CONSTANTS.DEFAULT_LEVEL
    );
    const skillsForLevel =
      classData.thiefSkills[level] || classData.thiefSkills[SKILL_CONSTANTS.DEFAULT_LEVEL];

    if (!skillsForLevel) {
      logger.warn(`No skill data found for ${characterClassInfo.className} level ${level}`);
      return null;
    }

    return skillsForLevel;
  }, [character.level, characterClassInfo]);

  // Don't render if character doesn't have class skills
  if (!characterClassInfo.hasSkills || !classSkills) {
    return null;
  }

  const { className: skillClassName, abilityType } = characterClassInfo;
  const isRanger = skillClassName === "ranger";
  const isScout = skillClassName === "scout";

  const detailsContentId = `${id}-details`;
  
  const detailsContent = (
    <Card 
      id={detailsContentId} 
      className="mt-4" 
      variant="nested" 
      size="compact"
    >
      <Typography 
        variant="h4" 
        weight="semibold" 
        className="mb-3 text-sm"
      >
        {abilityType} Descriptions:
      </Typography>
      <div className="space-y-2 text-xs">
        {Object.entries(SKILL_DESCRIPTIONS)
          .filter(([key]) => key in classSkills) // Only show skills this class actually has
          .map(([key, description]) => (
            <SkillDescriptionItem
              key={key}
              title={ALL_SKILLS[key as SkillKey]}
              description={description}
              variant="simple"
            />
          ))}
      </div>
      <div className="mt-3 pt-3 border-t border-zinc-700">
        <div className="text-xs text-zinc-400">
          <TextHeader variant="h6" size="sm" underlined={false} className="mb-1 text-xs">
            How Skills Work:
          </TextHeader>
          <ul className="space-y-1 list-disc list-inside">
            <li>Skills improve automatically as you gain levels</li>
            <li>Success is based on rolling percentile dice (d100)</li>
            <li>Roll your skill percentage or lower to succeed</li>
          </ul>
        </div>
      </div>
    </Card>
  );

  return (
    <SectionWrapper
      title={characterClassInfo.displayName}
      size={size}
      className={className}
    >
      <div className={currentSize.container}>
        <div className="space-y-3">
          {Object.entries(ALL_SKILLS).map(([skillKey, skillLabel]) => {
            const skillValue = classSkills[skillKey];
            if (!skillValue) return null;

            // Generate tooltip with class-specific modifiers
            const baseTooltip = `Roll ${skillLabel}: d100 vs ${skillValue}% (01-05 always succeed, 96-100 always fail)`;
            const trackingNote = (isRanger || isScout) && skillKey === 'tracking' ? ' (Wilderness only)' : '';
            const urbanPenalty = isRanger && (skillKey === 'moveSilently' || skillKey === 'hide') 
              ? ` (-${SKILL_CONSTANTS.URBAN_PENALTY}% penalty in urban areas)` : '';
            const tooltip = `${baseTooltip}${trackingNote}${urbanPenalty}`;

            return (
              <RollableButton
                key={skillKey}
                label={skillLabel}
                value={`${skillValue}%`}
                onClick={() => rollPercentile(skillLabel, skillValue)}
                tooltip={tooltip}
                size={size}
              />
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-700">
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleDetails}
            className="w-full text-xs"
            aria-expanded={showDetails}
            aria-controls={detailsContentId}
          >
            {showDetails ? "Hide" : "Show"} {abilityType} Details
          </Button>
        </div>

        {showDetails && detailsContent}
      </div>
    </SectionWrapper>
  );
}
