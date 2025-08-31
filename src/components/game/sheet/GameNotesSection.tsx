import { memo } from "react";
import { GAME_SHEET_STYLES } from "@/constants/gameSheetStyles";
import { HorizontalRule } from "@/components/ui/display";
import { Typography } from "@/components/ui/design-system";
import { TextArea } from "@/components/ui/inputs";
import { useDebouncedUpdate } from "@/hooks/useDebouncedUpdate";

interface GameNotesSectionProps {
  notes: string;
  showDivider?: boolean;
  editable?: boolean;
  onNotesChange?: (notes: string) => void;
}

export const GameNotesSection = memo(
  ({ notes, showDivider = false, editable = false, onNotesChange }: GameNotesSectionProps) => {
    // Use shared debounced update logic
    const debouncedNotes = useDebouncedUpdate(notes || "", {
      delay: 500,
      onUpdate: (value: string) => {
        if (onNotesChange) {
          onNotesChange(value);
        }
      },
    });

    // Show section if there are notes OR if it's editable (so user can add notes)
    if (!notes?.trim() && !editable) {
      return null;
    }

    return (
      <>
        {showDivider && <HorizontalRule />}
        <section aria-labelledby="notes-heading">
          <Typography
            variant="h2"
            as="h2"
            id="notes-heading"
            weight="bold"
            className={`${GAME_SHEET_STYLES.colors.text.primary} ${GAME_SHEET_STYLES.spacing.element}`}
          >
            Game Notes
          </Typography>

          <div className={`${GAME_SHEET_STYLES.colors.card} p-6`}>
            {editable ? (
              <div className="space-y-2">
                <TextArea
                  value={debouncedNotes.value}
                  onChange={debouncedNotes.onChange}
                  onBlur={debouncedNotes.onBlur}
                  placeholder="Add your game notes, session summaries, important plot points, and anything else you'd like to remember..."
                  maxLength={5000}
                  rows={12}
                  showClearButton={true}
                  aria-label="Game notes"
                  className="!bg-zinc-800/50 !border-zinc-600/50 leading-relaxed"
                  resize="vertical"
                />
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>{debouncedNotes.value.length} / 5000 characters</span>
                  <span className="text-zinc-600">
                    {debouncedNotes.isSaving ? "Saving..." : "Saves automatically after you stop typing (500ms)"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="prose prose-zinc prose-invert max-w-none">
                <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {notes}
                </p>
              </div>
            )}
          </div>
        </section>
      </>
    );
  }
);

GameNotesSection.displayName = "GameNotesSection";
