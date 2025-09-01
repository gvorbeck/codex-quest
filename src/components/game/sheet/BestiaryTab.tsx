import { memo, useState, useCallback, useEffect } from "react";
import { Accordion } from "@/components/ui/layout";
import { Card, Typography } from "@/components/ui/design-system";
import { LoadingState } from "@/components/ui/feedback";
import { GAME_SHEET_STYLES } from "@/constants/gameSheetStyles";
import { CACHE_KEYS, GM_BINDER_MESSAGES } from "@/constants/gmBinderCategories";
import { categorizeMonster } from "@/utils/gmBinderUtils";
import { logger } from "@/utils/logger";
import { MonsterItem } from "./MonsterItem";
import type { Monster, MonsterWithCategory } from "@/types/monsters";

// Cache for loaded data
const monstersCache = new Map<string, MonsterWithCategory[]>();

export const BestiaryTab = memo(() => {
  const [monsters, setMonsters] = useState<MonsterWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Lazy load monsters data
  const loadMonsters = useCallback(async () => {
    const cacheKey = CACHE_KEYS.GM_BINDER_MONSTERS;
    
    if (monstersCache.has(cacheKey)) {
      setMonsters(monstersCache.get(cacheKey) as MonsterWithCategory[]);
      return;
    }

    setIsLoading(true);
    try {
      const { default: allMonsters } = await import("@/data/monsters.json");
      
      // Add category using utility function
      const monstersWithCategory: MonsterWithCategory[] = (allMonsters as Monster[]).map(monster => ({
        ...monster,
        category: categorizeMonster(monster),
      }));

      monstersCache.set(cacheKey, monstersWithCategory);
      setMonsters(monstersWithCategory);
    } catch (error) {
      logger.error("Failed to load monsters:", error);
      setMonsters([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    if (monsters.length === 0) {
      loadMonsters();
    }
  }, [monsters.length, loadMonsters]);

  const renderMonsterItem = useCallback((monster: MonsterWithCategory) => (
    <MonsterItem monster={monster} />
  ), []);

  if (isLoading) {
    return <LoadingState message={GM_BINDER_MESSAGES.LOADING_MONSTERS} />;
  }

  if (monsters.length === 0) {
    return (
      <Card variant="standard" className="p-8 text-center">
        <Typography variant="body" className={GAME_SHEET_STYLES.colors.text.secondary}>
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