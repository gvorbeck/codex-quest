import { memo } from "react";
import { GAME_SHEET_STYLES } from "@/constants/gameSheetStyles";
import { HorizontalRule } from "@/components/ui/display";
import { Typography } from "@/components/ui/design-system";

interface GameNotesSectionProps {
  notes: string;
  showDivider?: boolean;
}

export const GameNotesSection = memo(
  ({ notes, showDivider = false }: GameNotesSectionProps) => {
    if (!notes?.trim()) {
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
            <div className="prose prose-zinc prose-invert max-w-none">
              <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {notes}
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }
);

GameNotesSection.displayName = "GameNotesSection";
