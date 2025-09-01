import { memo } from "react";
import { StatCard } from "@/components/ui/display";
import { displayValue } from "@/utils/displayUtils";
import type { Monster, MonsterStats } from "@/types/monsters";

interface MonsterStatsDisplayProps {
  stats: MonsterStats | Monster;
}

export const MonsterStatsDisplay = memo(({ stats }: MonsterStatsDisplayProps) => {
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