import { useState, useEffect, useRef, useCallback } from "react";
import {
  doc,
  query,
  where,
  getDocs,
  collection,
  documentId,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { logger } from "@/utils/logger";
import { useLoadingState } from "@/hooks/useLoadingState";
import type { Character } from "@/types/character";

interface ResolvedData {
  characterName?: string | undefined;
  avatar?: string | undefined;
}

interface CacheEntry {
  data: ResolvedData;
  timestamp: number;
}

// Global cache to persist across component instances and rerenders
const dataCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Track active listeners for cleanup
const activeListeners = new Map<string, () => void>();

interface UseDataResolverOptions {
  enableRealTime?: boolean; // Enable real-time updates for active game sessions
}

/**
 * Hook to resolve user and character IDs to display names and avatars
 * Uses batch fetching, aggressive caching, and optional real-time updates to minimize Firebase reads
 */
export function useDataResolver(options: UseDataResolverOptions = {}) {
  const [resolvedData, setResolvedData] = useState<Map<string, ResolvedData>>(
    new Map()
  );
  const { loading: isLoading, setLoading } = useLoadingState();
  const mountedRef = useRef(true);
  const { enableRealTime = false } = options;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;

      // Clean up any active listeners when component unmounts
      if (enableRealTime) {
        activeListeners.forEach((unsubscribe) => {
          unsubscribe();
        });
        activeListeners.clear();
      }
    };
  }, [enableRealTime]);

  const getCacheKey = (userId: string, characterId: string) =>
    `${userId}:${characterId}`;

  const isValidCache = (entry: CacheEntry): boolean => {
    return Date.now() - entry.timestamp < CACHE_TTL;
  };

  const fetchCharactersBatch = async (
    userId: string,
    characterIds: string[]
  ): Promise<Map<string, { name: string; avatar?: string }>> => {
    const results = new Map<string, { name: string; avatar?: string }>();

    try {
      if (characterIds.length === 0) return results;

      // Firestore 'in' queries are limited to 10 items, so batch them
      const BATCH_SIZE = 10;
      const batches: string[][] = [];
      for (let i = 0; i < characterIds.length; i += BATCH_SIZE) {
        batches.push(characterIds.slice(i, i + BATCH_SIZE));
      }

      // Process all batches in parallel
      const batchPromises = batches.map(async (batch) => {
        const charactersRef = collection(db, "users", userId, "characters");
        const q = query(charactersRef, where(documentId(), "in", batch));
        const snapshot = await getDocs(q);

        const batchResults = new Map<
          string,
          { name: string; avatar?: string }
        >();
        snapshot.forEach((doc) => {
          const characterData = doc.data() as Character;
          batchResults.set(doc.id, {
            name: characterData.name || doc.id,
            ...(characterData.avatar && { avatar: characterData.avatar }),
          });
        });

        // Add missing characters with fallback names
        batch.forEach((id) => {
          if (!batchResults.has(id)) {
            batchResults.set(id, { name: id });
          }
        });

        return batchResults;
      });

      const batchResults = await Promise.all(batchPromises);

      // Merge all batch results
      batchResults.forEach((batchResult) => {
        batchResult.forEach((data, id) => {
          results.set(id, data);
        });
      });
    } catch (error) {
      logger.warn(`Failed to batch fetch character data for ${userId}:`, error);
      // Fallback: return character IDs as names
      characterIds.forEach((id) => {
        results.set(id, { name: id });
      });
    }

    return results;
  };

  const setupRealTimeListener = useCallback(
    (userId: string, characterId: string) => {
      const cacheKey = getCacheKey(userId, characterId);

      // Don't set up duplicate listeners
      if (activeListeners.has(cacheKey)) {
        return;
      }

      const characterRef = doc(db, "users", userId, "characters", characterId);

      const unsubscribe = onSnapshot(
        characterRef,
        (doc) => {
          if (doc.exists() && mountedRef.current) {
            const characterData = doc.data() as Character;
            const resolved: ResolvedData = {
              characterName: characterData.name || characterId,
              avatar: characterData.avatar || undefined,
            };

            // Update both cache and local state
            dataCache.set(cacheKey, {
              data: resolved,
              timestamp: Date.now(),
            });

            setResolvedData((prev) => {
              const newData = new Map(prev);
              const existingData = newData.get(cacheKey) || {};
              newData.set(cacheKey, { ...existingData, ...resolved });
              return newData;
            });
          }
        },
        (error) => {
          logger.warn(
            `Real-time listener error for ${userId}/${characterId}:`,
            error
          );
        }
      );

      activeListeners.set(cacheKey, unsubscribe);
    },
    []
  );

  const resolveMultiple = useCallback(
    async (playerData: Array<{ userId: string; characterId: string }>) => {
      if (playerData.length === 0) return;

      setLoading(true);

      try {
        // Check cache first and filter out already resolved data
        const uncachedData: Array<{ userId: string; characterId: string }> = [];
        const cachedResults = new Map<string, ResolvedData>();

        playerData.forEach(({ userId, characterId }) => {
          const cacheKey = getCacheKey(userId, characterId);
          const cached = dataCache.get(cacheKey);

          if (cached && isValidCache(cached)) {
            cachedResults.set(cacheKey, cached.data);
          } else {
            uncachedData.push({ userId, characterId });
          }
        });

        if (uncachedData.length === 0) {
          // All data is cached, just update the resolved data state
          if (mountedRef.current) {
            const newResolvedData = new Map(resolvedData);
            cachedResults.forEach((data, key) => {
              newResolvedData.set(key, data);
            });
            setResolvedData(newResolvedData);
          }
          return;
        }

        // Group uncached data by userId for batch fetching
        const userGroups = new Map<string, string[]>();

        uncachedData.forEach(({ userId, characterId }) => {
          if (!userGroups.has(userId)) {
            userGroups.set(userId, []);
          }
          userGroups.get(userId)!.push(characterId);
        });

        // Batch fetch characters only (no user data due to permissions)
        const characterResults = await Promise.all(
          Array.from(userGroups.entries()).map(
            async ([userId, characterIds]) => {
              const characterData = await fetchCharactersBatch(
                userId,
                characterIds
              );
              return { userId, characterData };
            }
          )
        );

        // Create a lookup map for character data
        const characterLookup = new Map<
          string,
          Map<string, { name: string; avatar?: string }>
        >();
        characterResults.forEach(({ userId, characterData }) => {
          characterLookup.set(userId, characterData);
        });

        // Combine the results and cache them
        const newResults = new Map<string, ResolvedData>();

        uncachedData.forEach(({ userId, characterId }) => {
          const cacheKey = getCacheKey(userId, characterId);
          const characterData = characterLookup.get(userId)?.get(characterId);

          const resolved: ResolvedData = {
            characterName: characterData?.name || undefined,
            avatar: characterData?.avatar || undefined,
          };

          // Cache the result
          dataCache.set(cacheKey, {
            data: resolved,
            timestamp: Date.now(),
          });

          newResults.set(cacheKey, resolved);
        });

        // Combine cached and new results
        if (mountedRef.current) {
          const finalResolvedData = new Map(resolvedData);
          cachedResults.forEach((data, key) => {
            finalResolvedData.set(key, data);
          });
          newResults.forEach((data, key) => {
            finalResolvedData.set(key, data);
          });
          setResolvedData(finalResolvedData);
        }

        // Set up real-time listeners if enabled (for active game sessions)
        if (enableRealTime && mountedRef.current) {
          playerData.forEach(({ userId, characterId }) => {
            setupRealTimeListener(userId, characterId);
          });
        }
      } catch (error) {
        logger.error("Error resolving player data:", error);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [enableRealTime, resolvedData, setupRealTimeListener, setLoading]
  );

  const getResolvedData = useCallback(
    (userId: string, characterId: string): ResolvedData | undefined => {
      const cacheKey = getCacheKey(userId, characterId);
      return resolvedData.get(cacheKey);
    },
    [resolvedData]
  );

  return {
    resolveMultiple,
    getResolvedData,
    isLoading,
  };
}
