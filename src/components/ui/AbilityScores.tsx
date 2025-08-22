import { forwardRef, useState, useRef, useEffect } from "react";
import type { Character } from "@/types/character";
import NumberInput from "./NumberInput";
import SectionHeader from "./SectionHeader";
import EditIcon from "./EditIcon";
import { DESIGN_TOKENS, SIZE_STYLES } from "@/constants/designTokens";
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
    const [editingAbility, setEditingAbility] = useState<string | null>(null);
    const editingInputRef = useRef<HTMLInputElement>(null);
    const currentSize = SIZE_STYLES[size];

    // Auto-focus the input when entering edit mode
    useEffect(() => {
      if (editingAbility && editingInputRef.current) {
        editingInputRef.current.focus();
        // Select all text for easy replacement
        editingInputRef.current.select();
      }
    }, [editingAbility]);

    const containerClasses = [
      DESIGN_TOKENS.colors.bg.accent,
      DESIGN_TOKENS.effects.rounded,
      "overflow-hidden relative",
      "border-2",
      DESIGN_TOKENS.colors.border.primary,
      DESIGN_TOKENS.effects.shadow,
      DESIGN_TOKENS.effects.transition,
      "hover:shadow-[0_6px_0_0_#3f3f46,0_0_25px_rgba(0,0,0,0.4)]",
      "group",
      className,
    ]
      .filter(Boolean)
      .join(" ");


    const abilities = [
      { key: "strength", label: "STR", fullName: "Strength" },
      { key: "dexterity", label: "DEX", fullName: "Dexterity" },
      { key: "constitution", label: "CON", fullName: "Constitution" },
      { key: "intelligence", label: "INT", fullName: "Intelligence" },
      { key: "wisdom", label: "WIS", fullName: "Wisdom" },
      { key: "charisma", label: "CHA", fullName: "Charisma" },
    ] as const;

    const allScores = abilities.map(({ key }) => character.abilities[key].value);

    const handleAbilityClick = (abilityKey: string) => {
      if (editable) {
        setEditingAbility(abilityKey);
      }
    };

    const handleAbilityValueChange = (
      abilityKey: string,
      newValue: number | undefined
    ) => {
      if (newValue !== undefined && onAbilityChange) {
        onAbilityChange(abilityKey, newValue);
      }
    };

    const handleAbilityBlur = () => {
      setEditingAbility(null);
    };

    const handleAbilityKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter" || event.key === "Escape") {
        setEditingAbility(null);
      }
    };


    return (
      <div ref={ref} className={containerClasses}>
        {/* Header */}
        <SectionHeader title="Ability Scores" size={size} />

        {/* Ability Scores Grid */}
        <div className={currentSize.container}>
          <div className={`grid ${currentSize.grid}`}>
            {abilities.map(({ key, label, fullName }) => {
              const ability = character.abilities[key];
              const scoreColor = getAbilityScoreColor(ability.value, allScores);
              const isEditing = editingAbility === key;
              const modifier = calculateModifier(ability.value);

              return (
                <div
                  key={key}
                  className={`
                    ${DESIGN_TOKENS.colors.bg.ability}
                    ${DESIGN_TOKENS.effects.roundedSm}
                    border-2 ${DESIGN_TOKENS.colors.border.ability}
                    ${DESIGN_TOKENS.effects.abilityShadow}
                    ${currentSize.abilityContainer}
                    ${DESIGN_TOKENS.effects.transition}
                    hover:${DESIGN_TOKENS.colors.bg.abilityHover}
                    hover:border-amber-400/40
                    hover:scale-105
                    group/ability
                    text-center
                    relative
                    overflow-hidden
                    ${editable ? "cursor-pointer" : ""}
                  `}
                  title={fullName}
                  onClick={() => handleAbilityClick(key)}
                  role={editable ? "button" : undefined}
                  tabIndex={editable ? 0 : undefined}
                  aria-label={editable ? `Edit ${fullName} score (current: ${ability.value})` : undefined}
                  onKeyDown={(e) => {
                    if (editable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleAbilityClick(key);
                    }
                  }}
                >
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Ability Name */}
                    <h3
                      className={`
                      ${DESIGN_TOKENS.colors.text.accent} 
                      ${currentSize.abilityName}
                      group-hover/ability:text-amber-300
                      transition-colors duration-200
                    `}
                    >
                      {label}
                    </h3>

                    {/* Ability Score */}
                    {isEditing ? (
                      <div className="mb-1">
                        <NumberInput
                          ref={
                            editingAbility === key ? editingInputRef : undefined
                          }
                          value={ability.value}
                          onChange={(value) =>
                            handleAbilityValueChange(key, value)
                          }
                          onBlur={handleAbilityBlur}
                          onKeyDown={handleAbilityKeyDown}
                          minValue={3}
                          maxValue={25}
                          size="sm"
                          className="text-center bg-zinc-700 border-amber-400 text-zinc-100"
                        />
                      </div>
                    ) : (
                      <div
                        className={`
                        ${scoreColor}
                        ${currentSize.abilityScore}
                        leading-none
                        mb-1
                        transition-colors duration-200
                        relative
                      `}
                      >
                        {ability.value}
                        {editable && (
                          <EditIcon
                            className={`
                            w-3 h-3 text-zinc-400 
                            opacity-0 group-hover/ability:opacity-100 
                            transition-opacity duration-200
                            absolute -top-1 right-2
                          `}
                          />
                        )}
                      </div>
                    )}

                    {/* Modifier */}
                    <div
                      className={`
                      ${DESIGN_TOKENS.colors.text.modifier}
                      ${currentSize.abilityModifier}
                      font-mono
                      bg-zinc-900/50
                      px-2 py-1
                      ${DESIGN_TOKENS.effects.roundedSm}
                      border border-lime-500/20
                      inline-block
                      min-w-[3rem]
                    `}
                    >
                      {formatModifier(modifier)}
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400/0 via-amber-400/60 to-amber-400/0 transform translate-y-full group-hover/ability:translate-y-0 transition-transform duration-200"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

AbilityScores.displayName = "AbilityScores";

export default AbilityScores;
