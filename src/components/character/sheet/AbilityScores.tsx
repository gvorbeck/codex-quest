import { forwardRef, useState, useRef, useEffect } from "react";
import type { Character } from "@/types/character";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { Icon } from "@/components/ui/display";
import { NumberInput } from "@/components/ui/inputs";
import { InfoTooltip } from "@/components/ui/feedback";
import { Typography } from "@/components/ui/design-system";
import { DESIGN_TOKENS, SIZE_STYLES } from "@/constants/designTokens";
import {
  calculateModifier,
  formatModifier,
  getAbilityScoreColor,
} from "@/utils/gameUtils";
import { useDiceRoll } from "@/hooks/useDiceRoll";

interface AbilityScoresProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onAbilityChange?: (abilityKey: string, value: number) => void;
}

interface AbilityScoreCardProps {
  label: string;
  fullName: string;
  value: number;
  modifier: number;
  valueColor?: string;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onChange?: (value: number) => void;
  onRoll: () => void;
}

const AbilityScoreCard = forwardRef<HTMLDivElement, AbilityScoreCardProps>(
  (
    {
      label,
      fullName,
      value,
      modifier,
      valueColor = DESIGN_TOKENS.colors.text.primary,
      size = "md",
      editable = false,
      onChange,
      onRoll,
    },
    ref
  ) => {
    const currentSize = SIZE_STYLES[size];
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus and select when entering edit mode
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing]);

    const handleClick = () => {
      onRoll();
    };

    const handleDoubleClick = () => {
      if (editable && onChange) {
        setIsEditing(true);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onRoll();
      }
    };

    const handleValueChange = (newValue: number | undefined) => {
      if (newValue !== undefined && onChange) {
        onChange(newValue);
      }
      setIsEditing(false);
    };

    const handleInputBlur = () => {
      setIsEditing(false);
    };

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter" || event.key === "Escape") {
        setIsEditing(false);
      }
    };

    return (
      <div
        ref={ref}
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
          group/stat-card
          text-center
          relative
          overflow-hidden
          cursor-pointer
        `}
        title={`${fullName} - Click to roll d20${
          modifier >= 0 ? "+" : ""
        }${modifier}${editable ? " • Double-click to edit" : ""}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        role="button"
        tabIndex={0}
        aria-label={`${fullName} (${value}, modifier ${formatModifier(
          modifier
        )}) - Click to roll ability check`}
        onKeyDown={handleKeyDown}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Label */}
          <Typography
            variant="bodySmall"
            color="amber"
            weight="medium"
            as="h3"
            className="group-hover/stat-card:text-amber-300 transition-colors duration-200"
          >
            {label}
          </Typography>

          {/* Primary Value - with editing support */}
          {isEditing && onChange ? (
            <div className="mb-1">
              <NumberInput
                ref={inputRef}
                value={value}
                onChange={handleValueChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                minValue={3}
                maxValue={25}
                size={size}
                className="text-center bg-zinc-700 border-amber-400 text-zinc-100"
                aria-label={`${fullName} value`}
              />
            </div>
          ) : (
            <div
              className={`
                ${valueColor}
                ${currentSize.abilityScore}
                leading-none
                mb-1
                transition-colors duration-200
                relative
              `}
            >
              {value}
              {editable && (
                <Icon
                  name="edit"
                  size="xs"
                  className={`
                    text-zinc-400 
                    opacity-0 group-hover/stat-card:opacity-100 
                    transition-opacity duration-200
                    absolute -top-1 right-2
                  `}
                  aria-hidden={true}
                />
              )}
            </div>
          )}

          {/* Secondary Value (modifier) */}
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
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400/0 via-amber-400/60 to-amber-400/0 transform translate-y-full group-hover/stat-card:translate-y-0 transition-transform duration-200"></div>
      </div>
    );
  }
);

AbilityScoreCard.displayName = "AbilityScoreCard";

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
    const { rollAbility } = useDiceRoll();

    const abilities = [
      { key: "strength", label: "STR", fullName: "Strength" },
      { key: "dexterity", label: "DEX", fullName: "Dexterity" },
      { key: "constitution", label: "CON", fullName: "Constitution" },
      { key: "intelligence", label: "INT", fullName: "Intelligence" },
      { key: "wisdom", label: "WIS", fullName: "Wisdom" },
      { key: "charisma", label: "CHA", fullName: "Charisma" },
    ] as const;

    const allScores = abilities.map(
      ({ key }) => character.abilities[key].value
    );

    const handleAbilityChange = (abilityKey: string) => (newValue: number) => {
      if (onAbilityChange) {
        onAbilityChange(abilityKey, newValue);
      }
    };

    const titleWithTooltip = (
      <div className="flex items-center gap-2">
        Ability Scores
        <InfoTooltip content="Single click to roll d20 + modifier • Double click to edit value" />
      </div>
    );

    return (
      <CharacterSheetSectionWrapper
        ref={ref}
        title={titleWithTooltip}
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
                <AbilityScoreCard
                  key={key}
                  label={label}
                  fullName={fullName}
                  value={ability.value}
                  modifier={modifier}
                  valueColor={scoreColor}
                  size={size}
                  editable={editable}
                  {...(editable && { onChange: handleAbilityChange(key) })}
                  onRoll={() => rollAbility(fullName, modifier)}
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
