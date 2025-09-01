import { memo } from "react";
import { Card, Typography } from "@/components/ui/design-system";
import { StatCard } from "@/components/ui/display";
import type { Monster, MonsterStats } from "@/types/monsters";

interface MonsterItemProps {
  monster: Monster;
}

const MonsterStatsDisplay = memo(({ stats }: { stats: MonsterStats | Monster }) => {
  // Handle missing or undefined stats
  const displayValue = (value: string | undefined, fallback = "—") => value || fallback;
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      <StatCard
        label="AC"
        value={displayValue(stats.ac)}
        size="sm"
      />
      
      <StatCard
        label="HD"
        value={displayValue(stats.hitDice)}
        size="sm"
      />
      
      <StatCard
        label="Attacks"
        value={displayValue(stats.numAttacks)}
        size="sm"
      />
      
      <StatCard
        label="Damage"
        value={displayValue(stats.damage)}
        size="sm"
        className="font-mono text-xs"
      />
      
      <StatCard
        label="Movement"
        value={displayValue(stats.movement)}
        size="sm"
      />
      
      <StatCard
        label="Morale"
        value={displayValue(stats.morale)}
        size="sm"
      />
      
      <StatCard
        label="XP"
        value={displayValue(stats.xp)}
        size="sm"
      />
    </div>
  );
});

MonsterStatsDisplay.displayName = "MonsterStatsDisplay";

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
          <Typography variant="subHeading" className="text-zinc-100 text-lg font-semibold border-b border-zinc-700 pb-2">
            {monster.name}
          </Typography>
          
          {monster.variants?.map(([variantName, stats], index) => (
            <Card key={variantName || `variant-${index}`} variant="nested" className="p-4">
              {variantName && (
                <Typography
                  variant="subHeading"
                  className="text-zinc-200 mb-3"
                >
                  {variantName}
                </Typography>
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
        </div>
      ) : (
        <div className="space-y-3">
          {/* Show main monster name */}
          <Typography variant="subHeading" className="text-zinc-100 text-lg font-semibold border-b border-zinc-700 pb-2">
            {monster.name}
          </Typography>
          
          <MonsterStatsDisplay stats={monster} />
          
          {/* Additional info for non-variant monsters */}
          {(monster.numAppear || monster.saveAs || monster.treasure) && (
            <Card variant="nested" className="p-3">
              <Typography
                variant="subHeading"
                className="text-zinc-300 mb-2"
              >
                Additional Details
              </Typography>
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
        </div>
      )}
    </div>
  );
});

MonsterItem.displayName = "MonsterItem";

// Types are now exported from @/types/monsters