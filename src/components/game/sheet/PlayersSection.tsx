import { memo } from "react";
import type { GamePlayer } from "@/types/game";
import { GAME_SHEET_STYLES } from "@/constants/gameSheetStyles";
import { HorizontalRule } from "@/components/ui/display";

interface PlayerCardProps {
  player: GamePlayer;
  index: number;
}

const PlayerCard = memo(({ player, index }: PlayerCardProps) => (
  <div className={`${GAME_SHEET_STYLES.colors.card} p-4`}>
    <dl className={GAME_SHEET_STYLES.spacing.innerSpacing}>
      <div className="flex justify-between items-center mb-2">
        <dt className={`text-sm ${GAME_SHEET_STYLES.colors.text.secondary}`}>
          Player {index + 1}
        </dt>
      </div>
      
      <div className="flex gap-2">
        <dt className={`text-sm ${GAME_SHEET_STYLES.colors.text.secondary}`}>User:</dt>
        <dd className={`${GAME_SHEET_STYLES.colors.text.primary} font-medium break-words`}>
          {player.user}
        </dd>
      </div>
      
      <div className="flex gap-2">
        <dt className={`text-sm ${GAME_SHEET_STYLES.colors.text.secondary}`}>Character:</dt>
        <dd className={`${GAME_SHEET_STYLES.colors.text.primary} font-medium break-words`}>
          {player.character}
        </dd>
      </div>
    </dl>
  </div>
));

PlayerCard.displayName = "PlayerCard";

interface PlayersSectionProps {
  players: GamePlayer[];
  showDivider?: boolean;
}

export const PlayersSection = memo(({ players, showDivider = false }: PlayersSectionProps) => {
  if (!players || players.length === 0) {
    return null;
  }

  return (
    <>
      {showDivider && <HorizontalRule />}
      <section aria-labelledby="players-heading">
        <h2 
          id="players-heading" 
          className={`text-2xl font-bold ${GAME_SHEET_STYLES.colors.text.primary} ${GAME_SHEET_STYLES.spacing.element}`}
        >
          Players ({players.length})
        </h2>
        
        <div className={`${GAME_SHEET_STYLES.layout.cardGrid} ${GAME_SHEET_STYLES.spacing.cardGap}`}>
          {players.map((player, index) => (
            <PlayerCard
              key={`${player.user}-${player.character}-${index}`}
              player={player}
              index={index}
            />
          ))}
        </div>
      </section>
    </>
  );
});

PlayersSection.displayName = "PlayersSection";