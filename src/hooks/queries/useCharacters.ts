import { useQuery } from "@tanstack/react-query";
import { getUserCharacters } from "@/services";
import { useAuth } from "@/hooks";

export function useCharacters() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["characters", user?.uid],
    queryFn: () => getUserCharacters(user!),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes - character lists change less frequently
  });
}
