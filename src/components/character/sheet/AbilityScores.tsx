import { forwardRef } from "react";
import type { Character } from "@/types/character";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { StatCard } from "@/components/ui/display";
import { SIZE_STYLES } from "@/constants/designTokens";
import { calculateModifier, formatModifier, getAbilityScoreColor } from "@/utils/gameUtils";

interface AbilityScoresProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onAbilityChange?: (abilityKey: string, value: number) => void;
}


const AbilityScores = forwardRef<HTMLDivElement, AbilityScoresProps>(
  (
    {
      character,
      className = "",
      size = "md",
      editable = false,
      onAbilityChange,
    },
    ref
  ) => {
    const currentSize = SIZE_STYLES[size];

    const abilities = [
      { key: "strength", label: "STR", fullName: "Strength" },
      { key: "dexterity", label: "DEX", fullName: "Dexterity" },
      { key: "constitution", label: "CON", fullName: "Constitution" },
      { key: "intelligence", label: "INT", fullName: "Intelligence" },
      { key: "wisdom", label: "WIS", fullName: "Wisdom" },
      { key: "charisma", label: "CHA", fullName: "Charisma" },
    ] as const;

    const allScores = abilities.map(({ key }) => character.abilities[key].value);

    const handleAbilityChange = (abilityKey: string) => (newValue: number) => {
      if (onAbilityChange) {
        onAbilityChange(abilityKey, newValue);
      }
    };



    return (
      <CharacterSheetSectionWrapper 
        ref={ref} 
        title="Ability Scores" 
        size={size}
        className={className}
      >
        {/* Ability Scores Grid */}
        <div className={currentSize.container}>
          <div className={`grid ${currentSize.grid}`}>
            {abilities.map(({ key, label, fullName }) => {
              const ability = character.abilities[key];
              const scoreColor = getAbilityScoreColor(ability.value, allScores);
              const modifier = calculateModifier(ability.value);

              return (
                <StatCard
                  key={key}
                  label={label}
                  fullName={fullName}
                  value={ability.value}
                  secondaryValue={formatModifier(modifier)}
                  valueColor={scoreColor}
                  size={size}
                  editable={editable}
                  {...(editable && { onChange: handleAbilityChange(key) })}
                  minValue={3}
                  maxValue={25}
                />
              );
            })}
          </div>
        </div>
      </CharacterSheetSectionWrapper>
    );
  }
);

AbilityScores.displayName = "AbilityScores";

export default AbilityScores;
