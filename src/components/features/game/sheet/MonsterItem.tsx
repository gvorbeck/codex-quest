import { memo, useCallback } from "react";
import { Card } from "@/components/ui/core/display";
import { Button } from "@/components/ui/core/primitives";
import { MarkdownText, TextHeader } from "@/components/ui/composite";
import { monsterToCombatant } from "@/utils";
import { MonsterStatsDisplay } from "./MonsterStatsDisplay";
import type { Monster, GameCombatant } from "@/types";

interface MonsterItemProps {
  monster: Monster;
  onAddToCombat?: ((combatant: GameCombatant) => void) | undefined;
}

export const MonsterItem = memo(
  ({ monster, onAddToCombat }: MonsterItemProps) => {
    const hasVariants = monster.variants && monster.variants.length > 0;
    const hasStats = monster.ac !== undefined;
    const uniqueKey = `monster-${monster.name
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    const handleAddToCombat = useCallback(
      (variantIndex: number = 0) => {
        if (!onAddToCombat) return;
        onAddToCombat(monsterToCombatant(monster, variantIndex));
      },
      [monster, onAddToCombat]
    );

    const descriptionCard = monster.description && (
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
    );

    return (
      <div
        className="space-y-4"
        role="article"
        aria-labelledby={`${uniqueKey}-name`}
      >
        {!hasVariants && !hasStats ? (
          <div className="space-y-4">
            <TextHeader
              variant="h4"
              size="md"
              underlined={true}
              id={`${uniqueKey}-name`}
            >
              {monster.name}
            </TextHeader>
            {descriptionCard}
          </div>
        ) : hasVariants ? (
          <div className="space-y-4">
            <TextHeader
              variant="h4"
              size="md"
              underlined={true}
              id={`${uniqueKey}-name`}
            >
              {monster.name}
            </TextHeader>

            {monster.variants
              ?.filter(([, stats]) => stats !== undefined)
              .map(([variantName, stats], index) => (
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

                  {onAddToCombat && (
                    <div className="mt-3 flex justify-end">
                      <Button
                        onClick={() => handleAddToCombat(index)}
                        variant="secondary"
                        size="sm"
                        icon="plus"
                        iconSize="sm"
                        iconClassName="mr-1"
                        aria-label={`Add ${
                          variantName
                            ? `${monster.name} (${variantName})`
                            : monster.name
                        } to Combat Tracker`}
                      >
                        Add to Combat
                      </Button>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-zinc-700">
                    <dl className="flex flex-wrap gap-4 text-xs">
                      <div>
                        <dt className="text-zinc-400">Appears:</dt>
                        <dd className="text-zinc-300">
                          {stats.numAppear || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-zinc-400">Save As:</dt>
                        <dd className="text-zinc-300">
                          {stats.saveAs || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-zinc-400">Treasure:</dt>
                        <dd className="text-zinc-300">
                          {stats.treasure || "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </Card>
              ))}

            {descriptionCard}
          </div>
        ) : (
          <div className="space-y-4">
            <TextHeader
              variant="h4"
              size="md"
              underlined={true}
              id={`${uniqueKey}-name`}
            >
              {monster.name}
            </TextHeader>

            <MonsterStatsDisplay stats={monster} />

            {onAddToCombat && (
              <div className="flex justify-end">
                <Button
                  onClick={() => handleAddToCombat(0)}
                  variant="secondary"
                  size="sm"
                  icon="plus"
                  iconSize="sm"
                  iconClassName="mr-1"
                  aria-label={`Add ${monster.name} to Combat Tracker`}
                >
                  Add to Combat
                </Button>
              </div>
            )}

            {(monster.numAppear || monster.saveAs || monster.treasure) && (
              <Card variant="nested" className="p-4">
                <TextHeader
                  variant="h5"
                  size="sm"
                  underlined={false}
                  className="text-zinc-300 mb-2"
                >
                  Additional Details
                </TextHeader>
                <dl className="flex flex-wrap gap-4 text-xs">
                  {monster.numAppear && (
                    <div>
                      <dt className="text-zinc-400">Appears:</dt>
                      <dd className="text-zinc-300">{monster.numAppear}</dd>
                    </div>
                  )}
                  {monster.saveAs && (
                    <div>
                      <dt className="text-zinc-400">Save As:</dt>
                      <dd className="text-zinc-300">{monster.saveAs}</dd>
                    </div>
                  )}
                  {monster.treasure && (
                    <div>
                      <dt className="text-zinc-400">Treasure:</dt>
                      <dd className="text-zinc-300">{monster.treasure}</dd>
                    </div>
                  )}
                </dl>
              </Card>
            )}

            {descriptionCard}
          </div>
        )}
      </div>
    );
  }
);

MonsterItem.displayName = "MonsterItem";
