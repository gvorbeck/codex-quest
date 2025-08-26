import { Route, Switch } from "wouter";
import { Suspense, lazy } from "react";
import { Link } from "wouter";
import { 
  CharGenErrorBoundary, 
  SheetErrorBoundary,
  GameGenErrorBoundary,
  HomeErrorBoundary 
} from "@/components/ui/feedback";
import { DOM_IDS } from "@/constants/dom";

const Home = lazy(() => import("../pages/Home"));
const CharGen = lazy(() => import("../pages/CharGen"));
const GameGen = lazy(() => import("../pages/GameGen"));
const CharacterSheet = lazy(() => import("../pages/CharacterSheet"));
const GameSheet = lazy(() => import("../pages/GameSheet"));

export function AppRoutes() {
  return (
    <main
      role="main"
      id={DOM_IDS.MAIN_CONTENT}
      className="flex-1 max-w-7xl mx-auto w-full px-4 py-8"
    >
      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            className="status-message"
          >
            <p className="text-primary-400">Loading...</p>
          </div>
        }
      >
        <Switch>
          <Route path="/">
            <HomeErrorBoundary>
              <Home />
            </HomeErrorBoundary>
          </Route>
          <Route path="/new-character">
            <CharGenErrorBoundary>
              <CharGen />
            </CharGenErrorBoundary>
          </Route>
          <Route path="/new-game">
            <GameGenErrorBoundary>
              <GameGen />
            </GameGenErrorBoundary>
          </Route>
          <Route path="/u/:userId/c/:characterId">
            <SheetErrorBoundary entityType="Character Sheet" entityContext="character">
              <CharacterSheet />
            </SheetErrorBoundary>
          </Route>
          <Route path="/u/:userId/g/:gameId">
            <SheetErrorBoundary entityType="Game Sheet" entityContext="game">
              <GameSheet />
            </SheetErrorBoundary>
          </Route>

          <Route>
            <section className="text-center py-16">
              <h2 className="text-xl font-semibold text-primary-200 mb-4">
                Page Not Found
              </h2>
              <p className="text-primary-400 mb-6">
                Sorry, the page you're looking for doesn't exist.
              </p>
              <Link
                href="/"
                className="text-highlight hover:text-highlight-hover transition-colors"
              >
                Return to homepage
              </Link>
            </section>
          </Route>
        </Switch>
      </Suspense>
    </main>
  );
}