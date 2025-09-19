import { ItemGrid } from "@/components/ui/composite";
import { DeletionModal } from "@/components/modals/base/ConfirmationModal";
import { CharacterCard } from "./CharacterCard";
import { useAuth } from "@/hooks";
import { useEnhancedCharacters } from "@/hooks/queries/useEnhancedQueries";
import { useCharacterMutations } from "@/hooks/mutations/useEnhancedMutations";
import { useState } from "react";

export function CharactersList() {
  const {
    data: characters = [],
    isLoading: loading,
    error,
    refetch,
  } = useEnhancedCharacters();
  const { user } = useAuth();
  const { deleteCharacter, isDeleting } = useCharacterMutations();
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

  const handleConfirmDelete = () => {
    if (!user || !deleteState.character) return;

    deleteCharacter({
      userId: user.uid,
      characterId: deleteState.character.id,
    });

    setDeleteState({ isOpen: false, character: null });
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
        error={error instanceof Error ? error.message : null}
        emptyState={{
          icon: "plus",
          title: "No Characters Yet",
          description:
            "Ready to start your adventure? Create your first character to get started!",
          action: {
            label: "Create Your First Character",
            href: "/new-character?new=true",
          },
        }}
        header={{
          title: "Your Characters",
          icon: "shield",
          count: characters.length,
        }}
        renderItem={(character) => (
          <CharacterCard
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
