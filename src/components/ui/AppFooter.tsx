import { Card, Typography } from "@/components/ui";
import Badge from "./design-system/Badge";

export function AppFooter() {
  return (
    <footer role="contentinfo" className="mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Card variant="standard" shadow="standard" className="text-center">
          <div className="space-y-6">
            {/* Navigation Links */}
            <nav aria-label="Footer Navigation">
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
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
                  className="text-zinc-300 hover:text-amber-400 transition-colors duration-200 font-medium text-sm"
                >
                  License
                </a>
                <a
                  href="mailto:me@iamgarrett.com"
                  data-testid="contact-link"
                  className="text-zinc-300 hover:text-amber-400 transition-colors duration-200 font-medium text-sm"
                >
                  Contact
                </a>
                <a
                  href="https://github.com/gvorbeck/codex-quest"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="github-link"
                  className="text-zinc-300 hover:text-amber-400 transition-colors duration-200 font-medium text-sm"
                >
                  GitHub
                </a>
                <a
                  href="https://www.freeprivacypolicy.com/live/fbe666aa-8172-4c25-86b3-f8b190191f9c"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="privacy-policy-link"
                  className="text-zinc-300 hover:text-amber-400 transition-colors duration-200 font-medium text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="https://bsky.app/profile/codex.quest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-amber-400 transition-colors duration-200 font-medium text-sm"
                >
                  Bluesky
                </a>
              </div>
            </nav>

            {/* Divider */}
            <div className="border-t border-zinc-600/50" />

            {/* Copyright */}
            <Typography variant="bodySmall" color="secondary" className="m-0">
              &copy; {new Date().getFullYear()}{" "}
              <a
                href="https://iamgarrett.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-400 transition-colors duration-200 font-medium underline decoration-amber-300/50 hover:decoration-amber-400"
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
                className="text-amber-300 hover:text-amber-400 transition-colors duration-200 font-medium underline decoration-amber-300/50 hover:decoration-amber-400"
              >
                Basic Fantasy Role-Playing Game
              </a>
              {" "}(4th Edition)
            </Typography>
          </div>
        </Card>
      </div>
    </footer>
  );
}
