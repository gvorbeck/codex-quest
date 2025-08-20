import { Link, Route, Switch } from "wouter";
import { Suspense, lazy, useEffect } from "react";
import "./App.css";
import { ErrorBoundary } from "@/components/ui";
import { preloadCriticalData } from "@/services/dataLoader";

// Lazy load page components for better code splitting
const Home = lazy(() => import("./components/pages/Home"));
const CharGen = lazy(() => import("./components/pages/CharGen"));

function App() {
  // Preload critical data for better performance
  useEffect(() => {
    preloadCriticalData().catch((error) => {
      console.warn('Failed to preload critical data:', error);
    });
  }, []);

  return (
    <ErrorBoundary>
      <div className="app dark bg-primary text-primary min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <header role="banner" className="bg-secondary border-b border-theme">
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="max-w-7xl mx-auto px-4 py-4"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-highlight">
                <Link
                  href="/"
                  aria-label="Go to homepage"
                  className="hover:text-highlight-hover transition-colors"
                >
                  Torchlight
                </Link>
              </h1>
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/new-character"
                    className="text-primary-300 hover:text-highlight transition-colors"
                  >
                    Create Character
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <main
          role="main"
          id="main-content"
          className="flex-1 max-w-7xl mx-auto w-full px-4 py-8"
        >
          <ErrorBoundary
            fallback={
              <section className="text-center py-16">
                <h2 className="text-xl font-semibold text-primary-200 mb-4">
                  Character Creation Unavailable
                </h2>
                <p className="text-primary-400 mb-6">
                  We're experiencing technical difficulties with the character
                  creation system. Please try refreshing the page.
                </p>
                <Link
                  href="/"
                  className="text-highlight hover:text-highlight-hover transition-colors"
                >
                  Return to homepage
                </Link>
              </section>
            }
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
                <Route path="/" component={Home} />
                <Route path="/new-character" component={CharGen} />

                {/* Default route in a switch */}
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
          </ErrorBoundary>
        </main>

        <footer
          role="contentinfo"
          className="bg-secondary border-t border-theme py-6 mt-auto"
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-primary-400">
              &copy; 2025 Torchlight. A BFRPG character generator.
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
