import { memo, useState, useCallback, useEffect } from "react";
import { Accordion } from "@/components/ui/layout";
import { Card, Typography } from "@/components/ui/design-system";
import { LoadingState } from "@/components/ui/feedback";
import { useLoadingState } from "@/hooks";
import { GAME_SHEET_STYLES } from "@/constants";
import { CACHE_KEYS } from "@/constants";
import { GM_BINDER_MESSAGES } from "@/constants";
import { categorizeMonster, createSearchableText } from "@/utils";
import { logger } from "@/utils";
import { MonsterItem } from "./MonsterItem";
import type { Monster, MonsterWithCategory } from "@/types";
import type { GameCombatant } from "@/types";

// Cache for loaded data
const monstersCache = new Map<string, MonsterWithCategory[]>();

interface BestiaryTabProps {
  onAddToCombat?: ((combatant: GameCombatant) => void) | undefined;
}

export const BestiaryTab = memo(({ onAddToCombat }: BestiaryTabProps) => {
  const [monsters, setMonsters] = useState<MonsterWithCategory[]>([]);
  const { loading: isLoading, withLoading } = useLoadingState();

  // Lazy load monsters data
  const loadMonsters = useCallback(async () => {
    const cacheKey = CACHE_KEYS.GM_BINDER_MONSTERS;

    if (monstersCache.has(cacheKey)) {
      setMonsters(monstersCache.get(cacheKey) as MonsterWithCategory[]);
      return;
    }

    await withLoading(async () => {
      try {
        const { default: allMonsters } = await import("@/data/monsters.json");

        // Add category and searchable text using utility functions
        const monstersWithCategory: MonsterWithCategory[] = (
          allMonsters as Monster[]
        ).map((monster) => ({
          ...monster,
          category: categorizeMonster(monster),
          searchableText: createSearchableText(monster),
        }));

        monstersCache.set(cacheKey, monstersWithCategory);
        setMonsters(monstersWithCategory);
      } catch (error) {
        logger.error("Failed to load monsters:", error);
        setMonsters([]);
      }
    });
  }, [withLoading]);

  // Load data on mount
  useEffect(() => {
    if (monsters.length === 0) {
      loadMonsters();
    }
  }, [monsters.length, loadMonsters]);

  const renderMonsterItem = useCallback(
    (monster: MonsterWithCategory) => (
      <MonsterItem monster={monster} onAddToCombat={onAddToCombat} />
    ),
    [onAddToCombat]
  );

  if (isLoading) {
    return <LoadingState message={GM_BINDER_MESSAGES.LOADING_MONSTERS} />;
  }

  if (monsters.length === 0) {
    return (
      <Card variant="standard" className="p-8 text-center">
        <Typography
          variant="body"
          className={GAME_SHEET_STYLES.colors.text.secondary}
        >
          {GM_BINDER_MESSAGES.NO_MONSTERS}
        </Typography>
      </Card>
    );
  }

  return (
    <Accordion
      items={monsters}
      sortBy="category"
      searchPlaceholder="Search monsters by name..."
      renderItem={renderMonsterItem}
      showCounts={true}
      showSearch={true}
    />
  );
});

BestiaryTab.displayName = "BestiaryTab";
