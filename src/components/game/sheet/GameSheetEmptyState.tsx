import { memo } from "react";
import { GAME_SHEET_STYLES } from "@/constants/gameSheetStyles";
import { Typography } from "@/components/ui/design-system";
import { Icon } from "@/components/ui/display";

interface GameSheetEmptyStateProps {
  gameName?: string;
}

export const GameSheetEmptyState = memo(
  ({ gameName }: GameSheetEmptyStateProps) => (
    <div className={GAME_SHEET_STYLES.layout.centeredContent}>
      <div className="mb-4">
        <Icon
          name="dice"
          size="xl"
          className="text-6xl"
          aria-label="Game dice"
        />
      </div>
      <Typography
        variant="h2"
        as="h2"
        weight="bold"
        className={`${GAME_SHEET_STYLES.colors.text.primary} mb-2`}
      >
        Ready to Play{gameName ? ` ${gameName}` : ""}!
      </Typography>
      <Typography variant="body" color="secondary" className="max-w-md mx-auto">
        This game is set up and ready. Players and combatants will appear here
        once added.
      </Typography>
    </div>
  )
);

GameSheetEmptyState.displayName = "GameSheetEmptyState";
