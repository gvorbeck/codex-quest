import { useMemo } from "react";
import { useModal } from "@/hooks/useModal";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { Card, Typography } from "@/components/ui/design-system";
import { SkillDescriptionItem } from "@/components/ui/display";
import { SIZE_STYLES } from "@/constants/designTokens";
import RollableButton from "@/components/ui/dice/RollableButton";
import Button from "@/components/ui/inputs/Button";
import { useDiceRoll } from "@/hooks/useDiceRoll";
import { allClasses } from "@/data/classes";
import { logger } from "@/utils/logger";
import type { Character } from "@/types/character";

interface ThiefAssassinSkillsProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
  id?: string;
}

// Define the skill names and their display labels
const THIEF_SKILLS = {
  openLocks: "Open Locks",
  removeTraps: "Remove Traps",
  pickPockets: "Pick Pockets",
  moveSilently: "Move Silently",
  climbWalls: "Climb Walls",
  hide: "Hide",
  listen: "Listen",
  poison: "Poison",
} as const;

// Constants for skill system
const DEFAULT_LEVEL = 1;
const COMPONENT_ID_PREFIX = "thief-skills";

const SKILL_DESCRIPTIONS = {
  openLocks:
    "Attempt to unlock doors, chests, and other locked mechanisms without the proper key.",
  removeTraps:
    "Detect and disarm mechanical traps on doors, chests, and other objects.",
  pickPockets: "Steal small items from others without being noticed.",
  moveSilently: "Move without making noise, useful for sneaking past enemies.",
  climbWalls: "Scale vertical surfaces like walls, cliffs, or buildings.",
  hide: "Conceal yourself in shadows or behind cover to avoid detection.",
  listen: "Detect sounds through doors or walls, overhear conversations.",
  poison:
    "Create and use lethal poisons for weapons and assassination attempts.",
};

export default function ThiefAssassinSkills({
  character,
  className = "",
  size = "md",
  id = COMPONENT_ID_PREFIX,
}: ThiefAssassinSkillsProps) {
  const { isOpen: showDetails, toggle: toggleDetails } = useModal();
  const currentSize = SIZE_STYLES[size];
  const { rollPercentile } = useDiceRoll();

  // Check if character is a thief-like class (thief or assassin)
  const characterClassInfo = useMemo(() => {
    const isThief = character.class?.some((classId) => classId === "thief");
    const isAssassin = character.class?.some(
      (classId) => classId === "assassin"
    );

    if (isThief) {
      return {
        hasThiefSkills: true,
        className: "thief",
        displayName: "Thief Skills",
      };
    } else if (isAssassin) {
      return {
        hasThiefSkills: true,
        className: "assassin",
        displayName: "Assassin Abilities",
      };
    }

    return { hasThiefSkills: false, className: null, displayName: null };
  }, [character.class]);

  // Get thief skills for current level
  const thiefSkills = useMemo(() => {
    if (!characterClassInfo.hasThiefSkills || !characterClassInfo.className) {
      return null;
    }

    // Find the appropriate class data
    const classData = allClasses.find(
      (cls) => cls.id === characterClassInfo.className
    );
    
    if (!classData?.thiefSkills) {
      logger.warn(`Missing thief skills for class: ${characterClassInfo.className}`);
      return null;
    }

    // Get skills for current level (or closest lower level)
    // Ensure level is at least 1
    const level = Math.max(DEFAULT_LEVEL, character.level || DEFAULT_LEVEL);
    const skillsForLevel =
      classData.thiefSkills[level] || classData.thiefSkills[DEFAULT_LEVEL];

    if (!skillsForLevel) {
      logger.warn(`No skill data found for ${characterClassInfo.className} level ${level}`);
      return null;
    }

    return skillsForLevel;
  }, [character.level, characterClassInfo]);

  // Don't render if character doesn't have thief skills
  if (!characterClassInfo.hasThiefSkills || !thiefSkills) {
    return null;
  }

  const isAssassin = characterClassInfo.className === "assassin";

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
        {isAssassin ? "Ability" : "Skill"} Descriptions:
      </Typography>
      <div className="space-y-2 text-xs">
        {Object.entries(SKILL_DESCRIPTIONS)
          .filter(([key]) => key in thiefSkills) // Only show skills this class actually has
          .map(([key, description]) => (
            <SkillDescriptionItem
              key={key}
              title={THIEF_SKILLS[key as keyof typeof THIEF_SKILLS]}
              description={description}
              variant="simple"
            />
          ))}
      </div>
      <div className="mt-3 pt-3 border-t border-zinc-700">
        <div className="text-xs text-zinc-400">
          <div className="font-medium mb-1">How Skills Work:</div>
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
    <CharacterSheetSectionWrapper
      title={characterClassInfo.displayName}
      size={size}
      className={className}
    >
      <div className={currentSize.container}>
        <div className="space-y-3">
          {Object.entries(THIEF_SKILLS).map(([skillKey, skillLabel]) => {
            const skillValue = thiefSkills[skillKey];
            if (!skillValue) return null;

            return (
              <RollableButton
                key={skillKey}
                label={skillLabel}
                value={`${skillValue}%`}
                onClick={() => rollPercentile(skillLabel, skillValue)}
                tooltip={`Roll ${skillLabel}: d100 vs ${skillValue}% (01-05 always succeed, 96-100 always fail)`}
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
            {showDetails ? "Hide" : "Show"} {isAssassin ? "Ability" : "Skill"}{" "}
            Details
          </Button>
        </div>

        {showDetails && detailsContent}
      </div>
    </CharacterSheetSectionWrapper>
  );
}
