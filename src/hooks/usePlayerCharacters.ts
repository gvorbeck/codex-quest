import { useState, useEffect, useMemo } from "react";
import { useDataResolver } from "./useDataResolver";
import type { CharacterListItem } from "@/services/characters";
import type { Game } from "@/types";
import { logger } from "@/utils";

interface UsePlayerCharactersReturn {
  playerCharacters: CharacterListItem[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch player character data for a game
 * Uses useDataResolver internally to leverage caching and batch fetching
 */
export const usePlayerCharacters = (game: Game): UsePlayerCharactersReturn => {
  const [error, setError] = useState<string | null>(null);

  // Use the data resolver with real-time updates for active game sessions
  const { resolveMultiple, getResolvedData, isLoading } = useDataResolver({
    enableRealTime: true,
  });

  // Resolve player data when players change
  useEffect(() => {
    if (game?.players?.length) {
      const playerData = game.players.map((player) => ({
        userId: player.user,
        characterId: player.character,
      }));
      resolveMultiple(playerData);
      setError(null); // Clear any previous errors
    }
  }, [game?.players, resolveMultiple]);

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
          if (!['characterName', 'race', 'class', 'level'].includes(key)) {
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
    error
  };
};
