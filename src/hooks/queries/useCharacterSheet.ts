import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { useAuth } from "@/hooks";
import { getCharacterById, saveCharacter } from "@/services";
import type { Character } from "@/types";

export function useCharacterSheet(userId: string, characterId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if the current user owns this character
  const isOwner = Boolean(user && userId === user.uid);

  const query = useQuery<Character | null>({
    queryKey: queryKeys.characters.detail(userId, characterId),
    queryFn: () => getCharacterById(userId, characterId),
    enabled: !!userId && !!characterId,
    staleTime: 30 * 1000, // 30 seconds - character sheets change frequently during play
  });

  const updateMutation = useMutation({
    mutationFn: (character: Character) =>
      saveCharacter(userId, character, characterId),

    onMutate: async (newCharacter) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.characters.detail(userId, characterId),
      });

      const previousCharacter = queryClient.getQueryData<Character>(
        queryKeys.characters.detail(userId, characterId)
      );

      // Optimistic update
      queryClient.setQueryData(
        queryKeys.characters.detail(userId, characterId),
        newCharacter
      );

      return { previousCharacter };
    },

    onError: (_, __, context) => {
      if (context?.previousCharacter) {
        queryClient.setQueryData(
          queryKeys.characters.detail(userId, characterId),
          context.previousCharacter
        );
      }
    },

    onSuccess: () => {
      // Also update the character in the characters list if it exists in cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.characters.user(userId),
      });
    },
  });

  return {
    character: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
    isOwner,
    isUpdating: updateMutation.isPending,
    updateCharacter: updateMutation.mutate,
    updateError: updateMutation.error?.message || null,
  };
}