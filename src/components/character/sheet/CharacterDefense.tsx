import { useMemo } from "react";
import { Details } from "@/components/ui/display";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { allClasses } from "@/data/classes";
import { SIZE_STYLES } from "@/constants/designTokens";
import type { Character } from "@/types/character";

interface CharacterDefenseProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function CharacterDefense({ character, className = "", size = "md" }: CharacterDefenseProps) {
  const currentSize = SIZE_STYLES[size];
  // Calculate Armor Class
  const armorClass = useMemo(() => {
    // Check for worn armor
    const wornArmor = character.equipment?.find(
      (item) => item.wearing && item.AC !== undefined
    );
    
    if (wornArmor && typeof wornArmor.AC === 'number') {
      return wornArmor.AC;
    }
    
    // Default AC
    return 11;
  }, [character.equipment]);

  // Calculate Movement Rate
  const movementRate = useMemo(() => {
    // Find worn armor to determine armor type
    const wornArmor = character.equipment?.find(
      (item) => item.wearing && item.AC !== undefined
    );
    
    // TODO: Implement encumbrance calculation
    // For now, just return movement based on armor type
    if (!wornArmor) {
      return "40'"; // No armor or magic leather
    }
    
    const armorName = wornArmor.name.toLowerCase();
    
    if (armorName.includes('leather') || armorName.includes('magic')) {
      return "30'"; // Leather armor or magic metal
    }
    
    if (armorName.includes('chain') || armorName.includes('plate') || armorName.includes('mail')) {
      return "20'"; // Metal armor
    }
    
    return "40'"; // Default
  }, [character.equipment]);

  // Calculate Hit Dice
  const hitDice = useMemo(() => {
    if (!character.class || character.class.length === 0) {
      return "1d6"; // Default
    }
    
    // For multi-class characters, use the first class
    const primaryClassId = character.class[0];
    if (!primaryClassId) {
      return "1d6"; // Default
    }
    
    const characterClass = allClasses.find(cls => {
      const normalizedClassId = cls.id.toLowerCase().trim();
      const normalizedPrimaryId = primaryClassId.toLowerCase().trim();
      return normalizedClassId === normalizedPrimaryId;
    });
    
    if (!characterClass) {
      return "1d6"; // Default
    }
    
    // Extract die type from hitDie string (e.g., "1d8" -> "d8")
    const dieType = characterClass.hitDie.substring(1); // Remove the "1" at the beginning
    
    // Multiply by level
    const result = `${character.level}${dieType}`;
    return result;
  }, [character.class, character.level]);

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
    <CharacterSheetSectionWrapper 
      title="Defense & Movement" 
      size={size}
      className={className}
    >
      <div className={currentSize.container}>
        <Details
          items={detailsItems}
          layout="vertical"
          size={size}
        />
      </div>
    </CharacterSheetSectionWrapper>
  );
}