// Hook for managing games data
import { useState, useEffect, useCallback } from "react";
import { getUserGames, type Game } from "@/services/games";
import { useAuth } from "./useAuth";

export function useGames() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    if (!user) {
      setGames([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const userGames = await getUserGames(user);
      setGames(userGames);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch games");
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return {
    games,
    loading,
    error,
    refetch: fetchGames
  };
}