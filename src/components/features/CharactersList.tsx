// Simple character list component
import { useCharacters } from "@/hooks";

export function CharactersList() {
  const { characters, loading, error } = useCharacters();

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-primary-400">Loading your characters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-primary-400">No characters found. Create your first character!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-primary-100">Your Characters</h3>
      <div className="space-y-2">
        {characters.map((character) => (
          <div
            key={character.id}
            className="bg-primary-800 rounded-lg p-4 border border-primary-700"
          >
            <h4 className="text-lg font-medium text-primary-100">
              {character.name}
            </h4>
            <p className="text-sm text-primary-400">ID: {character.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
