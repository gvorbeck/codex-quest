// Simple character list component
import { Link } from "wouter";
import { Card, Typography } from "@/components/ui";
import { useCharacters, useAuth } from "@/hooks";

export function CharactersList() {
  const { characters, loading, error } = useCharacters();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="status-message">
        <Typography variant="helper">Loading your characters...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-message">
        <Typography variant="helper" className="text-red-400">Error: {error}</Typography>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="status-message">
        <Typography variant="helper">No characters found. Create your first character!</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Typography variant="h4">Your Characters</Typography>
      <div className="space-y-2">
        {characters.map((character) => (
          <Card
            key={character.id}
            variant="standard"
            size="compact"
            className="hover:border-primary-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h5">
                  {character.name}
                </Typography>
                <Typography variant="caption" color="secondary">ID: {character.id}</Typography>
              </div>
              {user && (
                <Link
                  href={`/u/${user.uid}/c/${character.id}`}
                  className="bg-highlight hover:bg-highlight-hover text-primary-900 px-4 py-2 rounded transition-colors font-medium"
                >
                  View Sheet
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
