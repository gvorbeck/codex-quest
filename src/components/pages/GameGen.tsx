import { useState, useCallback } from "react";
import { PageWrapper } from "@/components/ui/layout";
import { Card, Typography, Button } from "@/components/ui";
import { TextInput, TextArea } from "@/components/ui/inputs";
import { Breadcrumb, TextHeader } from "@/components/ui/display";
import { useAuth } from "@/hooks";
import { useGameNavigation } from "@/hooks/useEntityNavigation";
import { logger } from "@/utils/logger";
import { saveGame } from "@/services/games";

interface DraftGame {
  name: string;
  notes: string;
  combatants: never[];
  players: never[];
}

const emptyGame: DraftGame = {
  name: "",
  notes: "",
  combatants: [],
  players: [],
};

function GameGen() {
  const { user } = useAuth();
  const { navigateToEntity, navigateHome } = useGameNavigation();
  const [game, setGame] = useState<DraftGame>(emptyGame);
  const [isSaving, setIsSaving] = useState(false);

  const handleNameChange = useCallback((name: string) => {
    setGame((prev) => ({ ...prev, name }));
  }, []);

  const handleNotesChange = useCallback((notes: string) => {
    setGame((prev) => ({ ...prev, notes }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!user || !game.name.trim()) return;

    setIsSaving(true);
    try {
      // Save game to Firebase
      const gameId = await saveGame(user.uid, {
        name: game.name,
        notes: game.notes,
        combatants: game.combatants,
        players: game.players,
      });

      // Navigate to the newly created game sheet and clean up storage
      navigateToEntity(user.uid, gameId);
    } catch (error) {
      logger.error("Error saving game:", error);
    } finally {
      setIsSaving(false);
    }
  }, [user, game, navigateToEntity]);

  const handleCancel = useCallback(() => {
    // Clear any draft data and navigate to home
    navigateHome(true);
  }, [navigateHome]);

  const isValidGame = game.name.trim().length > 0;

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "New Game", href: "/new-game" },
          ]}
        />

        {/* Header */}
        <header className="text-center space-y-4">
          <Typography variant="h1">Create New Game</Typography>
          <Typography variant="body" color="secondary" className="text-lg">
            Set up a new Basic Fantasy RPG game session for your players.
          </Typography>
        </header>

        {/* Game Creation Form */}
        <Card variant="standard" className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <Typography variant="h3">Game Details</Typography>

            {/* Game Name */}
            <div className="space-y-2">
              <label
                htmlFor="game-name"
                className="block text-sm font-medium text-primary-300"
              >
                Game Name *
              </label>
              <TextInput
                id="game-name"
                value={game.name}
                onChange={handleNameChange}
                placeholder="Enter your game name..."
                size="md"
              />
            </div>

            {/* Game Notes */}
            <div className="space-y-2">
              <label
                htmlFor="game-notes"
                className="block text-sm font-medium text-primary-300"
              >
                Notes (Optional)
              </label>
              <TextArea
                id="game-notes"
                value={game.notes}
                onChange={handleNotesChange}
                placeholder="Add any notes about your game session..."
                rows={4}
                size="md"
              />
            </div>

            {/* Placeholder for future features */}
            <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-600">
              <TextHeader
                variant="h4"
                size="md"
                underlined={false}
                className="mb-2"
              >
                Coming Soon
              </TextHeader>
              <Typography variant="body" color="secondary" className="text-sm">
                Additional game setup features will be added here:
              </Typography>
              <ul className="mt-2 text-sm text-primary-300 space-y-1">
                <li>• Player management</li>
                <li>• Combat tracker setup</li>
                <li>• Initiative management</li>
                <li>• Campaign settings</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            disabled={!isValidGame || isSaving}
            loading={isSaving}
            loadingText="Creating Game..."
          >
            Create Game
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

export default GameGen;
