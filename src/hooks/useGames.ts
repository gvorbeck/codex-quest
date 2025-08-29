// Hook for managing games data
import { useState, useEffect, useCallback } from "react";
import { getUserGames, type Game } from "@/services/games";
import { useAuth } from "./useAuth";
import { useLoadingState } from "./useLoadingState";

export function useGames() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const { loading, withLoading } = useLoadingState();
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    if (!user) {
      setGames([]);
      return;
    }

    setError(null);
    
    try {
      await withLoading(async () => {
        const userGames = await getUserGames(user);
        setGames(userGames);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch games");
      setGames([]);
    }
  }, [user, withLoading]);

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