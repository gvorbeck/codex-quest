import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationContext } from "@/hooks";
import { createMutationHandlers } from "@/lib/globalErrorHandler";
import { queryKeys } from "@/lib/queryKeys";
import type { Character, Game } from "@/types";
import type { EquipmentPack } from "@/types/character";
import type { CharacterListItem } from "@/services/characters";
import {
  saveCharacter as saveCharacterService,
  deleteCharacter as deleteCharacterService,
  saveGame as saveGameService,
  deleteGame as deleteGameService
} from "@/services";
import { applyEquipmentPackToCharacter } from "@/utils/character";

// Type guards for query data safety
function isCharacterListArray(data: unknown): data is CharacterListItem[] {
  return Array.isArray(data) && (data.length === 0 || data.every(item => typeof item === 'object' && item !== null && 'id' in item));
}

function isGameArray(data: unknown): data is Game[] {
  return Array.isArray(data) && (data.length === 0 || data.every(item => typeof item === 'object' && item !== null && 'id' in item));
}

// Shared utility functions for optimistic updates
function createOptimisticSaveUpdate<T extends { id?: string }>(
  items: T[],
  entity: T,
  entityId?: string
): T[] {
  if (entityId) {
    return items.map((item) =>
      item.id === entityId ? { ...entity, id: entityId } : item
    );
  } else {
    return [...items, { ...entity, id: `temp-${crypto.randomUUID()}` }];
  }
}

function createOptimisticDeleteUpdate<T extends { id?: string }>(
  items: T[],
  entityId: string
): T[] {
  return items.filter((item) => item.id !== entityId);
}

/**
 * Enhanced character mutations with consistent error handling and user feedback
 */
export function useCharacterMutations(options?: {
  onSaveSuccess?: (characterId: string) => void;
  onDeleteSuccess?: () => void;
  onPackApplied?: () => void;
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
        (old: unknown) => {
          const characters = isCharacterListArray(old) ? old : [];
          const characterListItem = { ...variables.character, id: variables.characterId || `temp-${crypto.randomUUID()}` } as CharacterListItem;
          return createOptimisticSaveUpdate(
            characters,
            characterListItem,
            variables.characterId
          );
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
      const characters = isCharacterListArray(previousCharacters) ? previousCharacters : [];
      const character = characters.find(c => c.id === variables.characterId);

      // Optimistic removal
      queryClient.setQueryData(
        queryKeys.characters.user(variables.userId),
        (old: unknown) => {
          const characters = isCharacterListArray(old) ? old : [];
          return createOptimisticDeleteUpdate(characters, variables.characterId);
        }
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

  const applyPackMutation = useMutation({
    mutationFn: ({ character, pack }: { character: Character; pack: EquipmentPack }) => {
      return new Promise<{ character: Character; pack: EquipmentPack }>((resolve, reject) => {
        const { character: updatedCharacter, result } = applyEquipmentPackToCharacter(character, pack);

        if (result.success) {
          resolve({ character: updatedCharacter, pack });
        } else {
          reject(new Error(result.error || "Failed to apply equipment pack"));
        }
      });
    },

    onSuccess: ({ pack }) => {
      onSuccess({
        operation: "Apply",
        entityType: "equipment pack",
        entityName: pack.name,
      });
      options?.onPackApplied?.();
    },

    onError: (error, variables) => {
      onError(error, {
        operation: "Apply",
        entityType: "equipment pack",
        entityName: variables?.pack?.name || "Unknown pack",
      });
    },
  });

  return {
    saveCharacter: saveMutation.mutate,
    deleteCharacter: deleteMutation.mutate,
    applyEquipmentPack: applyPackMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isApplyingPack: applyPackMutation.isPending,
    saveError: saveMutation.error,
    deleteError: deleteMutation.error,
    packError: applyPackMutation.error,
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
        (old: unknown) => {
          const games = isGameArray(old) ? old : [];
          return createOptimisticSaveUpdate(games, variables.game, variables.gameId);
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

      const games = isGameArray(previousGames) ? previousGames : [];
      const game = games.find(g => g.id === variables.gameId);

      queryClient.setQueryData(
        queryKeys.games.user(variables.userId),
        (old: unknown) => {
          const games = isGameArray(old) ? old : [];
          return createOptimisticDeleteUpdate(games, variables.gameId);
        }
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