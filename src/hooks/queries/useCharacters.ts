import { useQuery } from "@tanstack/react-query";
import { getUserCharacters } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { queryKeys } from "@/lib/queryKeys";

export function useCharacters() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.characters.user(user?.uid || ""),
    queryFn: () => getUserCharacters(user!),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // Characters list can be stale for 2 minutes
    retry: (failureCount: number, error: unknown) => {
      // Don't retry on authentication errors
      if (error instanceof Error && error.message.includes("permission")) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
