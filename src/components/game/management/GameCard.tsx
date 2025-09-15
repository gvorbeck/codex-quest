import { Typography } from "@/components/ui";
import { BaseCard, StatusDot, StatCard } from "@/components/ui/display";
import type { Game } from "@/types/game";
import { useNotificationContext } from "@/hooks/useNotificationContext";
import { truncateText } from "@/utils/textHelpers";

interface GameCardProps {
  game: Game;
  user: { uid: string } | null;
  onDelete: (gameId: string, gameName: string) => void;
  isDeleting?: boolean;
}

export function GameCard({ game, user, onDelete, isDeleting }: GameCardProps) {
  const { showSuccess, showError } = useNotificationContext();
  const href = `/u/${user?.uid}/g/${game.id}`;


  const handleCopyUrl = async (url: string, gameName: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showSuccess(`Game URL copied for ${gameName}`, {
        duration: 3000,
      });
    } catch {
      showError("Failed to copy URL to clipboard", {
        duration: 5000,
      });
    }
  };

  return (
    <BaseCard
      id={game.id}
      name={game.name}
      user={user}
      href={href}
      onDelete={onDelete}
      onCopy={handleCopyUrl}
      isDeleting={isDeleting || false}
    >
      {/* Game Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <Typography
            variant="h4"
            className="text-zinc-100 group-hover:text-amber-300 transition-colors duration-300 truncate font-bold tracking-wide"
          >
            {game.name}
          </Typography>
        </div>
      </div>

      {/* Game Notes */}
      {game.notes && (
        <section aria-labelledby={`game-${game.id}-notes-label`}>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <StatusDot color="bg-amber-500" />
              <Typography
                id={`game-${game.id}-notes-label`}
                variant="helper"
                className="text-zinc-400 uppercase tracking-wider font-medium text-xs"
              >
                Notes
              </Typography>
            </div>
            <Typography
              variant="body"
              className="text-zinc-300 text-sm"
            >
              {truncateText(game.notes)}
            </Typography>
          </div>
        </section>
      )}

      {/* Game Stats */}
      {game.players && game.players.length > 0 && (
        <section aria-labelledby={`game-${game.id}-stats-label`} className="pt-2">
          <StatCard
            label="Players"
            value={game.players.length}
            size="sm"
            className="bg-zinc-800/50 border-zinc-700/50"
            fullName="Number of players in this game"
          />
        </section>
      )}
    </BaseCard>
  );
}
