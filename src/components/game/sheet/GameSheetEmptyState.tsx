import { memo } from "react";
import { GAME_SHEET_STYLES } from "@/constants/gameSheetStyles";
import { Typography } from "@/components/ui/design-system";

interface GameSheetEmptyStateProps {
  gameName?: string;
}

export const GameSheetEmptyState = memo(
  ({ gameName }: GameSheetEmptyStateProps) => (
    <div className={GAME_SHEET_STYLES.layout.centeredContent}>
      <div className="text-6xl mb-4" role="img" aria-label="Game dice">
        🎲
      </div>
      <Typography
        variant="h2"
        as="h2"
        weight="bold"
        className={`${GAME_SHEET_STYLES.colors.text.primary} mb-2`}
      >
        Ready to Play{gameName ? ` ${gameName}` : ""}!
      </Typography>
      <p
        className={`${GAME_SHEET_STYLES.colors.text.secondary} max-w-md mx-auto`}
      >
        This game is set up and ready. Players and combatants will appear here
        once added.
      </p>
    </div>
  )
);

GameSheetEmptyState.displayName = "GameSheetEmptyState";
