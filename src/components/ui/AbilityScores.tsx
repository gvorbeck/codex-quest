import { forwardRef } from "react";
import type { Character } from "@/types/character";

interface AbilityScoresProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Design tokens consistent with the project's design system
const DESIGN_TOKENS = {
  colors: {
    bg: {
      primary: "bg-zinc-800",
      accent: "bg-gradient-to-br from-zinc-800 to-zinc-900",
      ability: "bg-gradient-to-br from-zinc-700 to-zinc-800",
      abilityHover: "bg-gradient-to-br from-zinc-600 to-zinc-700",
      header: "bg-gradient-to-r from-zinc-700/50 to-zinc-750/30",
    },
    text: {
      primary: "text-zinc-100",
      secondary: "text-zinc-400",
      muted: "text-zinc-300",
      accent: "text-amber-400",
      modifier: "text-emerald-400",
    },
    border: {
      primary: "border-zinc-600",
      secondary: "border-zinc-700/60",
      accent: "border-amber-500/20",
      ability: "border-zinc-600/80",
    },
  },
  effects: {
    shadow: "shadow-[0_4px_0_0_#3f3f46,0_0_20px_rgba(0,0,0,0.3)]",
    shadowSm: "shadow-[0_2px_0_0_#52525b,0_0_10px_rgba(0,0,0,0.2)]",
    abilityShadow: "shadow-[0_3px_0_0_#3f3f46,inset_0_1px_0_0_rgba(255,255,255,0.1)]",
    transition: "transition-all duration-200",
    rounded: "rounded-xl",
    roundedSm: "rounded-lg",
  },
} as const;

const AbilityScores = forwardRef<HTMLDivElement, AbilityScoresProps>(
  ({ character, className = "", size = "md" }, ref) => {
    const sizeStyles = {
      sm: {
        container: "p-4",
        header: "px-4 py-3",
        abilityContainer: "p-3",
        abilityName: "text-xs font-semibold tracking-wide uppercase mb-2",
        abilityScore: "text-lg font-bold",
        abilityModifier: "text-xs font-medium",
        grid: "grid-cols-3 md:grid-cols-6 gap-3",
      },
      md: {
        container: "p-6",
        header: "px-5 py-4",
        abilityContainer: "p-4",
        abilityName: "text-sm font-semibold tracking-wide uppercase mb-3",
        abilityScore: "text-2xl font-bold",
        abilityModifier: "text-sm font-medium",
        grid: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
      },
      lg: {
        container: "p-8",
        header: "px-6 py-5",
        abilityContainer: "p-5",
        abilityName: "text-base font-semibold tracking-wide uppercase mb-4",
        abilityScore: "text-3xl font-bold",
        abilityModifier: "text-base font-medium",
        grid: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6",
      },
    };

    const currentSize = sizeStyles[size];

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

    const headerClasses = [
      "flex items-center justify-between",
      `border-b-2 ${DESIGN_TOKENS.colors.border.secondary}`,
      currentSize.header,
      DESIGN_TOKENS.colors.bg.header,
      "backdrop-blur-sm",
    ].join(" ");

    const abilities = [
      { key: "strength", label: "STR", fullName: "Strength" },
      { key: "dexterity", label: "DEX", fullName: "Dexterity" },
      { key: "constitution", label: "CON", fullName: "Constitution" },
      { key: "intelligence", label: "INT", fullName: "Intelligence" },
      { key: "wisdom", label: "WIS", fullName: "Wisdom" },
      { key: "charisma", label: "CHA", fullName: "Charisma" },
    ] as const;

    const getModifierDisplay = (modifier: number): string => {
      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    };

    const getAbilityColor = (score: number): string => {
      if (score >= 16) return "text-emerald-400"; // High
      if (score >= 13) return "text-amber-400"; // Above average
      if (score >= 9) return "text-zinc-100"; // Average
      return "text-red-400"; // Below average
    };

    return (
      <div ref={ref} className={containerClasses}>
        {/* Header */}
        <div className={headerClasses}>
          <div
            className={`font-bold ${DESIGN_TOKENS.colors.text.primary} flex items-center gap-2`}
          >
            <div className="w-2 h-2 bg-amber-400 rounded-full shadow-sm"></div>
            Ability Scores
          </div>
          <div className={`${DESIGN_TOKENS.colors.text.muted} text-sm`}>
            Core Attributes
          </div>
        </div>

        {/* Ability Scores Grid */}
        <div className={currentSize.container}>
          <div className={`grid ${currentSize.grid}`}>
            {abilities.map(({ key, label, fullName }) => {
              const ability = character.abilities[key];
              const scoreColor = getAbilityColor(ability.value);
              
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
                  `}
                  title={fullName}
                >
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Ability Name */}
                    <h3 className={`
                      ${DESIGN_TOKENS.colors.text.accent} 
                      ${currentSize.abilityName}
                      group-hover/ability:text-amber-300
                      transition-colors duration-200
                    `}>
                      {label}
                    </h3>
                    
                    {/* Ability Score */}
                    <div className={`
                      ${scoreColor}
                      ${currentSize.abilityScore}
                      leading-none
                      mb-1
                      transition-colors duration-200
                    `}>
                      {ability.value}
                    </div>
                    
                    {/* Modifier */}
                    <div className={`
                      ${DESIGN_TOKENS.colors.text.modifier}
                      ${currentSize.abilityModifier}
                      font-mono
                      bg-zinc-900/50
                      px-2 py-1
                      ${DESIGN_TOKENS.effects.roundedSm}
                      border border-emerald-500/20
                      inline-block
                      min-w-[3rem]
                    `}>
                      {getModifierDisplay(ability.modifier)}
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400/0 via-amber-400/60 to-amber-400/0 transform translate-y-full group-hover/ability:translate-y-0 transition-transform duration-200"></div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-4 border-t border-zinc-700/50">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className={DESIGN_TOKENS.colors.text.muted}>
                  High: {abilities.filter(({ key }) => character.abilities[key].value >= 16).length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span className={DESIGN_TOKENS.colors.text.muted}>
                  Above Avg: {abilities.filter(({ key }) => {
                    const score = character.abilities[key].value;
                    return score >= 13 && score < 16;
                  }).length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className={DESIGN_TOKENS.colors.text.muted}>
                  Below Avg: {abilities.filter(({ key }) => character.abilities[key].value < 9).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AbilityScores.displayName = "AbilityScores";

export default AbilityScores;