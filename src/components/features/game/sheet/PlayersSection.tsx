import { memo, useState, useCallback } from "react";
import type { GamePlayer } from "@/types";
import { GAME_SHEET_STYLES, LOADING_MESSAGES } from "@/constants";
import { HorizontalRule } from "@/components/ui/composite";
import { SectionWrapper } from "@/components/ui/core/layout";
import { LoadingState } from "@/components/ui/core/feedback";
import { DeletionModal } from "@/components/modals/base/ConfirmationModal";
import { useDataResolver } from "@/hooks";
import { PlayerCard } from "./PlayerCard";

interface PlayersSectionProps {
  players: GamePlayer[];
  showDivider?: boolean;
  onDeletePlayer?: (player: GamePlayer) => void;
}

export const PlayersSection = memo(
  ({ players, showDivider = false, onDeletePlayer }: PlayersSectionProps) => {
    // Prepare data requests for all players
    const playerRequests = players?.map((player) => ({
      userId: player.user,
      characterId: player.character,
    })) || [];

    // Use TanStack Query to resolve player data with automatic caching
    const { getResolvedData, isLoading } = useDataResolver(playerRequests);

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

    // TanStack Query handles data resolution automatically

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
              <LoadingState
                message={LOADING_MESSAGES.loadingPlayerData}
                variant="inline"
                className="py-4"
              />
            )}
          </div>
        </SectionWrapper>

        {/* Delete Player Confirmation Modal */}
        <DeletionModal
          isOpen={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          entityType="player"
          entityName={playerToDelete ? getPlayerName(playerToDelete) : ""}
          isDeleting={false}
        />
      </>
    );
  }
);

PlayersSection.displayName = "PlayersSection";
