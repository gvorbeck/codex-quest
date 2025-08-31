import { memo, useEffect, useState, useCallback } from "react";
import type { GamePlayer } from "@/types/game";
import { GAME_SHEET_STYLES } from "@/constants/gameSheetStyles";
import { HorizontalRule } from "@/components/ui/display";
import { SectionWrapper } from "@/components/ui/layout";
import { DeletePlayerModal } from "@/components/ui/feedback";
import { useDataResolver } from "@/hooks/useDataResolver";
import { PlayerCard } from "./PlayerCard";

interface PlayersSectionProps {
  players: GamePlayer[];
  showDivider?: boolean;
  onDeletePlayer?: (player: GamePlayer) => void;
}

export const PlayersSection = memo(
  ({ players, showDivider = false, onDeletePlayer }: PlayersSectionProps) => {
    // Enable real-time updates for active game sessions to see character changes instantly
    const { resolveMultiple, getResolvedData, isLoading } = useDataResolver({
      enableRealTime: true,
    });

    // Player deletion confirmation state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState<GamePlayer | null>(
      null
    );

    // Handle deletion confirmation
    const handleDeletePlayer = useCallback((player: GamePlayer) => {
      setPlayerToDelete(player);
      setDeleteModalOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
      if (playerToDelete && onDeletePlayer) {
        onDeletePlayer(playerToDelete);
        setDeleteModalOpen(false);
        setPlayerToDelete(null);
      }
    }, [playerToDelete, onDeletePlayer]);

    const handleCloseDeleteModal = useCallback(() => {
      setDeleteModalOpen(false);
      setPlayerToDelete(null);
    }, []);

    // Get player name for the modal
    const getPlayerName = (player: GamePlayer) => {
      const resolved = getResolvedData(player.user, player.character);
      return resolved?.characterName || player.character;
    };

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
                  {...(onDeletePlayer && { onDelete: handleDeletePlayer })}
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

        {/* Delete Player Confirmation Modal */}
        <DeletePlayerModal
          isOpen={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          playerName={playerToDelete ? getPlayerName(playerToDelete) : ""}
          isDeleting={false}
        />
      </>
    );
  }
);

PlayersSection.displayName = "PlayersSection";
