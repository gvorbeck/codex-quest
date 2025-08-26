import { Link } from "wouter";
import { Typography, Button, Badge } from "@/components/ui";
import { DeleteCharacterModal } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/display";
import { useCharacters, useAuth } from "@/hooks";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";
import { deleteCharacter } from "@/services/characters";
import { useState } from "react";

export function CharactersList() {
  const { characters, loading, error, refetch } = useCharacters();
  const { user } = useAuth();
  const [deletingCharacter, setDeletingCharacter] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<{id: string, name: string} | null>(null);

  // Helper functions to get names from IDs
  const getRaceName = (raceId: string): string => {
    const race = allRaces.find((r) => r.id === raceId);
    return race?.name || raceId;
  };

  const getClassName = (classId: string): string => {
    const classData = allClasses.find((cls) => cls.id === classId);
    return classData?.name || classId;
  };

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400" />
        <Typography variant="helper" color="secondary">
          Loading your characters...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Icon name="exclamation-circle" size="xl" className="text-red-400" />
        <Typography variant="body" className="text-red-400 text-center">
          Error loading characters: {String(error)}
        </Typography>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="p-6 rounded-full bg-amber-950/20 border-2 border-amber-600/30">
          <Icon name="plus" size="xl" className="text-amber-400" />
        </div>
        <div className="text-center space-y-3">
          <Typography variant="h4" color="primary">
            No Characters Yet
          </Typography>
          <Typography variant="body" color="secondary">
            Ready to start your adventure? Create your first character to get started!
          </Typography>
        </div>
        <Link href="/new-character">
          <Button variant="primary" size="lg" className="mt-4">
            <Icon name="plus" size="sm" className="mr-2" />
            Create Your First Character
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h4" className="flex items-center gap-2">
          <Icon name="shield" size="md" className="text-amber-400" />
          Your Characters
        </Typography>
        <Typography variant="helper" color="secondary">
          {characters.length} character{characters.length !== 1 ? 's' : ''}
        </Typography>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {characters.map((character) => (
          <div
            key={character.id}
            className="group relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/80 border-2 border-zinc-700/50 rounded-xl p-6 transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1"
          >
            {/* Clickable overlay for entire card */}
            <Link
              href={`/u/${user?.uid}/c/${character.id}`}
              className="absolute inset-0 z-10 cursor-pointer rounded-xl"
              aria-label={`View ${character.name} character sheet`}
            />
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-xl pointer-events-none" />
            
            <div className="relative z-20 space-y-4 pointer-events-none">
              {/* Character Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Typography 
                    variant="h4" 
                    className="text-zinc-100 group-hover:text-amber-300 transition-colors duration-300 truncate font-bold tracking-wide"
                  >
                    {character.name}
                  </Typography>
                  {character.level && (
                    <Typography variant="caption" className="text-amber-400 font-medium mt-1">
                      Level {character.level}
                    </Typography>
                  )}
                </div>
              </div>

              {/* Character Race/Class Info */}
              {character.race && character.class && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <Typography variant="helper" className="text-zinc-400 uppercase tracking-wider font-medium text-xs">
                      Race & Class
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant="primary" 
                      size="md"
                      className="bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-900 font-semibold shadow-lg"
                    >
                      {getRaceName(character.race)}
                    </Badge>
                    {Array.isArray(character.class) ? (
                      character.class.map((classId) => (
                        <Badge 
                          key={classId} 
                          variant="secondary" 
                          size="md"
                          className="bg-zinc-700 text-zinc-200 border border-zinc-600 font-medium hover:bg-zinc-600 transition-colors"
                        >
                          {getClassName(classId)}
                        </Badge>
                      ))
                    ) : (
                      <Badge 
                        variant="secondary" 
                        size="md"
                        className="bg-zinc-700 text-zinc-200 border border-zinc-600 font-medium hover:bg-zinc-600 transition-colors"
                      >
                        {getClassName(character.class)}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Character Stats/Info (if available) */}
              {(character.hp || character.xp !== undefined) && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {character.hp && (
                    <div className="text-center p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                      <Typography variant="caption" className="text-zinc-400 uppercase tracking-wide text-xs">
                        Health
                      </Typography>
                      <Typography variant="body" className="text-zinc-200 font-bold">
                        {typeof character.hp === 'object' && character.hp.max ? 
                          `${character.hp.current || 0}/${character.hp.max}` : 
                          String(character.hp)}
                      </Typography>
                    </div>
                  )}
                  {character.xp !== undefined && (
                    <div className="text-center p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                      <Typography variant="caption" className="text-zinc-400 uppercase tracking-wide text-xs">
                        Experience
                      </Typography>
                      <Typography variant="body" className="text-zinc-200 font-bold">
                        {character.xp.toLocaleString()}
                      </Typography>
                    </div>
                  )}
                </div>
              )}

              {/* Action Area */}
              {user && (
                <div className="flex justify-end pt-3 border-t border-zinc-700/50">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="relative z-30 p-2 text-red-400 bg-transparent border border-red-600/40 shadow-none hover:text-white hover:bg-red-600 hover:border-red-600 hover:shadow-lg hover:shadow-red-600/40 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-800 transition-all duration-200 rounded-lg pointer-events-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteCharacter(character.id, character.name);
                    }}
                    disabled={deletingCharacter === character.id}
                    aria-label={`Delete ${character.name}`}
                    title={`Delete ${character.name}`}
                  >
                    {deletingCharacter === character.id ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-current" />
                    ) : (
                      <Icon name="trash" size="xs" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteCharacterModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        characterName={characterToDelete?.name || ""}
        isDeleting={!!deletingCharacter}
      />
    </div>
  );
}
