import { useState, useEffect } from "react";
import { getCharacterById, type CharacterListItem } from "@/services/characters";
import type { Game } from "@/types/game";
import { logger } from "@/utils/logger";

interface UsePlayerCharactersReturn {
  playerCharacters: CharacterListItem[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch player character data for a game
 * Handles loading states and error management
 */
export const usePlayerCharacters = (game: Game): UsePlayerCharactersReturn => {
  const [playerCharacters, setPlayerCharacters] = useState<CharacterListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerCharacters = async () => {
      if (!game?.players?.length) {
        setPlayerCharacters([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const characterPromises = game.players.map(player => 
          getCharacterById(player.user, player.character)
        );
        
        const characterResults = await Promise.all(characterPromises);
        const validCharacters = characterResults
          .filter((char): char is NonNullable<typeof char> => char !== null);
        
        setPlayerCharacters(validCharacters);
        
        logger.debug("Successfully fetched player characters", {
          gameId: game.name || 'unnamed-game',
          playerCount: game.players.length,
          validCharacterCount: validCharacters.length
        });
      } catch (err) {
        const errorMessage = `Failed to fetch player characters: ${err instanceof Error ? err.message : 'Unknown error'}`;
        logger.error("Error fetching player characters", {
          error: err,
          gameId: game.name || 'unnamed-game',
          playerCount: game.players?.length
        });
        setError(errorMessage);
        console.error(errorMessage, err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerCharacters();
  }, [game?.players, game?.name]);

  return { playerCharacters, loading, error };
};