import { useMemo } from "react";
import { InfoTooltip } from "@/components/ui/core/feedback";
import { SectionWrapper } from "@/components/ui/core/layout";
import RollableButton from "@/components/domain/dice/RollableButton";
import { formatModifier } from "@/utils";
import { allRaces } from "@/data";
import { SIZE_STYLES } from "@/constants";
import { useDiceRoll } from "@/hooks/useDiceRoll";
import type { Character, SpecialAbility } from "@/types";

interface AttackBonusesProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function AttackBonuses({
  character,
  className = "",
  size = "md",
}: AttackBonusesProps) {
  const currentSize = SIZE_STYLES[size];
  const { rollAttack } = useDiceRoll();

  const attackBonuses = useMemo(() => {
    // Base Attack Bonus calculation from BFRPG table
    const getBaseAttackBonus = (
      level: number,
      characterClass: string
    ): number => {
      const classLower = characterClass.toLowerCase();

      // Fighter-based classes (Fighter, Barbarian, Ranger, Paladin)
      if (
        classLower === "fighter" ||
        classLower === "barbarian" ||
        classLower === "ranger" ||
        classLower === "paladin"
      ) {
        if (level >= 18) return 10; // 18-20
        if (level >= 16) return 9; // 16-17
        if (level >= 13) return 8; // 13-15
        if (level >= 11) return 7; // 11-12
        if (level >= 8) return 6; // 8-10
        if (level >= 7) return 5; // 7
        if (level >= 5) return 4; // 5-6
        if (level >= 4) return 3; // 4
        if (level >= 2) return 2; // 2-3
        if (level >= 1) return 1; // 1
        return 0; // NM (Normal Men)
      }

      // Cleric-based classes (Cleric, Druid) and Thief-based classes (Thief, Assassin, Scout)
      if (
        classLower === "cleric" ||
        classLower === "druid" ||
        classLower === "thief" ||
        classLower === "assassin" ||
        classLower === "scout"
      ) {
        if (level >= 18) return 8; // 18-20
        if (level >= 15) return 7; // 15-17
        if (level >= 12) return 6; // 12-14
        if (level >= 9) return 5; // 9-11
        if (level >= 7) return 4; // 7-8
        if (level >= 5) return 3; // 5-6
        if (level >= 3) return 2; // 3-4
        if (level >= 1) return 1; // 1-2
        return 0; // NM (Normal Men)
      }

      // Magic-User-based classes (Magic-User, Illusionist, Necromancer, Spellcrafter)
      if (
        classLower === "magic-user" ||
        classLower === "illusionist" ||
        classLower === "necromancer" ||
        classLower === "spellcrafter"
      ) {
        if (level >= 19) return 7; // 19-20
        if (level >= 16) return 6; // 16-18
        if (level >= 13) return 5; // 13-15
        if (level >= 9) return 4; // 9-12
        if (level >= 6) return 3; // 6-8
        if (level >= 4) return 2; // 4-5
        if (level >= 1) return 1; // 1-3
        return 0; // NM (Normal Men)
      }

      // Default for unknown classes
      return 0;
    };

    // Extract racial attack bonuses from special abilities
    const getRacialAttackBonuses = () => {
      // Find the race object from the races data
      const raceData = allRaces.find((race) => race.id === character.race);
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
          else if (
            conditions.length === 0 ||
            !conditions.some(
              (c: string) => c.includes("ranged") || c.includes("melee")
            )
          ) {
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

    const strModifier = character.abilities.strength?.modifier ?? 0;
    const dexModifier = character.abilities.dexterity?.modifier ?? 0;

    // Calculate melee attack bonus (base + strength modifier + racial bonuses)
    const meleeAttackBonus =
      baseAttackBonus + strModifier + racialBonuses.melee;

    // Calculate missile attack bonus (base + dexterity modifier + racial bonuses)
    const missileAttackBonus =
      baseAttackBonus + dexModifier + racialBonuses.missile;

    return {
      base: baseAttackBonus,
      melee: meleeAttackBonus,
      missile: missileAttackBonus,
      racial: racialBonuses,
    };
  }, [
    character.level,
    character.class,
    character.abilities.strength?.modifier,
    character.abilities.dexterity?.modifier,
    character.race,
  ]);

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
    <SectionWrapper title={titleWithTooltip} size={size} className={className}>
      <div className={currentSize.container}>
        <div className="space-y-3">
          {[
            { label: "Base", value: attackBonuses.base, type: "Base" },
            { label: "Melee", value: attackBonuses.melee, type: "Melee" },
            { label: "Missile", value: attackBonuses.missile, type: "Missile" },
          ].map((item, index) => (
            <RollableButton
              key={index}
              label={item.label}
              value={formatModifier(item.value)}
              onClick={() => rollAttack(item.type, item.value)}
              tooltip={`Click to roll ${item.label.toLowerCase()} attack`}
              size={size}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
