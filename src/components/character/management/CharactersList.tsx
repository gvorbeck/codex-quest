import { ItemGrid } from "@/components/ui/display";
import { DeleteCharacterModal } from "@/components/ui/feedback";
import { CharacterCard } from "./CharacterCard";
import { useCharacters, useAuth } from "@/hooks";
import { deleteCharacter } from "@/services/characters";
import { useState } from "react";

export function CharactersList() {
  const { characters, loading, error, refetch } = useCharacters();
  const { user } = useAuth();
  const [deletingCharacter, setDeletingCharacter] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<{id: string, name: string} | null>(null);

  const handleDeleteCharacter = (characterId: string, characterName: string) => {
    if (!user) return;
    setCharacterToDelete({ id: characterId, name: characterName });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!user || !characterToDelete) return;

    setDeletingCharacter(characterToDelete.id);
    try {
      await deleteCharacter(user.uid, characterToDelete.id);
      await refetch();
      setDeleteModalOpen(false);
      setCharacterToDelete(null);
    } catch (error) {
      console.error('Failed to delete character:', error);
      alert('Failed to delete character. Please try again.');
    } finally {
      setDeletingCharacter(null);
    }
  };

  const handleCloseDeleteModal = () => {
    if (deletingCharacter) return; // Prevent closing while deleting
    setDeleteModalOpen(false);
    setCharacterToDelete(null);
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
          description: "Ready to start your adventure? Create your first character to get started!",
          action: {
            label: "Create Your First Character",
            href: "/new-character"
          }
        }}
        header={{
          title: "Your Characters",
          icon: "shield",
          count: characters.length
        }}
        renderItem={(character) => (
          <CharacterCard
            key={character.id}
            character={character}
            user={user}
            onDelete={handleDeleteCharacter}
            isDeleting={deletingCharacter === character.id}
          />
        )}
        onRetry={refetch}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCharacterModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        characterName={characterToDelete?.name || ""}
        isDeleting={!!deletingCharacter}
      />
    </>
  );
}
