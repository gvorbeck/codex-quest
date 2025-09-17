import { useRoute } from "wouter";
import { useMemo, useCallback, useState, Suspense } from "react";
import { Breadcrumb } from "@/components/ui/composite";
import { PageWrapper } from "@/components/ui/core/layout";
import { LoadingState } from "@/components/ui/core/feedback";
import { Typography } from "@/components/ui/core/display";
import GameHero from "@/components/features/game/sheet/Hero";
import { PlayersSection } from "@/components/features/game/sheet/PlayersSection";
import { GameNotesSection } from "@/components/features/game/sheet/GameNotesSection";
import { GameSheetEmptyState } from "@/components/features/game/sheet/GameSheetEmptyState";
import { AddChar } from "@/components/features/game/sheet/AddChar";
import { GMBinder } from "@/components/features/game/sheet/GMBinder";
import {
  TreasureGeneratorModal,
  CombatTrackerModal,
  EncounterGeneratorModal,
} from "@/components/modals/LazyModals";
import { useGame } from "@/hooks";
import { useDiceRoller } from "@/hooks/useDiceRoller";
import { useNotifications } from "@/hooks/useNotifications";
import { logger } from "@/utils";
import {
  GAME_SHEET_STYLES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
} from "@/constants";
import type { Game, GamePlayer, GameCombatant } from "@/types";

export default function GameSheet() {
  const [, params] = useRoute("/u/:userId/g/:gameId");
  const [isTreasureModalOpen, setIsTreasureModalOpen] = useState(false);
  const [isCombatTrackerModalOpen, setIsCombatTrackerModalOpen] =
    useState(false);
  const [isEncounterGeneratorModalOpen, setIsEncounterGeneratorModalOpen] =
    useState(false);

  // Use TanStack Query game hook
  const {
    data: game,
    isLoading: loading,
    error,
    isOwner: isGameMaster,
    isUpdating,
    updateGame,
  } = useGame(params?.userId, params?.gameId);

  // Use the dice roller hook
  const { DiceRollerFAB, DiceRollerModal } = useDiceRoller();

  // Use notifications
  const { showSuccess } = useNotifications();

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

  // Handle encounter generator modal
  const handleEncounterGeneratorOpen = useCallback(() => {
    setIsEncounterGeneratorModalOpen(true);
  }, []);

  const handleEncounterGeneratorModalClose = useCallback(() => {
    setIsEncounterGeneratorModalOpen(false);
  }, []);

  // Handle adding combatants to the game
  const handleAddToCombat = useCallback(
    (newCombatant: GameCombatant) => {
      if (!game) return;

      const updatedCombatants = [...(game.combatants || []), newCombatant];
      const updatedGame = {
        ...game,
        combatants: updatedCombatants,
      };

      handleGameChange(updatedGame);

      // Show success notification
      showSuccess(`${newCombatant.name} added to Combat Tracker`, {
        title: "Monster Added",
      });
    },
    [game, handleGameChange, showSuccess]
  );

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
        <Typography variant="body" color="secondary">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load game"}
        </Typography>
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
        <GameHero
          game={game}
          className={GAME_SHEET_STYLES.spacing.section}
          editable={!!isGameMaster}
          onGameChange={handleGameChange}
          onTreasureGenerate={handleTreasureGenerate}
          onCombatTrackerOpen={handleCombatTrackerOpen}
          onEncounterGeneratorOpen={handleEncounterGeneratorOpen}
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
          {isGameMaster && (
            <GMBinder game={game} onAddToCombat={handleAddToCombat} />
          )}

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

        {/* Lazy-loaded Modals with Suspense */}
        <Suspense
          fallback={<LoadingState message="Loading treasure generator..." />}
        >
          <TreasureGeneratorModal
            isOpen={isTreasureModalOpen}
            onClose={handleTreasureModalClose}
          />
        </Suspense>

        <Suspense
          fallback={<LoadingState message="Loading combat tracker..." />}
        >
          <CombatTrackerModal
            isOpen={isCombatTrackerModalOpen}
            onClose={handleCombatTrackerModalClose}
            game={game}
            onUpdateGame={handleGameChange}
          />
        </Suspense>

        <Suspense
          fallback={<LoadingState message="Loading encounter generator..." />}
        >
          <EncounterGeneratorModal
            isOpen={isEncounterGeneratorModalOpen}
            onClose={handleEncounterGeneratorModalClose}
            onAddToCombat={handleAddToCombat}
            onOpenCombatTracker={handleCombatTrackerOpen}
          />
        </Suspense>
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
