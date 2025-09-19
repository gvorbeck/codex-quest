import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { useAuth } from "../auth";
import { getGameById, saveGame } from "@/services";
import type { Game } from "@/types";

/**
 * TanStack Query hook for managing a specific game
 */
export function useGame(userId?: string, gameId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query for game data
  const gameQuery = useQuery({
    queryKey: queryKeys.games.detail(userId || "", gameId || ""),
    queryFn: () => getGameById(userId!, gameId!),
    enabled: !!(userId && gameId),
    staleTime: 30 * 1000, // Game data can be stale for 30 seconds (for active editing)
    retry: (failureCount: number, error: unknown) => {
      if (error instanceof Error && error.message.includes("permission")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Mutation for updating game
  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Game>) => {
      const updatedGame = { ...gameQuery.data!, ...updates };
      return saveGame(userId!, updatedGame, gameId!);
    },

    onMutate: async (updates) => {
      const queryKey = queryKeys.games.detail(userId || "", gameId || "");
      await queryClient.cancelQueries({ queryKey });

      const previousGame = queryClient.getQueryData<Game>(queryKey);

      // Optimistic update
      if (previousGame) {
        queryClient.setQueryData(queryKey, {
          ...previousGame,
          ...updates,
        });
      }

      return { previousGame };
    },

    onError: (_, __, context) => {
      if (context?.previousGame) {
        queryClient.setQueryData(
          queryKeys.games.detail(userId || "", gameId || ""),
          context.previousGame
        );
      }
    },

    onSuccess: () => {
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: queryKeys.games.detail(userId || "", gameId || ""),
      });
    },
  });

  // Check if current user is the owner
  const isOwner = user?.uid === userId;

  return {
    data: gameQuery.data,
    isLoading: gameQuery.isLoading,
    error: gameQuery.error,
    isOwner,
    isUpdating: updateMutation.isPending,
    updateGame: updateMutation.mutate,
    updateError: updateMutation.error,
  };
}
