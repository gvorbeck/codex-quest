import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationContext } from "@/hooks";
import { createMutationHandlers } from "@/lib/globalErrorHandler";
import { queryKeys } from "@/lib/queryKeys";
import type { Character, Game } from "@/types";
import type { CharacterListItem } from "@/services/characters";
import {
  saveCharacter as saveCharacterService,
  deleteCharacter as deleteCharacterService,
  saveGame as saveGameService,
  deleteGame as deleteGameService
} from "@/services";

/**
 * Enhanced character mutations with consistent error handling and user feedback
 */
export function useCharacterMutations(options?: {
  onSaveSuccess?: (characterId: string) => void;
  onDeleteSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const notifications = useNotificationContext();
  const { onError, onSuccess } = createMutationHandlers(notifications);

  const saveMutation = useMutation({
    mutationFn: ({ userId, character, characterId }: {
      userId: string;
      character: Character;
      characterId?: string;
    }) => saveCharacterService(userId, character, characterId),

    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.characters.user(variables.userId),
      });

      if (variables.characterId) {
        await queryClient.cancelQueries({
          queryKey: queryKeys.characters.detail(variables.userId, variables.characterId),
        });
      }

      // Snapshot the previous values
      const previousCharacters = queryClient.getQueryData(
        queryKeys.characters.user(variables.userId)
      );
      const previousCharacter = variables.characterId
        ? queryClient.getQueryData(
            queryKeys.characters.detail(variables.userId, variables.characterId)
          )
        : null;

      // Optimistic update
      queryClient.setQueryData(
        queryKeys.characters.user(variables.userId),
        (old: CharacterListItem[]) => {
          if (!old) return [{ ...variables.character, id: `temp-${Date.now()}` } as CharacterListItem];

          if (variables.characterId) {
            // Update existing
            return old.map((char) =>
              char.id === variables.characterId
                ? { ...variables.character, id: variables.characterId } as CharacterListItem
                : char
            );
          } else {
            // Add new with temporary ID
            return [...old, { ...variables.character, id: `temp-${Date.now()}` } as CharacterListItem];
          }
        }
      );

      return { previousCharacters, previousCharacter };
    },

    onError: (error, variables, context) => {
      // Rollback optimistic updates
      if (context?.previousCharacters) {
        queryClient.setQueryData(
          queryKeys.characters.user(variables.userId),
          context.previousCharacters
        );
      }
      if (context?.previousCharacter && variables.characterId) {
        queryClient.setQueryData(
          queryKeys.characters.detail(variables.userId, variables.characterId),
          context.previousCharacter
        );
      }

      onError(error, {
        operation: variables.characterId ? "Update" : "Save",
        entityType: "character",
        entityName: variables.character.name,
      });
    },

    onSuccess: (characterId, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.characters.user(variables.userId),
      });

      onSuccess({
        operation: variables.characterId ? "Update" : "Save",
        entityType: "character",
        entityName: variables.character.name,
      });

      options?.onSaveSuccess?.(characterId);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ userId, characterId }: {
      userId: string;
      characterId: string;
    }) => deleteCharacterService(userId, characterId),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.characters.user(variables.userId),
      });

      const previousCharacters = queryClient.getQueryData(
        queryKeys.characters.user(variables.userId)
      );

      // Find character name for feedback
      const characters = previousCharacters as CharacterListItem[] || [];
      const character = characters.find(c => c.id === variables.characterId);

      // Optimistic removal
      queryClient.setQueryData(
        queryKeys.characters.user(variables.userId),
        (old: CharacterListItem[]) => old?.filter((char) => char.id !== variables.characterId) || []
      );

      return { previousCharacters, characterName: character?.name };
    },

    onError: (error, variables, context) => {
      if (context?.previousCharacters) {
        queryClient.setQueryData(
          queryKeys.characters.user(variables.userId),
          context.previousCharacters
        );
      }

      onError(error, {
        operation: "Delete",
        entityType: "character",
        entityName: context?.characterName || "Unknown character",
      });
    },

    onSuccess: (_, __, context) => {
      onSuccess({
        operation: "Delete",
        entityType: "character",
        entityName: context?.characterName || "Unknown character",
      });

      options?.onDeleteSuccess?.();
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

/**
 * Enhanced game mutations with consistent error handling and user feedback
 */
export function useGameMutations(options?: {
  onSaveSuccess?: () => void;
  onDeleteSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const notifications = useNotificationContext();
  const { onError, onSuccess } = createMutationHandlers(notifications);

  const saveMutation = useMutation({
    mutationFn: ({ userId, game, gameId }: {
      userId: string;
      game: Game;
      gameId?: string;
    }) => saveGameService(userId, game, gameId),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.games.user(variables.userId),
      });

      const previousGames = queryClient.getQueryData(
        queryKeys.games.user(variables.userId)
      );

      // Optimistic update
      queryClient.setQueryData(
        queryKeys.games.user(variables.userId),
        (old: Game[]) => {
          if (!old) return [variables.game];

          if (variables.gameId) {
            return old.map((game) =>
              game.id === variables.gameId
                ? { ...variables.game, id: variables.gameId }
                : game
            );
          } else {
            return [...old, { ...variables.game, id: `temp-${Date.now()}` }];
          }
        }
      );

      return { previousGames };
    },

    onError: (error, variables, context) => {
      if (context?.previousGames) {
        queryClient.setQueryData(
          queryKeys.games.user(variables.userId),
          context.previousGames
        );
      }

      onError(error, {
        operation: variables.gameId ? "Update" : "Save",
        entityType: "game",
        entityName: variables.game.name,
      });
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.games.user(variables.userId),
      });

      onSuccess({
        operation: variables.gameId ? "Update" : "Save",
        entityType: "game",
        entityName: variables.game.name,
      });

      options?.onSaveSuccess?.();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ userId, gameId }: {
      userId: string;
      gameId: string;
    }) => deleteGameService(userId, gameId),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.games.user(variables.userId),
      });

      const previousGames = queryClient.getQueryData(
        queryKeys.games.user(variables.userId)
      );

      const games = previousGames as Game[] || [];
      const game = games.find(g => g.id === variables.gameId);

      queryClient.setQueryData(
        queryKeys.games.user(variables.userId),
        (old: Game[]) => old?.filter((game) => game.id !== variables.gameId) || []
      );

      return { previousGames, gameName: game?.name };
    },

    onError: (error, variables, context) => {
      if (context?.previousGames) {
        queryClient.setQueryData(
          queryKeys.games.user(variables.userId),
          context.previousGames
        );
      }

      onError(error, {
        operation: "Delete",
        entityType: "game",
        entityName: context?.gameName || "Unknown game",
      });
    },

    onSuccess: (_, __, context) => {
      onSuccess({
        operation: "Delete",
        entityType: "game",
        entityName: context?.gameName || "Unknown game",
      });

      options?.onDeleteSuccess?.();
    },
  });

  return {
    saveGame: saveMutation.mutate,
    deleteGame: deleteMutation.mutate,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    saveError: saveMutation.error,
    deleteError: deleteMutation.error,
  };
}