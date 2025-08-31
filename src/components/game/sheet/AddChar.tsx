import { memo, useState, useCallback } from "react";
import { TextInput } from "@/components/ui/inputs";
import { Button } from "@/components/ui/inputs";
import { SectionWrapper } from "@/components/ui/layout";
import { GAME_SHEET_STYLES } from "@/constants/gameSheetStyles";
import type { GamePlayer } from "@/types/game";

// Enhanced error messages for better user experience
const ERROR_MESSAGES = {
  EMPTY_URL: "Please enter a character URL",
  INVALID_FORMAT:
    "Invalid character URL. Expected format: http://codex.quest/u/{userId}/c/{characterId}",
  DUPLICATE_CHARACTER: "This character is already added to the game",
  NETWORK_ERROR:
    "Failed to add character. Please check your connection and try again.",
  GENERIC_ERROR: "Failed to add character. Please try again.",
} as const;

interface AddCharProps {
  onAddPlayer: (player: GamePlayer) => void;
  className?: string;
  disabled?: boolean;
  existingPlayers?: GamePlayer[]; // Add support for duplicate detection
}

export const AddChar = memo(
  ({
    onAddPlayer,
    className = "",
    disabled = false,
    existingPlayers = [],
  }: AddCharProps) => {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Check if character is already in the game
    const isCharacterDuplicate = useCallback(
      (userId: string, characterId: string): boolean => {
        return existingPlayers.some(
          (player) => player.user === userId && player.character === characterId
        );
      },
      [existingPlayers]
    );

    // Parse codex.quest character URL to extract userId and characterId
    const parseCharacterUrl = useCallback(
      (url: string): { userId: string; characterId: string } | null => {
        try {
          // More flexible pattern to handle trailing slashes, query params, fragments, etc.
          // Expected format: http://codex.quest/u/{userId}/c/{characterId}
          // or https://codex.quest/u/{userId}/c/{characterId}
          const urlPattern =
            /^https?:\/\/codex\.quest\/u\/([^/?#]+)\/c\/([^/?#]+)(?:[/?#].*)?$/;
          const normalizedUrl = url.trim().replace(/\/+$/, ""); // Remove trailing slashes
          const match = normalizedUrl.match(urlPattern);

          if (match && match[1] && match[2]) {
            return {
              userId: decodeURIComponent(match[1]), // Handle encoded characters
              characterId: decodeURIComponent(match[2]),
            };
          }

          return null;
        } catch {
          return null;
        }
      },
      []
    );

    const handleAddCharacter = useCallback(async () => {
      if (!url.trim()) {
        setError(ERROR_MESSAGES.EMPTY_URL);
        return;
      }

      const parsed = parseCharacterUrl(url);
      if (!parsed) {
        setError(ERROR_MESSAGES.INVALID_FORMAT);
        return;
      }

      // Check for duplicate character
      if (isCharacterDuplicate(parsed.userId, parsed.characterId)) {
        setError(ERROR_MESSAGES.DUPLICATE_CHARACTER);
        return;
      }

      setIsLoading(true);
      setError("");

      // Create a GamePlayer object with the parsed IDs
      const newPlayer: GamePlayer = {
        user: parsed.userId,
        character: parsed.characterId,
      };

      // Call the parent handler to add the player
      onAddPlayer(newPlayer);

      // Clear the input on success
      setUrl("");
      setIsLoading(false);
    }, [url, parseCharacterUrl, onAddPlayer, isCharacterDuplicate]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !disabled && !isLoading) {
          event.preventDefault();
          handleAddCharacter();
        }
      },
      [handleAddCharacter, disabled, isLoading]
    );

    return (
      <SectionWrapper title="Add Character" className={className}>
        <div className="p-4 space-y-3">
          {/* Horizontal layout for input and button */}
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <TextInput
                type="url"
                value={url}
                onChange={setUrl}
                onKeyDown={handleKeyDown}
                placeholder="Enter character URL (e.g., http://codex.quest/u/.../c/...)"
                disabled={disabled || isLoading}
                error={!!error}
                aria-label="Character URL"
                {...(error && { "aria-describedby": "add-char-error" })}
              />
            </div>

            <Button
              onClick={handleAddCharacter}
              disabled={disabled || isLoading || !url.trim()}
              loading={isLoading}
              loadingText="Adding..."
              variant="primary"
              size="md"
              className="flex-shrink-0"
            >
              Add Character
            </Button>
          </div>

          {/* Error message below the input/button row */}
          {error && (
            <div
              id="add-char-error"
              className={`text-sm ${GAME_SHEET_STYLES.colors.text.error}`}
              role="alert"
            >
              {error}
            </div>
          )}
        </div>
      </SectionWrapper>
    );
  }
);

AddChar.displayName = "AddChar";
