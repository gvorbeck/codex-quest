import { ItemGrid } from "@/components/ui/composite";
import { DeletionModal } from "@/components/modals/base/ConfirmationModal";
import { CharacterCard } from "./CharacterCard";
import {
  useCharacters,
  useAuth,
  useNotificationContext,
  useCharacterMutations,
} from "@/hooks";
import { logger, getErrorMessage } from "@/utils";
import { useState } from "react";

export function CharactersList() {
  const {
    data: characters = [],
    isLoading: loading,
    error,
    refetch,
  } = useCharacters();
  const { user } = useAuth();
  const { showError } = useNotificationContext();
  const { deleteCharacter: deleteCharacterMutation, isDeleting } =
    useCharacterMutations();
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    character: { id: string; name: string } | null;
  }>({ isOpen: false, character: null });

  const handleDeleteCharacter = (
    characterId: string,
    characterName: string
  ) => {
    if (!user) return;
    setDeleteState({
      isOpen: true,
      character: { id: characterId, name: characterName },
    });
  };

  const handleConfirmDelete = async () => {
    if (!user || !deleteState.character) return;

    try {
      deleteCharacterMutation({
        userId: user.uid,
        characterId: deleteState.character.id,
      });
      setDeleteState({ isOpen: false, character: null });
    } catch (error) {
      logger.error("Failed to delete character:", {
        characterId: deleteState.character.id,
        error,
      });
      showError("Failed to delete character. Please try again.", {
        title: "Delete Failed",
      });
    }
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return; // Prevent closing while deleting
    setDeleteState({ isOpen: false, character: null });
  };

  return (
    <>
      <ItemGrid
        items={characters}
        loading={loading}
        error={getErrorMessage(error, "Failed to load characters. Please try again.")}
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
              isDeleting && deleteState.character?.id === character.id
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
        isDeleting={isDeleting}
      />
    </>
  );
}
