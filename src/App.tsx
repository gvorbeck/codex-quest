import { Link, Route, Switch } from "wouter";
import { Suspense, lazy, useEffect, useState } from "react";
import "./App.css";
import { ErrorBoundary, Button } from "@/components/ui";
import { useAuth } from "@/hooks";
import { preloadCriticalData } from "@/services/dataLoader";
import { signOut } from "@/services/auth";
import { logger } from "@/utils/logger";
import { DOM_IDS, CSS_CLASSES, HTML_ROLES } from "@/constants/dom";

// Lazy load page components for better code splitting
const Home = lazy(() => import("./components/pages/Home"));
const CharGen = lazy(() => import("./components/pages/CharGen"));
const CharacterSheet = lazy(() => import("./components/pages/CharacterSheet"));

// Lazy load auth components only when needed
const SignInModal = lazy(() => import("./components/auth/SignInModal"));

function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  // Preload critical data for better performance
  useEffect(() => {
    preloadCriticalData().catch((error) => {
      logger.warn("Failed to preload critical data:", error);
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      logger.error("Sign out error:", error);
    }
  };

  const handleSignInSuccess = () => {
    setIsSignInModalOpen(false);
  };

  return (
    <ErrorBoundary>
      <div className="app dark bg-primary text-primary min-h-screen flex flex-col">
        <a href={`#${DOM_IDS.MAIN_CONTENT}`} className={CSS_CLASSES.SKIP_LINK}>
          Skip to main content
        </a>

        <header role={HTML_ROLES.BANNER} className="bg-primary-700 border-b border-primary-600 shadow-lg">
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-title font-bold text-highlight-400">
                  <Link
                    href="/"
                    aria-label="Go to homepage"
                    className="hover:text-highlight-300 transition-colors duration-200"
                  >
                    Torchlight
                  </Link>
                </h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <Link
                    href="/new-character"
                    className="text-primary-100 hover:text-highlight-300 hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  >
                    Create Character
                  </Link>
                </div>
              </div>

              {/* Desktop Authentication */}
              <div className="hidden md:block">
                <div className="ml-4 flex items-center space-x-4">
                  {user ? (
                    <div className="flex items-center space-x-3">
                      <span className="text-primary-200 text-sm font-medium">
                        {user.email?.split('@')[0]}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="text-primary-100 hover:text-highlight-300 hover:bg-primary-600 px-3 py-2 text-sm"
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsSignInModalOpen(true)}
                      className="bg-highlight-400 hover:bg-highlight-300 text-primary-900 px-4 py-2 text-sm font-medium"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="bg-primary-700 inline-flex items-center justify-center p-2 rounded-md text-primary-100 hover:text-highlight-300 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-highlight-400 transition-all duration-200"
                  aria-controls="mobile-menu"
                  aria-expanded={isMobileMenuOpen}
                  aria-label="Toggle mobile menu"
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMobileMenuOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            <div
              className={`md:hidden transition-all duration-300 ease-in-out ${
                isMobileMenuOpen 
                  ? 'max-h-64 opacity-100' 
                  : 'max-h-0 opacity-0 overflow-hidden'
              }`}
              id="mobile-menu"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-primary-600 mt-2">
                <Link
                  href="/new-character"
                  className="text-primary-100 hover:text-highlight-300 hover:bg-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Character
                </Link>
                
                {/* Mobile Authentication */}
                <div className="pt-4 pb-3 border-t border-primary-600">
                  {user ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2">
                        <div className="text-base font-medium text-primary-200">
                          {user.email?.split('@')[0]}
                        </div>
                        <div className="text-sm font-medium text-primary-400">
                          {user.email}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-primary-100 hover:text-highlight-300 hover:bg-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 w-full text-left"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsSignInModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-highlight-400 hover:bg-highlight-300 text-primary-900 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 w-full text-center"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
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
                <Route path="/u/:userId/c/:characterId" component={CharacterSheet} />

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

        {/* Sign In Modal - Lazy loaded */}
        {isSignInModalOpen && (
          <Suspense fallback={<div>Loading...</div>}>
            <SignInModal
              isOpen={isSignInModalOpen}
              onClose={() => setIsSignInModalOpen(false)}
              onSuccess={handleSignInSuccess}
            />
          </Suspense>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
