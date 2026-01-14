import { useMemo } from "react";
import { Details } from "@/components/ui/composite";
import { SectionWrapper } from "@/components/ui/core/layout";
import { SIZE_STYLES, LEVEL_UP_CONSTANTS } from "@/constants";
import {
  calculateArmorClass,
  calculateMovementRate,
  calculateHitDie,
  getClassById,
} from "@/utils";
import type { Character, TwoHPClass } from "@/types";

interface CharacterDefenseProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function CharacterDefense({
  character,
  className = "",
  size = "md",
}: CharacterDefenseProps) {
  const currentSize = SIZE_STYLES[size];
  // Calculate Armor Class
  const armorClass = useMemo(() => {
    return calculateArmorClass(character);
  }, [character]);

  // Calculate Movement Rate
  const movementRate = useMemo(() => {
    return calculateMovementRate(character);
  }, [character]);

  // Calculate Hit Dice
  const hitDice = useMemo(() => {
    // Get the base hit die (handles both standard and custom classes)
    const baseHitDie = calculateHitDie(character);
    if (!baseHitDie) {
      return "1d6"; // Fallback
    }

    // Extract die type from hitDie string (e.g., "1d8" -> "d8")
    const dieType = baseHitDie.substring(1); // Remove the "1" at the beginning

    // For custom classes or levels 1-9, just multiply by level
    if (character.level <= 9) {
      return `${character.level}${dieType}`;
    }

    // Handle levels above 9 - cap at 9 dice and add flat bonus
    // For custom classes, default to +1 HP per level after 9th
    const characterClass = character.class ? getClassById(character.class) : null;

    let hpPerLevel = 1; // Default +1 HP per level for custom classes

    if (characterClass) {
      // Standard class - check if it gets +2 HP per level after 9th level
      // Use centralized constant for all classes that get +2 HP per level
      const classId = characterClass.id;
      if (LEVEL_UP_CONSTANTS.TWO_HP_CLASSES.includes(classId as TwoHPClass)) {
        hpPerLevel = 2;
      }
    }

    const bonusHitPoints = (character.level - 9) * hpPerLevel;
    return `9${dieType}+${bonusHitPoints}`;
  }, [character]);

  const detailsItems = [
    {
      label: "Armor Class",
      children: armorClass.toString(),
    },
    {
      label: "Movement",
      children: movementRate,
    },
    {
      label: "Hit Dice",
      children: hitDice,
    },
  ];

  return (
    <SectionWrapper
      title="Defense & Movement"
      size={size}
      className={className}
    >
      <div className={currentSize.container}>
        <Details items={detailsItems} layout="vertical" size={size} />
      </div>
    </SectionWrapper>
  );
}
