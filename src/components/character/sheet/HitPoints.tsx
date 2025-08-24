import { useMemo } from "react";
import { NumberInput, TextArea } from "@/components/ui/inputs";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { DESIGN_TOKENS, SIZE_STYLES } from "@/constants/designTokens";
import type { Character } from "@/types/character";

interface HitPointsProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onCurrentHPChange?: (value: number) => void;
  onHPNotesChange?: (value: string) => void;
}

export default function HitPoints({
  character,
  className = "",
  size = "md",
  editable = false,
  onCurrentHPChange,
  onHPNotesChange,
}: HitPointsProps) {
  const currentSize = SIZE_STYLES[size];


  // Calculate percentage of current HP to max HP for visual indicator
  const hpPercentage = useMemo(() => {
    if (character.hp.max === 0) return 0;
    return Math.max(
      0,
      Math.min(100, (character.hp.current / character.hp.max) * 100)
    );
  }, [character.hp]);

  // Determine HP status color based on percentage
  const getHPStatusColor = (percentage: number) => {
    if (percentage >= 75) return "text-lime-400";
    if (percentage >= 50) return "text-yellow-400";
    if (percentage >= 25) return "text-orange-400";
    return "text-red-400";
  };

  const handleCurrentHPChange = (value: number | undefined) => {
    if (value !== undefined && onCurrentHPChange) {
      onCurrentHPChange(value);
    }
  };

  const handleHPNotesChange = (value: string) => {
    if (onHPNotesChange) {
      onHPNotesChange(value);
    }
  };

  return (
    <CharacterSheetSectionWrapper 
      title="Hit Points" 
      size={size}
      className={className}
    >
      {/* HP Content */}
      <div className={currentSize.container}>
        <div className="space-y-2">
          {/* Current HP Input and Max HP Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  {editable ? (
                    <NumberInput
                      value={character.hp.current}
                      onChange={handleCurrentHPChange}
                      minValue={-99}
                      maxValue={999}
                      size="sm"
                      className="text-center font-mono"
                      aria-label="Current hit points"
                      placeholder="0"
                    />
                  ) : (
                    <div
                      className={`
                        ${DESIGN_TOKENS.colors.bg.ability}
                        ${DESIGN_TOKENS.effects.roundedSm}
                        border-2 ${DESIGN_TOKENS.colors.border.ability}
                        px-3 py-2 text-center font-mono text-lg
                        ${getHPStatusColor(hpPercentage)}
                        min-h-[36px] flex items-center justify-center
                      `}
                    >
                      {character.hp.current}
                    </div>
                  )}
                </div>
                <div className="text-zinc-400 text-lg font-mono">/</div>
                <div
                  className={`
                    ${DESIGN_TOKENS.colors.bg.ability}
                    ${DESIGN_TOKENS.effects.roundedSm}
                    border ${DESIGN_TOKENS.colors.border.ability}
                    px-2 py-1 text-center font-mono text-sm
                    text-zinc-300 min-w-[48px]
                    flex items-center justify-center
                  `}
                  title="Maximum hit points"
                >
                  {character.hp.max}
                </div>
              </div>
            </div>
          </div>

          {/* HP Status Bar */}
          <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
            <div
              className={`
                h-full transition-all duration-300 rounded-full
                ${hpPercentage >= 75 ? "bg-lime-500" : ""}
                ${
                  hpPercentage >= 50 && hpPercentage < 75 ? "bg-yellow-500" : ""
                }
                ${
                  hpPercentage >= 25 && hpPercentage < 50 ? "bg-orange-500" : ""
                }
                ${hpPercentage < 25 ? "bg-red-500" : ""}
              `}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>

          {/* HP Notes */}
          <div>
            {editable ? (
              <TextArea
                value={character.hp.desc || ""}
                onChange={handleHPNotesChange}
                placeholder="HP notes (injuries, effects, etc.)"
                maxLength={200}
                size="sm"
                rows={3}
                showClearButton={true}
                aria-label="Hit point notes"
                className="text-xs !bg-zinc-700/50 !border-zinc-600/50"
              />
            ) : (
              character.hp.desc && (
                <div
                  className={`
                    ${DESIGN_TOKENS.colors.bg.ability}
                    ${DESIGN_TOKENS.effects.roundedSm}
                    border ${DESIGN_TOKENS.colors.border.ability}
                    px-2 py-1 text-xs text-zinc-300
                  `}
                >
                  {character.hp.desc}
                </div>
              )
            )}
          </div>

          {/* HP Status Text */}
          <div className="text-center">
            <span
              className={`text-xs font-medium ${getHPStatusColor(
                hpPercentage
              )}`}
            >
              {character.hp.current > character.hp.max && "Temporary HP"}
              {character.hp.current === character.hp.max && "Healthy"}
              {character.hp.current >= character.hp.max * 0.75 &&
                character.hp.current < character.hp.max &&
                "Lightly Wounded"}
              {character.hp.current >= character.hp.max * 0.5 &&
                character.hp.current < character.hp.max * 0.75 &&
                "Moderately Wounded"}
              {character.hp.current >= character.hp.max * 0.25 &&
                character.hp.current < character.hp.max * 0.5 &&
                "Heavily Wounded"}
              {character.hp.current > 0 &&
                character.hp.current < character.hp.max * 0.25 &&
                "Critically Wounded"}
              {character.hp.current <= 0 && "Unconscious/Dead"}
            </span>
          </div>
        </div>
      </div>
    </CharacterSheetSectionWrapper>
  );
}
