import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui";
import { Typography } from "@/components/ui/design-system";
import { useAuth } from "@/hooks";
import { signOut } from "@/services/auth";
import { logger } from "@/utils/logger";
import { DOM_IDS, CSS_CLASSES, HTML_ROLES } from "@/constants/dom";
import { Icon } from "@/components/ui/display/Icon";
import { Alert } from "@/components/ui/Alert";

interface AppHeaderProps {
  setIsSignInModalOpen: (open: boolean) => void;
  alertMessage?: string;
  onAlertClose?: () => void;
}

export function AppHeader({
  setIsSignInModalOpen,
  alertMessage,
  onAlertClose,
}: AppHeaderProps) {
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

      <header
        role={HTML_ROLES.BANNER}
        className="bg-primary-900 backdrop-blur-sm shadow-xl"
      >
        <nav
          role="navigation"
          aria-label="Main navigation"
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href="/"
                aria-label="Codex.Quest - Go to homepage"
                className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200 group"
              >
                <div className="relative">
                  <img
                    src="/logo.webp"
                    alt="Codex.Quest logo"
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
                  Codex.Quest
                </Typography>
              </Link>
            </div>

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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-primary-200 hover:text-amber-300 hover:bg-primary-700/50 px-4 py-2 transition-all duration-200"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setIsSignInModalOpen(true)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-amber-500/25 transition-all duration-200"
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
                className="relative p-3 rounded-lg text-primary-100 hover:text-amber-300 hover:bg-primary-700/50 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200 group"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                <span className="sr-only">
                  {isMobileMenuOpen ? "Close main menu" : "Open main menu"}
                </span>
                <Icon
                  name={!isMobileMenuOpen ? "menu" : "close"}
                  size="lg"
                  className="transition-transform duration-200 group-hover:scale-110"
                  aria-hidden={true}
                />
              </button>
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
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-primary-200 hover:text-amber-300 hover:bg-primary-700/50 flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 w-full group"
                    >
                      <span>Sign Out</span>
                      <Icon
                        name="close"
                        size="sm"
                        className="ml-auto opacity-60 group-hover:opacity-100 transition-opacity duration-200"
                      />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsSignInModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 w-full shadow-lg"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
      {alertMessage && (
        <Alert
          message={alertMessage}
          {...(onAlertClose && { onClose: onAlertClose })}
        />
      )}
    </>
  );
}
