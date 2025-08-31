import { memo, useEffect } from "react";
import type { GamePlayer } from "@/types/game";
import { GAME_SHEET_STYLES } from "@/constants/gameSheetStyles";
import { HorizontalRule } from "@/components/ui/display";
import { SectionWrapper } from "@/components/ui/layout";
import { Typography } from "@/components/ui/design-system";
import { useDataResolver } from "@/hooks/useDataResolver";

interface PlayerCardProps {
  player: GamePlayer;
  getResolvedData: (
    userId: string,
    characterId: string
  ) =>
    | {
        characterName?: string | undefined;
        avatar?: string | undefined;
      }
    | undefined;
}

const PlayerCard = memo(({ player, getResolvedData }: PlayerCardProps) => {
  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get resolved data from the resolver hook
  const resolved = getResolvedData(player.user, player.character);

  // Use resolved names if available, fallback to IDs
  const characterName = resolved?.characterName || player.character;
  const avatar = resolved?.avatar;

  return (
    <div className={`${GAME_SHEET_STYLES.colors.card} p-4`}>
      <div className="flex items-start gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="w-12 h-12 rounded-full object-cover border-2 border-zinc-600 flex-shrink-0"
            loading="lazy"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full bg-zinc-700 border-2 border-zinc-600 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <span className="text-zinc-300 font-bold text-sm">
              {getInitials(characterName)}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <Typography
            variant="bodySmall"
            weight="medium"
            as="h3"
            className={`${GAME_SHEET_STYLES.colors.text.primary} truncate mb-1`}
          >
            {characterName}
          </Typography>
        </div>
      </div>
    </div>
  );
});

PlayerCard.displayName = "PlayerCard";

interface PlayersSectionProps {
  players: GamePlayer[];
  showDivider?: boolean;
}

export const PlayersSection = memo(
  ({ players, showDivider = false }: PlayersSectionProps) => {
    // Enable real-time updates for active game sessions to see character changes instantly
    const { resolveMultiple, getResolvedData, isLoading } = useDataResolver({
      enableRealTime: true,
    });

    // Resolve player data when players change
    useEffect(() => {
      if (players && players.length > 0) {
        const playerData = players.map((player) => ({
          userId: player.user,
          characterId: player.character,
        }));
        resolveMultiple(playerData);
      }
    }, [players, resolveMultiple]);

    if (!players || players.length === 0) {
      return null;
    }

    return (
      <>
        {showDivider && <HorizontalRule />}
        <SectionWrapper title={`Players (${players.length})`}>
          <div className="p-4">
            <div
              className={`${GAME_SHEET_STYLES.layout.cardGrid} ${GAME_SHEET_STYLES.spacing.cardGap}`}
            >
              {players.map((player, index) => (
                <PlayerCard
                  key={`${player.user}-${player.character}-${index}`}
                  player={player}
                  getResolvedData={getResolvedData}
                />
              ))}
            </div>

            {isLoading && (
              <div className="text-center py-4">
                <div
                  className={`text-sm ${GAME_SHEET_STYLES.colors.text.secondary}`}
                >
                  Loading player data...
                </div>
              </div>
            )}
          </div>
        </SectionWrapper>
      </>
    );
  }
);

PlayersSection.displayName = "PlayersSection";
