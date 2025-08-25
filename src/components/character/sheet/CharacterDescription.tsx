import { useCallback, useRef, useEffect } from "react";
import { TextArea } from "@/components/ui/inputs";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
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
  // Use ref to store the debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastValueRef = useRef<string>(character.desc || "");

  // Debounced save function - saves to Firebase after user stops typing for 2 seconds
  const debouncedSave = useCallback(
    (value: string) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        // Only save if the value has actually changed
        if (value !== lastValueRef.current && onDescriptionChange) {
          onDescriptionChange(value);
          lastValueRef.current = value;
        }
      }, 2000); // 2 second delay
    },
    [onDescriptionChange]
  );

  // Handle immediate change (for UI responsiveness) and trigger debounced save
  const handleDescriptionChange = (value: string) => {
    debouncedSave(value);
  };

  // Save immediately when component unmounts or character changes
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Save immediately when user navigates away from the textarea (onBlur)
  const handleBlur = () => {
    // Clear the debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Get the current value from the textarea and save immediately
    const currentValue = character.desc || "";
    if (currentValue !== lastValueRef.current && onDescriptionChange) {
      onDescriptionChange(currentValue);
      lastValueRef.current = currentValue;
    }
  };

  // Update the last value ref when character prop changes
  useEffect(() => {
    lastValueRef.current = character.desc || "";
  }, [character.desc]);

  return (
    <CharacterSheetSectionWrapper
      title="Character Description"
      size={size}
      className={className}
    >
      <div className="space-y-2 p-2">
        {editable ? (
          <TextArea
            value={character.desc || ""}
            onChange={handleDescriptionChange}
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
            <span>{character.desc?.length || 0} / 5000 characters</span>
            <span className="text-zinc-600">
              Saves automatically after you stop typing (2s delay) or when you
              click away
            </span>
          </div>
        )}
      </div>
    </CharacterSheetSectionWrapper>
  );
}
