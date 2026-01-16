import { ItemGrid } from "@/components/ui/composite";
import { DeletionModal } from "@/components/modals/base/ConfirmationModal";
import { CharacterCard } from "./CharacterCard";
import { useAuth } from "@/hooks";
import { useEnhancedCharacters } from "@/hooks/queries/useEnhancedQueries";
import { useCharacterMutations } from "@/hooks/mutations/useEnhancedMutations";
import { useState, useMemo } from "react";
import { Select } from "@/components/ui";
import type { CharacterListItem } from "@/services";

type SortOption = "name" | "level" | "class" | "race";

const DEFAULT_SORT: SortOption = "name";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "level", label: "Level" },
  { value: "class", label: "Class" },
  { value: "race", label: "Race" },
];

function sortCharacters(
  characters: CharacterListItem[],
  sortBy: SortOption
): CharacterListItem[] {
  return [...characters].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      case "level":
        return (b.level ?? 0) - (a.level ?? 0);
      case "class":
        return (a.class || "").localeCompare(b.class || "");
      case "race":
        return (a.race || "").localeCompare(b.race || "");
      default:
        return 0;
    }
  });
}

export function CharactersList() {
  const {
    data: characters = [],
    isLoading: loading,
    error,
    refetch,
  } = useEnhancedCharacters();
  const { user } = useAuth();
  const { deleteCharacter, isDeleting } = useCharacterMutations();
  const [sortBy, setSortBy] = useState<SortOption>(DEFAULT_SORT);
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    character: { id: string; name: string } | null;
  }>({ isOpen: false, character: null });

  const sortedCharacters = useMemo(
    () => sortCharacters(characters, sortBy),
    [characters, sortBy]
  );

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
      {!loading && characters.length > 1 && (
        <div className="mb-4 max-w-48">
          <Select
            label="Sort by"
            options={sortOptions}
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
            size="sm"
          />
        </div>
      )}
      <ItemGrid
        items={sortedCharacters}
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
          count: sortedCharacters.length,
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
