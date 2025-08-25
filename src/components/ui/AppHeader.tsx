import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks";
import { signOut } from "@/services/auth";
import { logger } from "@/utils/logger";
import { DOM_IDS, CSS_CLASSES, HTML_ROLES } from "@/constants/dom";
import { Icon } from "@/components/ui/display/Icon";

interface AppHeaderProps {
  setIsSignInModalOpen: (open: boolean) => void;
}

export function AppHeader({ setIsSignInModalOpen }: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      logger.error("Sign out error:", error);
    }
  };

  return (
    <>
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
                <Icon 
                  name={!isMobileMenuOpen ? "menu" : "close"} 
                  size="lg" 
                  className="block"
                  aria-hidden={true}
                />
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
    </>
  );
}