import { memo } from "react";
import type { GameCombatant } from "@/types/game";
import { GAME_SHEET_STYLES } from "@/constants/gameSheetStyles";
import { HorizontalRule } from "@/components/ui/display";
import { Typography } from "@/components/ui/design-system";

interface CombatantCardProps {
  combatant: GameCombatant;
}

const CombatantCard = memo(({ combatant }: CombatantCardProps) => {
  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`${GAME_SHEET_STYLES.colors.card} p-4`}>
      <div className="flex items-start gap-3">
        {combatant.avatar ? (
          <img
            src={combatant.avatar}
            alt=""
            className="w-12 h-12 rounded-full object-cover border-2 border-zinc-600 flex-shrink-0"
            loading="lazy"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full bg-zinc-700 border-2 border-zinc-600 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <span className="text-zinc-300 font-bold text-sm">
              {getInitials(combatant.name)}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <Typography
            variant="bodySmall"
            weight="medium"
            as="h3"
            className={`${GAME_SHEET_STYLES.colors.text.primary} truncate mb-1`}
          >
            {combatant.name}
          </Typography>

          <dl className="space-y-1 text-sm">
            <div className="flex gap-2">
              <dt className={GAME_SHEET_STYLES.colors.text.secondary}>AC:</dt>
              <dd className={GAME_SHEET_STYLES.colors.text.primary}>
                {combatant.ac}
              </dd>
            </div>

            <div className="flex gap-2">
              <dt className={GAME_SHEET_STYLES.colors.text.secondary}>
                Initiative:
              </dt>
              <dd className={GAME_SHEET_STYLES.colors.text.primary}>
                {combatant.initiative}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
});

CombatantCard.displayName = "CombatantCard";

interface CombatantsSectionProps {
  combatants: GameCombatant[];
  showDivider?: boolean;
}

export const CombatantsSection = memo(
  ({ combatants, showDivider = false }: CombatantsSectionProps) => {
    if (!combatants || combatants.length === 0) {
      return null;
    }

    return (
      <>
        {showDivider && <HorizontalRule />}
        <section aria-labelledby="combatants-heading">
          <Typography
            variant="h2"
            as="h2"
            id="combatants-heading"
            weight="bold"
            className={`${GAME_SHEET_STYLES.colors.text.primary} ${GAME_SHEET_STYLES.spacing.element}`}
          >
            Combatants ({combatants.length})
          </Typography>

          <div
            className={`${GAME_SHEET_STYLES.layout.cardGrid} ${GAME_SHEET_STYLES.spacing.cardGap}`}
          >
            {combatants.map((combatant, index) => (
              <CombatantCard
                key={`${combatant.name}-${index}`}
                combatant={combatant}
              />
            ))}
          </div>
        </section>
      </>
    );
  }
);

CombatantsSection.displayName = "CombatantsSection";
