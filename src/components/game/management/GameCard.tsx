import { Typography } from "@/components/ui";
import { BaseCard } from "@/components/ui/display";
import type { Game } from "@/types/game";

interface GameCardProps {
  game: Game;
  user: { uid: string } | null;
  onDelete: (gameId: string, gameName: string) => void;
  isDeleting?: boolean;
}

export function GameCard({ game, user, onDelete, isDeleting }: GameCardProps) {
  const href = `/u/${user?.uid}/g/${game.id}`;

  return (
    <BaseCard
      id={game.id}
      name={game.name}
      user={user}
      href={href}
      onDelete={onDelete}
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
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <Typography variant="helper" className="text-zinc-400 uppercase tracking-wider font-medium text-xs">
              Notes
            </Typography>
          </div>
          <Typography 
            variant="body" 
            className="text-zinc-300 text-sm overflow-hidden"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
            }}
          >
            {game.notes}
          </Typography>
        </div>
      )}

      {/* Game Stats */}
      {game.players && game.players.length > 0 && (
        <div className="pt-2">
          <div className="text-center p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
            <Typography variant="caption" className="text-zinc-400 uppercase tracking-wide text-xs">
              Players
            </Typography>
            <Typography variant="body" className="text-zinc-200 font-bold">
              {game.players.length}
            </Typography>
          </div>
        </div>
      )}
    </BaseCard>
  );
}