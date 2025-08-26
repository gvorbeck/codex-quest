import { Route, Switch } from "wouter";
import { Suspense, lazy } from "react";
import { Link } from "wouter";
import { 
  CharGenErrorBoundary, 
  CharacterSheetErrorBoundary,
  GameGenErrorBoundary,
  GameSheetErrorBoundary,
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
            <CharacterSheetErrorBoundary>
              <CharacterSheet />
            </CharacterSheetErrorBoundary>
          </Route>
          <Route path="/u/:userId/g/:gameId">
            <GameSheetErrorBoundary>
              <GameSheet />
            </GameSheetErrorBoundary>
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