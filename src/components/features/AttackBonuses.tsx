import { useMemo } from "react";
import { Details, InfoTooltip } from "@/components/ui";
import CharacterSheetSectionWrapper from "@/components/ui/CharacterSheetSectionWrapper";
import { formatModifier } from "@/utils/gameUtils";
import { allRaces } from "@/data/races";
import { SIZE_STYLES } from "@/constants/designTokens";
import type { Character, SpecialAbility } from "@/types/character";

interface AttackBonusesProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function AttackBonuses({ character, className = "", size = "md" }: AttackBonusesProps) {
  const currentSize = SIZE_STYLES[size];
  const attackBonuses = useMemo(() => {
    // Base Attack Bonus calculation from BFRPG table
    const getBaseAttackBonus = (level: number, characterClass: string): number => {
      const classLower = characterClass.toLowerCase();
      
      // Fighter-based classes (Fighter, Barbarian, Ranger, Paladin)
      if (classLower === "fighter" || classLower === "barbarian" || classLower === "ranger" || classLower === "paladin") {
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
      
      // Cleric-based classes (Cleric, Druid) and Thief-based classes (Thief, Assassin, Scout)
      if (classLower === "cleric" || classLower === "druid" || classLower === "thief" || classLower === "assassin" || classLower === "scout") {
        if (level >= 18) return 10;
        if (level >= 15) return 9;
        if (level >= 12) return 8;
        if (level >= 9) return 7;
        if (level >= 7) return 6;
        if (level >= 5) return 5;
        if (level >= 3) return 2;
        if (level >= 1) return 1;
        return 0;
      }
      
      // Magic-User-based classes (Magic-User, Illusionist, Necromancer, Spellcrafter)
      if (classLower === "magic-user" || classLower === "illusionist" || classLower === "necromancer" || classLower === "spellcrafter") {
        if (level >= 19) return 10;
        if (level >= 16) return 9;
        if (level >= 13) return 8;
        if (level >= 9) return 7;
        if (level >= 6) return 3;
        if (level >= 4) return 2;
        if (level >= 1) return 1;
        return 0;
      }
      
      // Default for unknown classes
      return 0;
    };

    // Extract racial attack bonuses from special abilities
    const getRacialAttackBonuses = () => {
      // Find the race object from the races data
      const raceData = allRaces.find(race => race.id === character.race);
      if (!raceData?.specialAbilities) return { melee: 0, missile: 0 };
      
      let meleeBonus = 0;
      let missileBonus = 0;
      
      raceData.specialAbilities.forEach((ability: SpecialAbility) => {
        const attackBonus = ability.effects?.attackBonus;
        if (attackBonus) {
          const conditions = attackBonus.conditions || [];
          
          // Apply ranged weapon bonus to missile attacks
          if (conditions.includes("ranged weapons")) {
            missileBonus += attackBonus.value;
          }
          // Apply other attack bonuses to both melee and missile unless specifically conditional
          else if (conditions.length === 0 || !conditions.some((c: string) => c.includes("ranged") || c.includes("melee"))) {
            meleeBonus += attackBonus.value;
            missileBonus += attackBonus.value;
          }
          // Apply melee-specific bonuses
          else if (conditions.some((c: string) => c.includes("melee"))) {
            meleeBonus += attackBonus.value;
          }
        }
      });
      
      return { melee: meleeBonus, missile: missileBonus };
    };

    // Get the primary class (first in array for multi-class characters)
    const primaryClass = character.class[0] || "";
    
    // Calculate base attack bonus
    const baseAttackBonus = getBaseAttackBonus(character.level, primaryClass);
    
    // Get racial attack bonuses
    const racialBonuses = getRacialAttackBonuses();
    
    // Calculate ability modifiers from values (D&D 3.x style: (value - 10) / 2, rounded down)
    const calculateModifier = (value: number): number => Math.floor((value - 10) / 2);
    
    const strModifier = character.abilities.strength?.value ? calculateModifier(character.abilities.strength.value) : 0;
    const dexModifier = character.abilities.dexterity?.value ? calculateModifier(character.abilities.dexterity.value) : 0;
    
    // Calculate melee attack bonus (base + strength modifier + racial bonuses)
    const meleeAttackBonus = baseAttackBonus + strModifier + racialBonuses.melee;
    
    // Calculate missile attack bonus (base + dexterity modifier + racial bonuses)
    const missileAttackBonus = baseAttackBonus + dexModifier + racialBonuses.missile;


    return {
      base: baseAttackBonus,
      melee: meleeAttackBonus,
      missile: missileAttackBonus,
      racial: racialBonuses,
    };
  }, [character.level, character.class, character.abilities.strength.modifier, character.abilities.dexterity.modifier, character.race]);

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

  const getTooltipContent = () => {
    let content = "Base: from level and class • Melee: base + STR modifier";
    if (attackBonuses.racial.melee !== 0) {
      content += ` + racial (${formatModifier(attackBonuses.racial.melee)})`;
    }
    content += " • Missile: base + DEX modifier";
    if (attackBonuses.racial.missile !== 0) {
      content += ` + racial (${formatModifier(attackBonuses.racial.missile)})`;
    }
    return content;
  };

  const titleWithTooltip = (
    <div className="flex items-center gap-2">
      Attack Bonuses
      <InfoTooltip content={getTooltipContent()} />
    </div>
  );

  return (
    <CharacterSheetSectionWrapper 
      title={titleWithTooltip} 
      size={size}
      className={className}
    >
      <div className={currentSize.container}>
        <Details
          items={items}
          layout="vertical"
          size={size}
        />
      </div>
    </CharacterSheetSectionWrapper>
  );
}