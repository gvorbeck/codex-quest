import { NumberInput, TextArea } from "@/components/ui/inputs";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { StatusIndicator } from "@/components/ui/display";
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
              {editable && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1">
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
              )}

              {/* Status Bar only */}
              <StatusIndicator
                current={character.hp.current}
                max={character.hp.max}
                showBar={true}
                showLabel={false}
              />
            </div>
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

          {/* HP Status Text - positioned at bottom like original */}
          <StatusIndicator
            current={character.hp.current}
            max={character.hp.max}
            showBar={false}
            showLabel={true}
            className="text-center"
          />
        </div>
      </div>
    </CharacterSheetSectionWrapper>
  );
}
