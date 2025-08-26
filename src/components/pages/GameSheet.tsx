import { useRoute } from "wouter";
import { useEffect, useState, useMemo, useCallback } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FIREBASE_COLLECTIONS } from "@/constants/firebase";
import { Breadcrumb } from "@/components/ui/display";
import { PageWrapper } from "@/components/ui/layout";
import { FloatingActionButton } from "@/components/ui/inputs/FloatingActionButton";
import { DiceRollerModal } from "@/components/ui/feedback";
import { 
  Hero, 
  PlayersSection, 
  CombatantsSection, 
  GameNotesSection,
  GameSheetEmptyState,
  GameSheetLoadingState
} from "@/components/game/sheet";
import { useAuth } from "@/hooks/useAuth";
import { GAME_SHEET_STYLES, ERROR_MESSAGES, LOADING_MESSAGES } from "@/constants/gameSheetStyles";
import type { Game } from "@/types/game";

export default function GameSheet() {
  const [, params] = useRoute("/u/:userId/g/:gameId");
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDiceRollerOpen, setIsDiceRollerOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Games", href: "/games" },
      { label: game?.name || "Game", current: true },
    ],
    [game?.name]
  );

  // Check if the current user owns this game
  const isGameMaster = useMemo(() => {
    return user && params?.userId === user.uid;
  }, [user, params?.userId]);

  // Handle game changes
  const handleGameChange = async (updatedGame: Game) => {
    if (!params?.userId || !params?.gameId || !isGameMaster) {
      return;
    }

    const previousGame = game;
    setIsUpdating(true);

    try {
      // Update local state immediately for responsiveness
      setGame(updatedGame);
      
      // Clear any existing errors
      if (error) {
        setError(null);
      }

      // Update Firebase
      const gameRef = doc(
        db,
        FIREBASE_COLLECTIONS.USERS,
        params.userId,
        FIREBASE_COLLECTIONS.GAMES,
        params.gameId
      );

      // Create a clean object without the id field for Firebase
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...gameData } = updatedGame;
      await updateDoc(gameRef, gameData);
    } catch (err) {
      console.error("Error updating game:", err);
      
      // Revert to previous state properly
      setGame(previousGame);
      
      // Show user feedback
      setError(ERROR_MESSAGES.updateError);
      
      // Clear error after delay
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const loadGame = async () => {
      if (!params?.userId || !params?.gameId) {
        setError(ERROR_MESSAGES.invalidUrl);
        setLoading(false);
        return;
      }

      try {
        const gameRef = doc(
          db,
          FIREBASE_COLLECTIONS.USERS,
          params.userId,
          FIREBASE_COLLECTIONS.GAMES,
          params.gameId
        );
        const gameSnap = await getDoc(gameRef);

        if (gameSnap.exists()) {
          const gameData = {
            id: gameSnap.id,
            ...gameSnap.data(),
          } as Game & { id: string };
          setGame(gameData);
        } else {
          setError(ERROR_MESSAGES.gameNotFound);
        }
      } catch (err) {
        console.error("Error loading game:", err);
        setError(ERROR_MESSAGES.loadError);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [params?.userId, params?.gameId]);

  // Memoized content check for empty state
  const hasContent = useMemo(() => {
    if (!game) return false;
    return (
      (game.players && game.players.length > 0) ||
      (game.combatants && game.combatants.length > 0) ||
      (game.notes && game.notes.trim().length > 0)
    );
  }, [game]);

  // Error handler for better UX
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  if (loading) {
    return <GameSheetLoadingState message={LOADING_MESSAGES.loadingGame} />;
  }

  if (error) {
    return (
      <div className={GAME_SHEET_STYLES.layout.statusMessage} role="alert">
        <div className="flex items-center justify-between">
          <p className={GAME_SHEET_STYLES.colors.text.error}>Error: {error}</p>
          <button 
            onClick={clearError}
            className="text-zinc-400 hover:text-zinc-100 ml-4"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className={GAME_SHEET_STYLES.layout.statusMessage}>
        <p className={GAME_SHEET_STYLES.colors.text.loading}>{ERROR_MESSAGES.gameNotFound}</p>
      </div>
    );
  }

  if (import.meta.env.MODE === 'development') {
    console.log(
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
        />

        {/* Game Sheet Content */}
        <main id="main-content" className={GAME_SHEET_STYLES.spacing.content}>
          <PlayersSection 
            players={game.players || []}
            showDivider={false}
          />
          
          <CombatantsSection 
            combatants={game.combatants || []}
            showDivider={!!(game.players && game.players.length > 0)}
          />
          
          <GameNotesSection 
            notes={game.notes || ''}
            showDivider={!!((game.players && game.players.length > 0) || (game.combatants && game.combatants.length > 0))}
          />

          {/* Empty state when no content */}
          {!hasContent && (
            <GameSheetEmptyState gameName={game.name} />
          )}
        </main>

        {/* Dice Roller Modal */}
        <DiceRollerModal
          isOpen={isDiceRollerOpen}
          onClose={() => setIsDiceRollerOpen(false)}
        />
      </PageWrapper>

      {/* Update loading indicator */}
      {isUpdating && (
        <GameSheetLoadingState 
          message={LOADING_MESSAGES.updatingGame} 
          isUpdating={true} 
        />
      )}

      {/* Dice Roller FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <FloatingActionButton
          onClick={() => setIsDiceRollerOpen(true)}
          aria-label="Open dice roller"
          tooltip="Roll Dice"
          variant="primary"
          size="md"
          disabled={isUpdating}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {/* Dice outline */}
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
            {/* Dice dots (5 pattern) */}
            <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/>
            <circle cx="16.5" cy="7.5" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="7.5" cy="16.5" r="1.5" fill="currentColor"/>
            <circle cx="16.5" cy="16.5" r="1.5" fill="currentColor"/>
          </svg>
        </FloatingActionButton>
      </div>
    </>
  );
}