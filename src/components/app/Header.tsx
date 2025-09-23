import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui";
import { Typography } from "@/components/ui/core/display";
import { useAuth } from "@/hooks";
import { signOut, isMockMode, devUtils } from "@/services";
import { logger } from "@/utils";
import { DOM_IDS, CSS_CLASSES, HTML_ROLES } from "@/constants";
import { GlobalAlert } from "@/components/app/GlobalAlert";
import type { AlertConfig } from "@/constants";

interface HeaderProps {
  setIsSignInModalOpen: (open: boolean) => void;
  alerts: AlertConfig[];
  onAlertClose: (alertIndex: number) => void;
}

export function Header({
  setIsSignInModalOpen,
  alerts,
  onAlertClose,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      logger.error("Sign out error:", error);
    }
  };

  const getDevUtils = () => {
    return (
      devUtils || (window as unknown as { devUtils?: typeof devUtils }).devUtils
    );
  };

  const handleResetMockData = () => {
    if (isMockMode()) {
      const utils = getDevUtils();
      if (utils) {
        utils.resetAllData();
        // Reload the page to see the reset data
        window.location.reload();
      } else {
        // Manual fallback if devUtils isn't available
        logger.warn("devUtils not available, clearing localStorage manually");
        localStorage.removeItem("mock_characters");
        localStorage.removeItem("mock_characters_sample_initialized");
        localStorage.removeItem("mock_games");
        localStorage.removeItem("mock_games_sample_initialized");
        window.location.reload();
      }
    }
  };

  return (
    <>
      <a href={`#${DOM_IDS.MAIN_CONTENT}`} className={CSS_CLASSES.SKIP_LINK}>
        Skip to main content
      </a>

      <header
        role={HTML_ROLES.BANNER}
        className="bg-primary-900 backdrop-blur-sm shadow-xl"
      >
        <nav
          role="navigation"
          aria-label="Main navigation"
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between h-20 mx-1">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href="/"
                aria-label={`${
                  isMockMode() ? "Codex.Mock" : "Codex.Quest"
                } - Go to homepage`}
                className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200 group"
              >
                <div className="relative">
                  <img
                    src="/images/logo.webp"
                    alt={`${isMockMode() ? "Codex.Mock" : "Codex.Quest"} logo`}
                    className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-200 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-amber-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-sm -z-10"></div>
                </div>
                <Typography
                  variant="h3"
                  as="h1"
                  color="amber"
                  className="font-title font-bold text-2xl sm:text-3xl tracking-tight bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent group-hover:from-amber-200 group-hover:to-amber-400 transition-all duration-200"
                >
                  {isMockMode() ? "Codex.Mock" : "Codex.Quest"}
                </Typography>
              </Link>
            </div>

            {/* Mock Mode Reset Button */}
            {isMockMode() && (
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetMockData}
                  title="Reset all data to original sample data"
                  icon="settings"
                >
                  Reset Sample Data
                </Button>
              </div>
            )}

            {/* Desktop Authentication */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Typography
                        variant="bodySmall"
                        color="amber"
                        weight="medium"
                      >
                        {user.email?.split("@")[0]}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="secondary"
                        className="block"
                      >
                        Signed in
                      </Typography>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setIsSignInModalOpen(true)}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
                icon={!isMobileMenuOpen ? "menu" : "close"}
                iconClasses="w-6 h-6 transition-transform duration-200 group-hover:scale-110"
              >
                <span className="sr-only">
                  {isMobileMenuOpen ? "Close main menu" : "Open main menu"}
                </span>
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? "max-h-80 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
            id="mobile-menu"
          >
            <div className="px-4 pt-4 pb-6 space-y-3 mt-4 bg-primary-800/50 backdrop-blur-sm">
              {/* Mobile Authentication */}
              <div>
                {user ? (
                  <div className="space-y-3">
                    <div className="px-4 py-3 rounded-lg bg-primary-700/30">
                      <Typography
                        variant="bodySmall"
                        color="amber"
                        weight="medium"
                      >
                        {user.email?.split("@")[0]}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="secondary"
                        className="block mt-1"
                      >
                        {user.email}
                      </Typography>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      icon="close"
                      iconClasses="w-4 h-4 ml-auto opacity-60 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <span>Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsSignInModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
      {alerts.length > 0 && (
        <div className="space-y-0">
          {alerts.map((alert, index) => (
            <GlobalAlert
              key={`alert-${index}`}
              alert={alert}
              onClose={() => onAlertClose(index)}
            />
          ))}
        </div>
      )}
    </>
  );
}
