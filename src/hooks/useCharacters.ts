// Hook for managing character data
import { useState, useEffect, useCallback } from "react";
import { getUserCharacters, type CharacterListItem } from "@/services/characters";
import { useAuth } from "./useAuth";
import { useLoadingState } from "./useLoadingState";

export function useCharacters() {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<CharacterListItem[]>([]);
  const { loading, withLoading } = useLoadingState();
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = useCallback(async () => {
    if (!user) {
      setCharacters([]);
      return;
    }

    setError(null);
    
    try {
      await withLoading(async () => {
        const userCharacters = await getUserCharacters(user);
        setCharacters(userCharacters);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch characters");
      setCharacters([]);
    }
  }, [user, withLoading]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return {
    characters,
    loading,
    error,
    refetch: fetchCharacters
  };
}
