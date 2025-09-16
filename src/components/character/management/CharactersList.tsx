import { ItemGrid } from "@/components/ui/display";
import { DeletionModal } from "@/components/modals/base/ConfirmationModal";
import { CharacterCard } from "./CharacterCard";
import { useCharacters, useAuth, useNotificationContext } from "@/hooks";
import { deleteCharacter } from "@/services/characters";
import { logger } from "@/utils";
import { useState } from "react";

export function CharactersList() {
  const { characters, loading, error, refetch } = useCharacters();
  const { user } = useAuth();
  const { showError } = useNotificationContext();
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    character: { id: string; name: string } | null;
    isDeleting: boolean;
  }>({ isOpen: false, character: null, isDeleting: false });

  const handleDeleteCharacter = (
    characterId: string,
    characterName: string
  ) => {
    if (!user) return;
    setDeleteState({
      isOpen: true,
      character: { id: characterId, name: characterName },
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!user || !deleteState.character) return;

    setDeleteState((prev) => ({ ...prev, isDeleting: true }));
    try {
      await deleteCharacter(user.uid, deleteState.character.id);
      await refetch();
      setDeleteState({ isOpen: false, character: null, isDeleting: false });
    } catch (error) {
      logger.error("Failed to delete character:", {
        characterId: deleteState.character.id,
        error,
      });
      showError("Failed to delete character. Please try again.", {
        title: "Delete Failed",
      });
      setDeleteState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleCloseDeleteModal = () => {
    if (deleteState.isDeleting) return; // Prevent closing while deleting
    setDeleteState({ isOpen: false, character: null, isDeleting: false });
  };

  return (
    <>
      <ItemGrid
        items={characters}
        loading={loading}
        error={error}
        emptyState={{
          icon: "plus",
          title: "No Characters Yet",
          description:
            "Ready to start your adventure? Create your first character to get started!",
          action: {
            label: "Create Your First Character",
            href: "/new-character",
          },
        }}
        header={{
          title: "Your Characters",
          icon: "shield",
          count: characters.length,
        }}
        renderItem={(character) => (
          <CharacterCard
            key={character.id}
            character={character}
            user={user}
            onDelete={handleDeleteCharacter}
            isDeleting={
              deleteState.isDeleting &&
              deleteState.character?.id === character.id
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
        entityType="character"
        entityName={deleteState.character?.name || ""}
        isDeleting={deleteState.isDeleting}
      />
    </>
  );
}
