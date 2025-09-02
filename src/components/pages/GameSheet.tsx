import { useRoute } from "wouter";
import { useMemo, useCallback, useState } from "react";
import { Breadcrumb, Icon } from "@/components/ui/display";
import { Button } from "@/components/ui/inputs";
import { PageWrapper } from "@/components/ui/layout";
import { LoadingState } from "@/components/ui/feedback";
import { Typography } from "@/components/ui/design-system";
import {
  Hero,
  PlayersSection,
  GameNotesSection,
  GameSheetEmptyState,
  AddChar,
  GMBinder,
} from "@/components/game/sheet";
import { TreasureGeneratorModal, CombatTrackerModal } from "@/components/modals";
import { useFirebaseSheet } from "@/hooks/useFirebaseSheet";
import { useDiceRoller } from "@/hooks/useDiceRoller";
import { logger } from "@/utils/logger";
import {
  GAME_SHEET_STYLES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
} from "@/constants/gameSheetStyles";
import type { Game, GamePlayer } from "@/types/game";

export default function GameSheet() {
  const [, params] = useRoute("/u/:userId/g/:gameId");
  const [isTreasureModalOpen, setIsTreasureModalOpen] = useState(false);
  const [isCombatTrackerModalOpen, setIsCombatTrackerModalOpen] = useState(false);

  // Use the generic Firebase sheet hook
  const {
    data: game,
    loading,
    error,
    isOwner: isGameMaster,
    isUpdating,
    updateEntity: updateGame,
    clearError,
  } = useFirebaseSheet<Game>({
    userId: params?.userId,
    entityId: params?.gameId,
    collection: "GAMES",
  });

  // Use the dice roller hook
  const { DiceRollerFAB, DiceRollerModal } = useDiceRoller();

  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: game?.name || "Game", current: true },
    ],
    [game?.name]
  );

  // Handle game changes using the generic update function
  const handleGameChange = useCallback(
    async (updatedGame: Game) => {
      await updateGame(updatedGame);
    },
    [updateGame]
  );

  // Handle notes changes
  const handleNotesChange = useCallback(
    (notes: string) => {
      if (!game) return;

      const updatedGame = {
        ...game,
        notes,
      };

      handleGameChange(updatedGame);
    },
    [game, handleGameChange]
  );

  // Handle adding players to the game
  const handleAddPlayer = useCallback(
    (newPlayer: GamePlayer) => {
      if (!game) return;

      const updatedPlayers = [...(game.players || []), newPlayer];
      const updatedGame = {
        ...game,
        players: updatedPlayers,
      };

      handleGameChange(updatedGame);
    },
    [game, handleGameChange]
  );

  // Handle removing players from the game
  const handleDeletePlayer = useCallback(
    (playerToDelete: GamePlayer) => {
      if (!game) return;

      const updatedPlayers = (game.players || []).filter(
        (player) =>
          player.user !== playerToDelete.user ||
          player.character !== playerToDelete.character
      );

      const updatedGame = {
        ...game,
        players: updatedPlayers,
      };

      handleGameChange(updatedGame);
    },
    [game, handleGameChange]
  );

  // Handle treasure generator modal
  const handleTreasureGenerate = useCallback(() => {
    setIsTreasureModalOpen(true);
  }, []);

  const handleTreasureModalClose = useCallback(() => {
    setIsTreasureModalOpen(false);
  }, []);

  // Handle combat tracker modal
  const handleCombatTrackerOpen = useCallback(() => {
    setIsCombatTrackerModalOpen(true);
  }, []);

  const handleCombatTrackerModalClose = useCallback(() => {
    setIsCombatTrackerModalOpen(false);
  }, []);

  // Data loading is now handled by useFirebaseSheet hook

  // Memoized content check for empty state
  const hasContent = useMemo(() => {
    if (!game) return false;
    return (
      (game.players && game.players.length > 0) ||
      (game.notes && game.notes.trim().length > 0)
    );
  }, [game]);

  if (loading) {
    return <LoadingState message={LOADING_MESSAGES.loadingGame} />;
  }

  if (error) {
    return (
      <div className={GAME_SHEET_STYLES.layout.statusMessage} role="alert">
        <div className="flex items-center justify-between">
          <Typography variant="body" color="secondary">
            Error: {error}
          </Typography>
          <Button
            onClick={clearError}
            variant="ghost"
            size="sm"
            aria-label="Dismiss error"
            className="ml-4"
          >
            <Icon name="close" size="sm" />
          </Button>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className={GAME_SHEET_STYLES.layout.statusMessage}>
        <Typography variant="body" color="muted">
          {ERROR_MESSAGES.gameNotFound}
        </Typography>
      </div>
    );
  }

  if (import.meta.env.MODE === "development") {
    logger.debug(
      `🎲 GAME SHEET DEBUG | ${game.name?.toUpperCase() || "UNNAMED GAME"}`,
      game
    );
  }

  return (
    <>
      <PageWrapper>
        <header className="mb-8">
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
        </header>

        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className={GAME_SHEET_STYLES.accessibility.skipLink}
        >
          Skip to main content
        </a>

        {/* Hero section with game info */}
        <Hero
          game={game}
          className={GAME_SHEET_STYLES.spacing.section}
          editable={!!isGameMaster}
          onGameChange={handleGameChange}
          onTreasureGenerate={handleTreasureGenerate}
          onCombatTrackerOpen={handleCombatTrackerOpen}
        />

        {/* Game Sheet Content */}
        <main id="main-content" className={GAME_SHEET_STYLES.spacing.content}>
          <PlayersSection
            players={game.players || []}
            showDivider={false}
            {...(isGameMaster && { onDeletePlayer: handleDeletePlayer })}
          />

          {/* Add Character section - only show for game master */}
          {isGameMaster && (
            <div className={GAME_SHEET_STYLES.spacing.section}>
              <AddChar
                onAddPlayer={handleAddPlayer}
                disabled={isUpdating}
                existingPlayers={game.players || []}
              />
            </div>
          )}

          {/* GM Binder section - only show for game master */}
          {isGameMaster && <GMBinder game={game} />}

          <GameNotesSection
            notes={game.notes || ""}
            showDivider={
              !!(game.players && game.players.length > 0) || !!isGameMaster
            }
            editable={!!isGameMaster}
            onNotesChange={handleNotesChange}
          />

          {/* Empty state when no content */}
          {!hasContent && <GameSheetEmptyState gameName={game.name} />}
        </main>

        {/* Dice Roller Modal */}
        <DiceRollerModal />

        {/* Treasure Generator Modal */}
        <TreasureGeneratorModal
          isOpen={isTreasureModalOpen}
          onClose={handleTreasureModalClose}
        />

        {/* Combat Tracker Modal */}
        <CombatTrackerModal
          isOpen={isCombatTrackerModalOpen}
          onClose={handleCombatTrackerModalClose}
          game={game}
          onUpdateGame={handleGameChange}
        />
      </PageWrapper>

      {/* Update loading indicator */}
      {isUpdating && (
        <LoadingState
          message={LOADING_MESSAGES.updatingGame}
          variant="overlay"
        />
      )}

      {/* Dice Roller FAB */}
      <DiceRollerFAB disabled={isUpdating} />
    </>
  );
}
