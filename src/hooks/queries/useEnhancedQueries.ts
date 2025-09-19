import { useQuery } from "@tanstack/react-query";
import { useNotificationContext } from "@/hooks";
import { createMutationHandlers } from "@/lib/globalErrorHandler";
import { queryKeys } from "@/lib/queryKeys";
import { useAuth } from "@/hooks";
import { useEffect } from "react";
import {
  getUserCharacters,
  getCharacterById,
  getUserGames,
  getGameById,
} from "@/services";
import type { Character, Game } from "@/types";
import type { CharacterListItem } from "@/services/characters";

/**
 * Enhanced characters query with consistent error handling
 */
export function useEnhancedCharacters() {
  const { user } = useAuth();
  const notifications = useNotificationContext();
  const { queryError } = createMutationHandlers(notifications);

  const query = useQuery<CharacterListItem[]>({
    queryKey: queryKeys.characters.user(user?.uid || ""),
    queryFn: () => getUserCharacters(user!),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (query.error) {
      queryError(query.error, { entityType: "characters" });
    }
  }, [query.error, queryError]);

  return query;
}

/**
 * Enhanced character sheet query with consistent error handling
 */
export function useEnhancedCharacterSheet(userId: string, characterId: string) {
  const { user } = useAuth();
  const notifications = useNotificationContext();
  const { queryError } = createMutationHandlers(notifications);

  const isOwner = Boolean(user && userId === user.uid);

  const query = useQuery({
    queryKey: queryKeys.characters.detail(userId, characterId),
    queryFn: () => getCharacterById(userId, characterId),
    enabled: !!userId && !!characterId,
    staleTime: 30 * 1000, // 30 seconds
    select: (data: Character | null) => ({
      character: data,
      isOwner,
    }),
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (query.error) {
      queryError(query.error, { entityType: "character" });
    }
  }, [query.error, queryError]);

  return query;
}

/**
 * Enhanced games query with consistent error handling
 */
export function useEnhancedGames() {
  const { user } = useAuth();
  const notifications = useNotificationContext();
  const { queryError } = createMutationHandlers(notifications);

  const query = useQuery<Game[]>({
    queryKey: queryKeys.games.user(user?.uid || ""),
    queryFn: () => getUserGames(user!),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (query.error) {
      queryError(query.error, { entityType: "games" });
    }
  }, [query.error, queryError]);

  return query;
}

/**
 * Enhanced game query with consistent error handling
 */
export function useEnhancedGame(userId: string, gameId: string) {
  const { user } = useAuth();
  const notifications = useNotificationContext();
  const { queryError } = createMutationHandlers(notifications);

  const isOwner = Boolean(user && userId === user.uid);

  const query = useQuery({
    queryKey: queryKeys.games.detail(userId, gameId),
    queryFn: () => getGameById(userId, gameId),
    enabled: !!userId && !!gameId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data: Game | null) => ({
      game: data,
      isOwner,
    }),
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (query.error) {
      queryError(query.error, { entityType: "game" });
    }
  }, [query.error, queryError]);

  return query;
}