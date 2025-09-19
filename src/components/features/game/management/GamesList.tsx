import { ItemGrid } from "@/components/ui/composite";
import { DeletionModal } from "@/components/modals/base/ConfirmationModal";
import { GameCard } from "./GameCard";
import { useEnhancedGames } from "@/hooks/queries/useEnhancedQueries";
import { useGameMutations } from "@/hooks/mutations/useEnhancedMutations";
import { useAuth } from "@/hooks";
import { useState } from "react";

export function GamesList() {
  const { data: games = [], isLoading: loading, error, refetch } = useEnhancedGames();
  const { user } = useAuth();
  const { deleteGame, isDeleting } = useGameMutations();
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    game: { id: string; name: string } | null;
  }>({ isOpen: false, game: null });

  const handleDeleteGame = (gameId: string, gameName: string) => {
    if (!user) return;
    setDeleteState({
      isOpen: true,
      game: { id: gameId, name: gameName },
    });
  };

  const handleConfirmDelete = () => {
    if (!user || !deleteState.game) return;

    deleteGame({
      userId: user.uid,
      gameId: deleteState.game.id,
    });

    setDeleteState({ isOpen: false, game: null });
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return; // Prevent closing while deleting
    setDeleteState({ isOpen: false, game: null });
  };

  return (
    <>
      <ItemGrid
        items={games}
        loading={loading}
        error={error?.message || null}
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
              isDeleting && deleteState.game?.id === game.id
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
        isDeleting={isDeleting}
      />
    </>
  );
}
