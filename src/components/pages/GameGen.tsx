import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { PageWrapper } from "@/components/ui/layout";
import { Card, Typography, Button } from "@/components/ui";
import { Breadcrumb } from "@/components/ui/display";
import { useAuth } from "@/hooks";
import { logger } from "@/utils/logger";
import { STORAGE_KEYS } from "@/constants/storage";

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
  const [, setLocation] = useLocation();
  const { user } = useAuth();
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
      // TODO: Implement game saving service
      logger.debug("Saving game:", game);

      // Clear localStorage draft
      localStorage.removeItem(STORAGE_KEYS.DRAFT_GAME);

      // Navigate to home
      setLocation("/");
    } catch (error) {
      logger.error("Error saving game:", error);
    } finally {
      setIsSaving(false);
    }
  }, [user, game, setLocation]);

  const handleCancel = useCallback(() => {
    // Clear any draft data
    localStorage.removeItem(STORAGE_KEYS.DRAFT_GAME);
    setLocation("/");
  }, [setLocation]);

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
              <input
                id="game-name"
                type="text"
                value={game.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter your game name..."
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-primary-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
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
              <textarea
                id="game-notes"
                value={game.notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Add any notes about your game session..."
                rows={4}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-primary-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-vertical"
              />
            </div>

            {/* Placeholder for future features */}
            <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-600">
              <Typography variant="h4" className="mb-2">
                Coming Soon
              </Typography>
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
