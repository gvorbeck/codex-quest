import { useQuery } from "@tanstack/react-query";
import { getUserGames } from "@/services";
import { useAuth } from "../auth";
import { queryKeys } from "@/lib/queryKeys";

/**
 * TanStack Query hook for managing games data
 * Replaces the old useState-based useGames hook with proper caching
 */
export function useGames() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.games.user(user?.uid || ""),
    queryFn: () => getUserGames(user!),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Games change less frequently than characters
    retry: (failureCount, error) => {
      // Don't retry on authentication errors or other 4xx errors
      if (error instanceof Error && error.message.includes("permission")) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
