import { useMemo } from "react";
import { useDataResolver } from "../queries/useDataResolver";
import type { CharacterListItem } from "@/services";
import type { Game } from "@/types";
import { logger } from "@/utils";

interface UsePlayerCharactersReturn {
  playerCharacters: CharacterListItem[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch player character data for a game
 * Uses TanStack Query-based useDataResolver for caching and batch fetching
 */
export const usePlayerCharacters = (game: Game): UsePlayerCharactersReturn => {
  // Prepare data requests for all players
  const playerRequests =
    game?.players?.map((player) => ({
      userId: player.user,
      characterId: player.character,
    })) || [];

  // Use TanStack Query to resolve player data
  const { getResolvedData, isLoading, hasError } =
    useDataResolver(playerRequests);

  // Transform resolved data to match CharacterListItem interface
  const playerCharacters = useMemo(() => {
    if (!game?.players?.length) return [];

    const characters: CharacterListItem[] = game.players.map((player) => {
      const resolved = getResolvedData(player.user, player.character);

      const character: CharacterListItem = {
        id: player.character,
        name: resolved?.characterName || player.character,
      };

      // Only add properties if they exist to avoid undefined values
      if (resolved?.race) {
        character.race = resolved.race;
      }
      if (resolved?.class) {
        character.class = resolved.class;
      }
      if (resolved?.level) {
        character.level = resolved.level;
      }

      // Add any additional properties that might exist in resolved data
      if (resolved) {
        Object.keys(resolved).forEach((key) => {
          if (!["characterName", "race", "class", "level"].includes(key)) {
            character[key] = resolved[key as keyof typeof resolved];
          }
        });
      }

      return character;
    });

    logger.debug("Generated player characters from resolved data", {
      gameId: game.name || "unnamed-game",
      playerCount: game.players.length,
      resolvedCharacterCount: characters.length,
    });

    return characters;
  }, [game?.players, game?.name, getResolvedData]);

  return {
    playerCharacters,
    loading: isLoading,
    error: hasError ? "Failed to load player character data" : null,
  };
};
