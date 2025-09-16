import { ItemGrid } from "@/components/ui/display";
import { DeletionModal } from "@/components/modals/base/ConfirmationModal";
import { GameCard } from "./GameCard";
import { useGames } from "@/hooks";
import { useAuth, useNotifications } from "@/hooks";
import { deleteGame } from "@/services";
import { logger } from "@/utils";
import { useState } from "react";

export function GamesList() {
  const { games, loading, error, refetch } = useGames();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    game: { id: string; name: string } | null;
    isDeleting: boolean;
  }>({ isOpen: false, game: null, isDeleting: false });

  const handleDeleteGame = (gameId: string, gameName: string) => {
    if (!user) return;
    setDeleteState({
      isOpen: true,
      game: { id: gameId, name: gameName },
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!user || !deleteState.game) return;

    setDeleteState((prev) => ({ ...prev, isDeleting: true }));
    try {
      await deleteGame(user.uid, deleteState.game.id);
      await refetch();
      setDeleteState({ isOpen: false, game: null, isDeleting: false });
      showSuccess(
        `Game "${deleteState.game.name}" has been deleted successfully.`,
        { duration: 4000 }
      );
    } catch (error) {
      logger.error("Failed to delete game:", error);
      showError("Failed to delete game. Please try again.", { duration: 5000 });
    } finally {
      setDeleteState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleCloseDeleteModal = () => {
    if (deleteState.isDeleting) return; // Prevent closing while deleting
    setDeleteState({ isOpen: false, game: null, isDeleting: false });
  };

  return (
    <>
      <ItemGrid
        items={games}
        loading={loading}
        error={error}
        emptyState={{
          icon: "plus",
          title: "No Games Yet",
          description:
            "Ready to start your campaign? Create your first game to get started!",
          action: {
            label: "Create Your First Game",
            href: "/new-game",
          },
        }}
        header={{
          title: "Your Games",
          icon: "dice",
          count: games.length,
        }}
        renderItem={(game) => (
          <GameCard
            key={game.id}
            game={game}
            user={user}
            onDelete={handleDeleteGame}
            isDeleting={
              deleteState.isDeleting && deleteState.game?.id === game.id
            }
          />
        )}
        onRetry={refetch}
      />

      {/* Delete Confirmation Modal */}
      <DeletionModal
        isOpen={deleteState.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        entityType="game"
        entityName={deleteState.game?.name || ""}
        isDeleting={deleteState.isDeleting}
      />
    </>
  );
}
