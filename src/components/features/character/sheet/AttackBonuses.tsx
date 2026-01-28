import { useMemo } from "react";
import { InfoTooltip } from "@/components/ui/core/feedback";
import { SectionWrapper } from "@/components/ui/core/layout";
import RollableButton from "@/components/domain/dice/RollableButton";
import { formatModifier, getRaceById } from "@/utils";
import { getBaseAttackBonus } from "@/utils/combatCalculations";
import { SIZE_STYLES } from "@/constants";
import { useDiceRoll } from "@/hooks/dice/useDiceRoll";
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

    // Extract racial attack bonuses from special abilities
    const getRacialAttackBonuses = () => {
      // Find the race object from the races data
      const raceData = getRaceById(character.race);
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

    // Get the character's class
    const characterClass = character.class || "";

    // Calculate base attack bonus
    const baseAttackBonus = getBaseAttackBonus(character.level, characterClass);

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
