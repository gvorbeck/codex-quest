import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { queryKeys } from "@/lib/queryKeys";
import { logger, hasTurnUndeadAbility } from "@/utils";
import { isMockMode } from "@/lib/mockMode";
import { getCharacterById } from "@/services";
import type { Character } from "@/types";

interface DataRequest {
  userId: string;
  characterId: string;
}

interface ResolvedData {
  characterName?: string | undefined;
  avatar?: string | undefined;
  race?: string | undefined;
  class?: string | undefined;
  level?: number | undefined;
  hasTurnUndead?: boolean | undefined;
}

/**
 * Get character summary data for display purposes
 * Supports both Firebase and mock mode
 */
async function getCharacterSummary(
  userId: string,
  characterId: string
): Promise<ResolvedData> {
  try {
    let characterData: Character | null = null;

    if (isMockMode()) {
      // Use mock service in mock mode
      characterData = await getCharacterById(userId, characterId);
    } else {
      // Use Firebase in production mode
      const characterRef = doc(db, "users", userId, "characters", characterId);
      const characterDoc = await getDoc(characterRef);

      if (characterDoc.exists()) {
        characterData = characterDoc.data() as Character;
      }
    }

    if (characterData) {
      return {
        characterName: characterData.name || characterId,
        avatar: characterData.avatar,
        race: characterData.race,
        class: characterData.class,
        level: characterData.level,
        hasTurnUndead: hasTurnUndeadAbility(characterData),
      };
    } else {
      // Fallback for missing characters
      return {
        characterName: characterId,
      };
    }
  } catch (error) {
    logger.warn(
      `Failed to fetch character data for ${userId}/${characterId}:`,
      error
    );
    // Fallback on error
    return {
      characterName: characterId,
    };
  }
}

/**
 * TanStack Query replacement for useDataResolver
 * Uses useQueries for batch character data resolution with proper caching
 */
export function useDataResolver(requests: DataRequest[] = []) {
  const queries = useQueries({
    queries: requests.map(({ userId, characterId }) => ({
      queryKey: queryKeys.characters.summary(userId, characterId),
      queryFn: () => getCharacterSummary(userId, characterId),
      staleTime: 2 * 60 * 1000, // Character summary data is relatively stable
      enabled: !!(userId && characterId),
      retry: (failureCount: number, error: unknown) => {
        // Don't retry on permission errors
        if (error instanceof Error && error.message.includes("permission")) {
          return false;
        }
        return failureCount < 3;
      },
    })),
  });

  // Create lookup map for O(1) access instead of O(n) linear search
  const dataMap = useMemo(() => {
    const map = new Map<string, ResolvedData | undefined>();
    requests.forEach((req, index) => {
      const key = `${req.userId}:${req.characterId}`;
      map.set(key, queries[index]?.data);
    });
    return map;
  }, [requests, queries]);

  // Helper to get resolved data by userId/characterId
  const getResolvedData = (
    userId: string,
    characterId: string
  ): ResolvedData | undefined => {
    const key = `${userId}:${characterId}`;
    return dataMap.get(key);
  };

  // Check if any queries are loading
  const isLoading = queries.some((query) => query.isLoading);

  // Check if any queries have errors
  const hasError = queries.some((query) => query.error);

  return {
    queries,
    getResolvedData,
    isLoading,
    hasError,
  };
}

export type { DataRequest, ResolvedData };
