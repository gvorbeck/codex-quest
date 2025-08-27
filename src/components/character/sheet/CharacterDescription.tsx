import { TextArea } from "@/components/ui/inputs";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { useDebouncedUpdate } from "@/hooks/useDebouncedUpdate";
import type { Character } from "@/types/character";

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
  // Debounced description updates to reduce Firebase writes
  const debouncedDescription = useDebouncedUpdate(
    character.desc || "",
    {
      delay: 500,
      onUpdate: (value: string) => {
        if (onDescriptionChange) {
          onDescriptionChange(value);
        }
      },
    }
  );

  // Handle blur to flush any pending changes
  const handleBlur = () => {
    debouncedDescription.flush();
  };

  return (
    <CharacterSheetSectionWrapper
      title="Character Description"
      size={size}
      className={className}
    >
      <div className="space-y-2 p-2">
        {editable ? (
          <TextArea
            value={debouncedDescription.value}
            onChange={debouncedDescription.setValue}
            onBlur={handleBlur}
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
              {debouncedDescription.isPending ? "Saving..." : "Saves automatically after you stop typing (500ms)"}
            </span>
          </div>
        )}
      </div>
    </CharacterSheetSectionWrapper>
  );
}
