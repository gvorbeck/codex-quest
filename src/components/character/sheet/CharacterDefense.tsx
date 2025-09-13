import { useMemo } from "react";
import { Details } from "@/components/ui/display";
import { SectionWrapper } from "@/components/ui/layout";
import { allClasses } from "@/data/classes";
import { SIZE_STYLES } from "@/constants/designTokens";
import {
  calculateArmorClass,
  calculateMovementRate,
} from "@/utils/characterCalculations";
import { calculateHitDie } from "@/utils/hitDice";
import type { Character } from "@/types/character";

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
    const primaryClassId = character.class[0];
    const characterClass = allClasses.find((cls) => cls.id === primaryClassId);
    
    let hpPerLevel = 1; // Default +1 HP per level for custom classes
    
    if (characterClass) {
      // Standard class - check if it gets +2 HP per level after 9th level
      const className = characterClass.name.toLowerCase();
      const twoHpClasses = [
        "fighter",
        "thief", 
        "assassin",
        "barbarian",
        "ranger",
        "paladin",
        "scout",
      ];
      if (twoHpClasses.includes(className)) {
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
