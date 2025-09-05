import { Card, Typography, Badge } from "@/components/ui";

/**
 * AppFooter Component
 *
 * Serves as the main application footer with navigation links, attribution, and legal information.
 * This component demonstrates excellent UI component library adoption and should serve as a
 * reference implementation for other footer/navigation components.
 *
 * Key Design Patterns:
 * - Perfect integration with design system components (Card, Typography, Badge)
 * - Comprehensive accessibility implementation (ARIA labels, semantic HTML)
 * - Consistent styling through centralized linkStyles variable
 * - Proper external link security (rel="noopener noreferrer")
 * - Mobile-responsive layout with flexbox
 *
 * @example
 * ```tsx
 * <AppFooter />
 * ```
 */
export function AppFooter() {
  // Centralized link styling for consistency and maintainability
  const linkStyles =
    "text-sm text-amber-300 hover:text-amber-400 transition-colors duration-200 font-medium underline decoration-amber-300/50 hover:decoration-amber-400";

  return (
    <footer role="contentinfo" className="mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Using Card component from design system for consistent styling */}
        <Card variant="standard" shadow="standard" className="text-center">
          <div className="space-y-6">
            {/* Navigation Links */}
            <nav aria-label="Footer Navigation">
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                {/* Donate button using Badge component for visual prominence */}
                <a
                  href="https://www.paypal.com/donate/?business=4BW6AR5BGQZYW&no_recurring=0&item_name=for+CODEX.QUEST+database+fees&currency_code=USD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Badge variant="warning" size="md">
                    Donate
                  </Badge>
                </a>
                <a
                  href="https://github.com/gvorbeck/codex-quest/blob/main/LICENSE"
                  target="_blank"
                  rel="noreferrer noopener"
                  data-testid="license-link"
                  className={linkStyles}
                >
                  License
                </a>
                <a
                  href="mailto:me@iamgarrett.com"
                  data-testid="contact-link"
                  className={linkStyles}
                >
                  Contact
                </a>
                <a
                  href="https://github.com/gvorbeck/codex-quest"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="github-link"
                  className={linkStyles}
                >
                  GitHub
                </a>
                <a
                  href="https://www.freeprivacypolicy.com/live/fbe666aa-8172-4c25-86b3-f8b190191f9c"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="privacy-policy-link"
                  className={linkStyles}
                >
                  Privacy Policy
                </a>
                <a
                  href="https://bsky.app/profile/codex.quest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkStyles}
                >
                  Bluesky
                </a>
              </div>
            </nav>

            {/* Simple divider - using basic border instead of HorizontalRule component 
                as this context calls for a subtle separator rather than decorative element */}
            <div className="border-t border-zinc-600/50" />

            {/* Copyright section using Typography component for consistent text styling */}
            <Typography variant="bodySmall" color="secondary" className="m-0">
              &copy; {new Date().getFullYear()}{" "}
              <a
                href="https://iamgarrett.com"
                target="_blank"
                rel="noopener noreferrer"
                className={linkStyles}
              >
                J. Garrett Vorbeck
              </a>
            </Typography>

            {/* Game System Attribution */}
            <Typography variant="bodySmall" color="secondary" className="m-0">
              This site is based on the{" "}
              <a
                href="https://basicfantasy.org"
                target="_blank"
                rel="noopener noreferrer"
                className={linkStyles}
              >
                Basic Fantasy Role-Playing Game
              </a>{" "}
              (4th Edition)
            </Typography>

            {/* Other Sites */}
            <div className="space-y-2">
              <Typography
                variant="bodySmall"
                color="secondary"
                className="m-0 font-semibold"
              >
                Other Sites
              </Typography>
              <div className="flex items-center justify-center gap-4">
                <a
                  href="https://rollal.one"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkStyles}
                >
                  Roll Alone
                </a>
                <a
                  href="https://glyph.quest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkStyles}
                >
                  Glyph.Quest
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </footer>
  );
}
