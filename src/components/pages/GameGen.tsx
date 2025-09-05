import { useState, useCallback } from "react";
import { PageWrapper } from "@/components/ui/layout";
import { Card, Typography, Button } from "@/components/ui";
import { TextInput, TextArea, FormField } from "@/components/ui/inputs";
import { Breadcrumb } from "@/components/ui/display";
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
            <FormField label="Game Name" required>
              <TextInput
                value={game.name}
                onChange={handleNameChange}
                placeholder="Enter your game name..."
                size="md"
              />
            </FormField>

            {/* Game Notes */}
            <FormField label="Notes (Optional)">
              <TextArea
                value={game.notes}
                onChange={handleNotesChange}
                placeholder="Add any notes about your game session..."
                rows={4}
                size="md"
              />
            </FormField>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="md"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
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
