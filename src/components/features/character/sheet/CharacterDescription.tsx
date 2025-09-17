import { TextArea } from "@/components/ui/core/primitives";
import { SectionWrapper } from "@/components/ui/core/layout";
import { useDebouncedUpdate } from "@/hooks";
import type { Character } from "@/types";

interface CharacterDescriptionProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onDescriptionChange?: (value: string) => void;
}

export default function CharacterDescription({
  character,
  className = "",
  size = "md",
  editable = false,
  onDescriptionChange,
}: CharacterDescriptionProps) {
  // Use shared debounced update logic
  const debouncedDescription = useDebouncedUpdate(character.desc || "", {
    delay: 500,
    onUpdate: (value: string) => {
      if (onDescriptionChange) {
        onDescriptionChange(value);
      }
    },
  });

  return (
    <SectionWrapper
      title="Character Description"
      size={size}
      className={className}
    >
      <div className="space-y-2 p-2">
        {editable ? (
          <TextArea
            value={debouncedDescription.value}
            onChange={debouncedDescription.onChange}
            onBlur={debouncedDescription.onBlur}
            placeholder="Write your character's backstory, personality, appearance, notes, and anything else you'd like to remember..."
            maxLength={5000}
            size={size === "lg" ? "md" : "sm"}
            rows={size === "lg" ? 12 : size === "md" ? 8 : 6}
            showClearButton={true}
            aria-label="Character description and notes"
            className="!bg-zinc-800/50 !border-zinc-600/50 leading-relaxed"
            resize="vertical"
          />
        ) : (
          character.desc && (
            <div className="bg-zinc-800/50 border border-zinc-600/50 rounded px-3 py-2 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {character.desc}
            </div>
          )
        )}

        {editable && (
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>{debouncedDescription.value.length} / 5000 characters</span>
            <span className="text-zinc-600">
              {debouncedDescription.isSaving
                ? "Saving..."
                : "Saves automatically after you stop typing (500ms)"}
            </span>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
