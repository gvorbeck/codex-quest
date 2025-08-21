// Hook for managing character data
import { useState, useEffect, useCallback } from "react";
import { getUserCharacters, type CharacterListItem } from "@/services/characters";
import { useAuth } from "./useAuth";

export function useCharacters() {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<CharacterListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = useCallback(async () => {
    if (!user) {
      setCharacters([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const userCharacters = await getUserCharacters(user);
      setCharacters(userCharacters);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch characters");
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
