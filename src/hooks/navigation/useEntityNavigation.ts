import { useCallback } from "react";
import { useLocation } from "wouter";
import { STORAGE_KEYS } from "@/constants";

interface EntityNavigationConfig {
  /** Storage keys to clear after successful creation */
  storageKeysToClear: string[];
  /** Function to generate the route path after creation */
  getRoutePath: (userId: string, entityId: string) => string;
}

/**
 * Hook to handle navigation after entity creation (character, game, etc.)
 * Provides consistent behavior for clearing storage and navigating to entity sheets
 */
export function useEntityNavigation(config: EntityNavigationConfig) {
  const [, setLocation] = useLocation();

  const navigateToEntity = useCallback(
    (userId: string, entityId: string) => {
      // Clear localStorage data for fresh start
      config.storageKeysToClear.forEach((key) => {
        localStorage.removeItem(key);
      });

      // Navigate to the entity sheet
      const routePath = config.getRoutePath(userId, entityId);
      setLocation(routePath);
    },
    [config, setLocation]
  );

  const navigateHome = useCallback(
    (clearStorageOnly = false) => {
      // Clear localStorage data for fresh start
      if (clearStorageOnly) {
        config.storageKeysToClear.forEach((key) => {
          localStorage.removeItem(key);
        });
      }

      // Navigate to home
      setLocation("/");
    },
    [config, setLocation]
  );

  return { navigateToEntity, navigateHome };
}

/**
 * Pre-configured hook for character creation navigation
 */
export function useCharacterNavigation() {
  return useEntityNavigation({
    storageKeysToClear: [
      STORAGE_KEYS.NEW_CHARACTER,
      STORAGE_KEYS.INCLUDE_SUPPLEMENTAL_RACE,
      STORAGE_KEYS.INCLUDE_SUPPLEMENTAL_CLASS,
      STORAGE_KEYS.USE_COMBINATION_CLASS,
    ],
    getRoutePath: (userId, characterId) => `/u/${userId}/c/${characterId}`,
  });
}

/**
 * Pre-configured hook for game creation navigation
 */
export function useGameNavigation() {
  return useEntityNavigation({
    storageKeysToClear: [STORAGE_KEYS.DRAFT_GAME],
    getRoutePath: (userId, gameId) => `/u/${userId}/g/${gameId}`,
  });
}
