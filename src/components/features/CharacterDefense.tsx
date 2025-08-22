import { useMemo } from "react";
import { Details } from "@/components/ui";
import { allClasses } from "@/data/classes";
import type { Character } from "@/types/character";

interface CharacterDefenseProps {
  character: Character;
}

export default function CharacterDefense({ character }: CharacterDefenseProps) {
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
    const characterClass = allClasses.find(cls => cls.id === primaryClassId);
    
    if (!characterClass) {
      return "1d6"; // Default
    }
    
    // Extract die type from hitDie string (e.g., "1d8" -> "d8")
    const dieType = characterClass.hitDie.replace('1', '');
    
    // Multiply by level
    return `${character.level}${dieType}`;
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
    <Details
      title="Defense & Movement"
      items={detailsItems}
      layout="vertical"
      size="md"
    />
  );
}