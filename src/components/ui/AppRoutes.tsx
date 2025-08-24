import { Route, Switch } from "wouter";
import { Suspense, lazy } from "react";
import { Link } from "wouter";
import { 
  CharGenErrorBoundary, 
  CharacterSheetErrorBoundary, 
  HomeErrorBoundary 
} from "@/components/ui/feedback";
import { DOM_IDS } from "@/constants/dom";

const Home = lazy(() => import("../pages/Home"));
const CharGen = lazy(() => import("../pages/CharGen"));
const CharacterSheet = lazy(() => import("../pages/CharacterSheet"));

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
            className="text-center py-8"
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
          <Route path="/u/:userId/c/:characterId">
            <CharacterSheetErrorBoundary>
              <CharacterSheet />
            </CharacterSheetErrorBoundary>
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