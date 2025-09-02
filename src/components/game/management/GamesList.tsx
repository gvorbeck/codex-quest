import { ItemGrid } from "@/components/ui/display";
import { DeleteGameModal } from "@/components/modals";
import { GameCard } from "./GameCard";
import { useGames } from "@/hooks/useGames";
import { useAuth, useNotifications } from "@/hooks";
import { deleteGame } from "@/services/games";
import { logger } from "@/utils/logger";
import { useState } from "react";

export function GamesList() {
  const { games, loading, error, refetch } = useGames();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const [deletingGame, setDeletingGame] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDeleteGame = (gameId: string, gameName: string) => {
    if (!user) return;
    setGameToDelete({ id: gameId, name: gameName });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!user || !gameToDelete) return;

    setDeletingGame(gameToDelete.id);
    try {
      await deleteGame(user.uid, gameToDelete.id);
      await refetch();
      setDeleteModalOpen(false);
      setGameToDelete(null);
      showSuccess(
        `Game "${gameToDelete.name}" has been deleted successfully.`,
        { duration: 4000 }
      );
    } catch (error) {
      logger.error("Failed to delete game:", error);
      showError("Failed to delete game. Please try again.", { duration: 5000 });
    } finally {
      setDeletingGame(null);
    }
  };

  const handleCloseDeleteModal = () => {
    if (deletingGame) return; // Prevent closing while deleting
    setDeleteModalOpen(false);
    setGameToDelete(null);
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
            isDeleting={deletingGame === game.id}
          />
        )}
        onRetry={refetch}
      />

      {/* Delete Confirmation Modal */}
      <DeleteGameModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        gameName={gameToDelete?.name || ""}
        isDeleting={!!deletingGame}
      />
    </>
  );
}
