import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib";
import { FIREBASE_COLLECTIONS } from "@/constants";
import { useAuth } from "@/hooks";
import { processCharacterData, isLegacyCharacter } from "@/services";
import { logger } from "@/utils";
import type { Character } from "@/types";

/**
 * Get a full character by ID for character sheet usage
 */
const getCharacterSheet = async (
  userId: string,
  characterId: string
): Promise<Character> => {
  const characterRef = doc(
    db,
    FIREBASE_COLLECTIONS.USERS,
    userId,
    FIREBASE_COLLECTIONS.CHARACTERS,
    characterId
  );

  const docSnap = await getDoc(characterRef);

  if (!docSnap.exists()) {
    throw new Error("Character not found");
  }

  const data = docSnap.data();
  const wasLegacy = isLegacyCharacter(data);
  const processedData = processCharacterData(data);

  // If this was a legacy character, save the migrated data back to Firebase
  if (wasLegacy) {
    try {
      await setDoc(characterRef, processedData);
      logger.info(
        `Successfully persisted migration for character ${characterId}`
      );
    } catch (error) {
      logger.error(
        `Failed to persist migration for character ${characterId}:`,
        error
      );
      // Continue with migrated data even if persistence fails
    }
  }

  return processedData as unknown as Character;
};

/**
 * Save character sheet changes
 */
const saveCharacterSheet = async (
  userId: string,
  characterId: string,
  character: Character
): Promise<void> => {
  const characterRef = doc(
    db,
    FIREBASE_COLLECTIONS.USERS,
    userId,
    FIREBASE_COLLECTIONS.CHARACTERS,
    characterId
  );

  // Ensure character has current version
  const dataToSave = {
    ...character,
    settings: {
      ...character.settings,
      version: 2.4, // Current version
    },
  };

  // Remove id field when saving to Firebase
  const { ...cleanData } = dataToSave;

  await setDoc(characterRef, cleanData);
  logger.info(`Successfully updated character sheet ${characterId}`);
};

export function useCharacterSheet(userId: string, characterId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if the current user owns this character
  const isOwner = Boolean(user && userId === user.uid);

  const query = useQuery({
    queryKey: ["character", userId, characterId],
    queryFn: () => getCharacterSheet(userId, characterId),
    enabled: !!userId && !!characterId,
    staleTime: 30 * 1000, // 30 seconds - character sheets change frequently during play
  });

  const updateMutation = useMutation({
    mutationFn: (character: Character) =>
      saveCharacterSheet(userId, characterId, character),

    onMutate: async (newCharacter) => {
      await queryClient.cancelQueries({
        queryKey: ["character", userId, characterId],
      });

      const previousCharacter = queryClient.getQueryData<Character>([
        "character",
        userId,
        characterId,
      ]);

      // Optimistic update
      queryClient.setQueryData(
        ["character", userId, characterId],
        newCharacter
      );

      return { previousCharacter };
    },

    onError: (_, __, context) => {
      if (context?.previousCharacter) {
        queryClient.setQueryData(
          ["character", userId, characterId],
          context.previousCharacter
        );
      }
    },

    onSuccess: () => {
      // Also update the character in the characters list if it exists in cache
      queryClient.invalidateQueries({
        queryKey: ["characters", userId],
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
    clearError: () => {
      // TanStack Query automatically handles error clearing on retry/success
    },
    setError: () => {
      // For compatibility with existing components, though TanStack Query handles this better
      logger.warn(
        "setError called on useCharacterSheet - consider using mutation error states instead"
      );
    },
  };
}
