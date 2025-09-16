import { memo, useCallback } from "react";
import { Card, Typography } from "@/components/ui/design-system";
import { Button } from "@/components/ui/inputs";
import { Icon } from "@/components/ui/display";
import { MarkdownText, TextHeader } from "@/components/ui/display";
import { MonsterStatsDisplay } from "./MonsterStatsDisplay";
import type { Monster } from "@/types";
import type { GameCombatant } from "@/types";

interface MonsterItemProps {
  monster: Monster;
  onAddToCombat?: ((combatant: GameCombatant) => void) | undefined;
}

export const MonsterItem = memo(
  ({ monster, onAddToCombat }: MonsterItemProps) => {
    const hasVariants = monster.variants && monster.variants.length > 0;
    const uniqueKey = `monster-${monster.name
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    // Helper function to add a specific variant to combat
    const handleAddToCombat = useCallback(
      (variantIndex: number = 0) => {
        if (!onAddToCombat) return;

        // Import the conversion utility
        import("@/utils").then(({ monsterToCombatant }) => {
          const combatant = monsterToCombatant(monster, variantIndex);
          onAddToCombat(combatant);
        });
      },
      [monster, onAddToCombat]
    );

    return (
      <div
        className="space-y-4"
        role="article"
        aria-labelledby={`${uniqueKey}-name`}
      >
        {/* Hidden monster name for screen readers */}
        <Typography
          variant="h4"
          as="h4"
          id={`${uniqueKey}-name`}
          className="sr-only"
        >
          {monster.name} - Monster Reference
        </Typography>

        {hasVariants ? (
          <div className="space-y-4">
            {/* Show main monster name */}
            <TextHeader variant="h4" size="md" underlined={true}>
              {monster.name}
            </TextHeader>

            {monster.variants?.map(([variantName, stats], index) => (
              <Card
                key={variantName || `variant-${index}`}
                variant="nested"
                className="p-4"
              >
                {variantName && (
                  <TextHeader
                    variant="h5"
                    size="sm"
                    underlined={false}
                    className="text-zinc-200 mb-3"
                  >
                    {variantName}
                  </TextHeader>
                )}
                <MonsterStatsDisplay stats={stats} />

                {/* Add to Combat button */}
                {onAddToCombat && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      onClick={() => handleAddToCombat(index)}
                      variant="secondary"
                      size="sm"
                      aria-label={`Add ${
                        variantName
                          ? `${monster.name} (${variantName})`
                          : monster.name
                      } to Combat Tracker`}
                    >
                      <Icon name="plus" size="sm" className="mr-1" />
                      Add to Combat
                    </Button>
                  </div>
                )}

                {/* Additional info */}
                <div className="mt-3 pt-3 border-t border-zinc-700">
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div>
                      <span className="text-zinc-400">Appears:</span>{" "}
                      <span className="text-zinc-300">
                        {stats.numAppear || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Save As:</span>{" "}
                      <span className="text-zinc-300">
                        {stats.saveAs || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Treasure:</span>{" "}
                      <span className="text-zinc-300">
                        {stats.treasure || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Monster description for variants */}
            {monster.description && (
              <Card variant="nested" className="p-4">
                <TextHeader
                  variant="h5"
                  size="sm"
                  underlined={false}
                  className="text-zinc-300 mb-3"
                >
                  Description
                </TextHeader>
                <MarkdownText content={monster.description} />
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Show main monster name */}
            <TextHeader variant="h4" size="md" underlined={true}>
              {monster.name}
            </TextHeader>

            <MonsterStatsDisplay stats={monster} />

            {/* Add to Combat button */}
            {onAddToCombat && (
              <div className="flex justify-end">
                <Button
                  onClick={() => handleAddToCombat(0)}
                  variant="secondary"
                  size="sm"
                  aria-label={`Add ${monster.name} to Combat Tracker`}
                >
                  <Icon name="plus" size="sm" className="mr-1" />
                  Add to Combat
                </Button>
              </div>
            )}

            {/* Additional info for non-variant monsters */}
            {(monster.numAppear || monster.saveAs || monster.treasure) && (
              <Card variant="nested" className="p-3">
                <TextHeader
                  variant="h5"
                  size="sm"
                  underlined={false}
                  className="text-zinc-300 mb-2"
                >
                  Additional Details
                </TextHeader>
                <div className="flex flex-wrap gap-4 text-sm">
                  {monster.numAppear && (
                    <div>
                      <span className="text-zinc-400">Appears:</span>{" "}
                      <span className="text-zinc-300">{monster.numAppear}</span>
                    </div>
                  )}
                  {monster.saveAs && (
                    <div>
                      <span className="text-zinc-400">Save As:</span>{" "}
                      <span className="text-zinc-300">{monster.saveAs}</span>
                    </div>
                  )}
                  {monster.treasure && (
                    <div>
                      <span className="text-zinc-400">Treasure:</span>{" "}
                      <span className="text-zinc-300">{monster.treasure}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Monster description for non-variants */}
            {monster.description && (
              <Card variant="nested" className="p-4">
                <TextHeader
                  variant="h5"
                  size="sm"
                  underlined={false}
                  className="text-zinc-300 mb-3"
                >
                  Description
                </TextHeader>
                <MarkdownText content={monster.description} />
              </Card>
            )}
          </div>
        )}
      </div>
    );
  }
);

MonsterItem.displayName = "MonsterItem";

// Types are now exported from @/types/monsters
