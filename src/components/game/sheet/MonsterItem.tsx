import { memo } from "react";
import { Card, Typography } from "@/components/ui/design-system";
import { MarkdownText, TextHeader } from "@/components/ui/display";
import { MonsterStatsDisplay } from "./MonsterStatsDisplay";
import type { Monster } from "@/types/monsters";

interface MonsterItemProps {
  monster: Monster;
}


export const MonsterItem = memo(({ monster }: MonsterItemProps) => {
  const hasVariants = monster.variants && monster.variants.length > 0;
  const uniqueKey = `monster-${monster.name.toLowerCase().replace(/\s+/g, "-")}`;

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
            <Card key={variantName || `variant-${index}`} variant="nested" className="p-4">
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
              
              {/* Additional info */}
              <div className="mt-3 pt-3 border-t border-zinc-700">
                <div className="flex flex-wrap gap-4 text-xs">
                  <div>
                    <span className="text-zinc-400">Appears:</span>{" "}
                    <span className="text-zinc-300">{stats.numAppear || "—"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Save As:</span>{" "}
                    <span className="text-zinc-300">{stats.saveAs || "—"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Treasure:</span>{" "}
                    <span className="text-zinc-300">{stats.treasure || "—"}</span>
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
});

MonsterItem.displayName = "MonsterItem";

// Types are now exported from @/types/monsters