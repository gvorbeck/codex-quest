import { useMemo } from "react";
import { Details, InfoTooltip } from "@/components/ui";
import { formatModifier } from "@/utils/gameUtils";
import type { Character } from "@/types/character";

interface AttackBonusesProps {
  character: Character;
  className?: string;
}

export default function AttackBonuses({ character, className = "" }: AttackBonusesProps) {
  const attackBonuses = useMemo(() => {
    // Base Attack Bonus calculation from table
    const getBaseAttackBonus = (level: number, characterClass: string): number => {
      // Fighter levels provide direct attack bonus
      if (characterClass === "fighter") {
        if (level >= 18) return 10;
        if (level >= 16) return 9;
        if (level >= 13) return 8;
        if (level >= 11) return 7;
        if (level >= 8) return 6;
        if (level >= 7) return 5;
        if (level >= 5) return 4;
        if (level >= 4) return 3;
        if (level >= 2) return 2;
        if (level >= 1) return 1;
        return 0;
      }
      
      // Cleric or Thief levels
      if (characterClass === "cleric" || characterClass === "thief") {
        if (level >= 18) return 10;
        if (level >= 15) return 9;
        if (level >= 12) return 8;
        if (level >= 9) return 7;
        if (level >= 7) return 6;
        if (level >= 5) return 5;
        if (level >= 3) return 4;
        if (level >= 1) return 3;
        return 2;
      }
      
      // Magic-User levels
      if (characterClass === "magic-user") {
        if (level >= 19) return 10;
        if (level >= 16) return 9;
        if (level >= 13) return 8;
        if (level >= 9) return 7;
        if (level >= 6) return 6;
        if (level >= 4) return 5;
        if (level >= 1) return 4;
        return 3;
      }
      
      // Default for unknown classes
      return 0;
    };

    // Get the primary class (first in array for multi-class characters)
    const primaryClass = character.class[0] || "";
    
    // Calculate base attack bonus
    const baseAttackBonus = getBaseAttackBonus(character.level, primaryClass);
    
    // Calculate melee attack bonus (base + strength modifier)
    const meleeAttackBonus = baseAttackBonus + character.abilities.strength.modifier;
    
    // Calculate missile attack bonus (base + dexterity modifier)
    const missileAttackBonus = baseAttackBonus + character.abilities.dexterity.modifier;

    return {
      base: baseAttackBonus,
      melee: meleeAttackBonus,
      missile: missileAttackBonus,
    };
  }, [character.level, character.class, character.abilities.strength.modifier, character.abilities.dexterity.modifier]);

  const items = [
    {
      label: "Base",
      children: formatModifier(attackBonuses.base),
    },
    {
      label: "Melee",
      children: formatModifier(attackBonuses.melee),
    },
    {
      label: "Missile",
      children: formatModifier(attackBonuses.missile),
    },
  ];

  const titleWithTooltip = (
    <div className="flex items-center gap-2">
      Attack Bonuses
      <InfoTooltip content="Base: from level and class • Melee: base + STR modifier • Missile: base + DEX modifier" />
    </div>
  );

  return (
    <Details
      title={titleWithTooltip}
      items={items}
      layout="horizontal"
      size="md"
      className={className}
    />
  );
}