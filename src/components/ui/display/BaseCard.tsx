import { Link } from "wouter";
import { Button } from "@/components/ui";
import { Icon } from "@/components/ui/display";
import { Card } from "@/components/ui/design-system";
import { CARD_DECORATION_SIZES } from "@/constants/theme";
import type { ReactNode } from "react";

interface BaseCardProps {
  id: string;
  name: string;
  user: { uid: string } | null;
  href: string;
  onDelete: (id: string, name: string) => void;
  onCopy: (url: string, name: string) => void;
  isDeleting: boolean;
  children: ReactNode;
}

export function BaseCard({
  id,
  name,
  user,
  href,
  onDelete,
  onCopy,
  isDeleting,
  children,
}: BaseCardProps) {
  return (
    <Card 
      variant="gradient" 
      size="default"
      className="group relative min-w-0 w-full"
    >
      {/* Clickable overlay for entire card */}
      <Link
        href={href}
        className="absolute inset-0 z-10 cursor-pointer rounded-xl"
        aria-label={`View ${name}`}
      />

      {/* Background decoration */}
      <div
        className={`absolute top-0 right-0 ${CARD_DECORATION_SIZES.large} bg-gradient-to-bl from-amber-500/5 to-transparent rounded-xl pointer-events-none`}
      />
      <div
        className={`absolute bottom-0 left-0 ${CARD_DECORATION_SIZES.medium} bg-gradient-to-tr from-amber-500/5 to-transparent rounded-xl pointer-events-none`}
      />

      <div className="relative z-20 space-y-4 pointer-events-none">
        {children}

        {/* Action Area */}
        {user && (
          <div className="flex justify-end gap-2 pt-2 sm:pt-3 border-t border-zinc-700/50">
            <Button
              variant="secondary"
              size="sm"
              className="relative z-30 p-2 sm:p-2.5 text-amber-400 bg-transparent border border-amber-600/40 shadow-none hover:text-white hover:bg-amber-600 hover:border-amber-600 hover:shadow-lg hover:shadow-amber-600/40 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-800 transition-all duration-200 rounded-lg pointer-events-auto touch-manipulation"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const fullUrl = `${window.location.origin}${href}`;
                onCopy(fullUrl, name);
              }}
              aria-label={`Copy character sheet URL for ${name}`}
              title={`Copy character sheet URL for ${name}`}
            >
              <Icon name="copy" size="xs" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="relative z-30 p-2 sm:p-2.5 text-red-400 bg-transparent border border-red-600/40 shadow-none hover:text-white hover:bg-red-600 hover:border-red-600 hover:shadow-lg hover:shadow-red-600/40 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-800 transition-all duration-200 rounded-lg pointer-events-auto touch-manipulation"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(id, name);
              }}
              disabled={isDeleting}
              aria-label={`Delete ${name}`}
              title={`Delete ${name}`}
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-current" />
              ) : (
                <Icon name="trash" size="xs" />
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
