import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCharacterStore } from "@/stores";
import { queryKeys } from "@/lib/queryKeys";
import type { Character } from "@/types";
import {
  saveCharacter,
  deleteCharacter,
  type CharacterListItem,
} from "@/services";

interface SaveCharacterParams {
  userId: string;
  character: Character;
  characterId?: string;
}

interface DeleteCharacterParams {
  userId: string;
  characterId: string;
}

export function useCharacterMutations() {
  const queryClient = useQueryClient();
  const clearDraft = useCharacterStore((state) => state.clearDraft);

  const saveMutation = useMutation({
    mutationFn: ({ userId, character, characterId }: SaveCharacterParams) =>
      saveCharacter(userId, character, characterId),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.characters.user(variables.userId),
      });

      const previousCharacters = queryClient.getQueryData<CharacterListItem[]>(
        queryKeys.characters.user(variables.userId)
      );

      // Optimistic update
      queryClient.setQueryData(
        queryKeys.characters.user(variables.userId),
        (old: CharacterListItem[] = []) => {
          if (variables.characterId) {
            // Update existing
            return old.map((char) =>
              char.id === variables.characterId
                ? {
                    ...char,
                    ...variables.character,
                    id: variables.characterId,
                  }
                : char
            );
          } else {
            // Add new with temporary ID
            return [
              ...old,
              {
                ...variables.character,
                id: `temp-${Date.now()}`,
              } as CharacterListItem,
            ];
          }
        }
      );

      return { previousCharacters };
    },

    onError: (_, variables, context) => {
      if (context?.previousCharacters) {
        queryClient.setQueryData(
          queryKeys.characters.user(variables.userId),
          context.previousCharacters
        );
      }
    },

    onSuccess: (_, variables) => {
      clearDraft();
      // Invalidate to get fresh data with real IDs
      queryClient.invalidateQueries({
        queryKey: queryKeys.characters.user(variables.userId),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ userId, characterId }: DeleteCharacterParams) =>
      deleteCharacter(userId, characterId),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.characters.user(variables.userId),
      });

      const previousCharacters = queryClient.getQueryData<CharacterListItem[]>(
        queryKeys.characters.user(variables.userId)
      );

      // Optimistic removal
      queryClient.setQueryData(
        queryKeys.characters.user(variables.userId),
        (old: CharacterListItem[] = []) =>
          old.filter((char) => char.id !== variables.characterId)
      );

      return { previousCharacters };
    },

    onError: (_, variables, context) => {
      if (context?.previousCharacters) {
        queryClient.setQueryData(
          queryKeys.characters.user(variables.userId),
          context.previousCharacters
        );
      }
    },

    onSuccess: (_, variables) => {
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.characters.user(variables.userId),
      });
    },
  });

  return {
    saveCharacter: saveMutation.mutate,
    deleteCharacter: deleteMutation.mutate,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    saveError: saveMutation.error,
    deleteError: deleteMutation.error,
  };
}
