import { memo, useState, useCallback, useEffect } from "react";
import { Accordion } from "@/components/ui/layout";
import { Card, Typography } from "@/components/ui/design-system";
import { LoadingState } from "@/components/ui/feedback";
import { GAME_SHEET_STYLES } from "@/constants";
import { CACHE_KEYS } from "@/constants";
import { GM_BINDER_MESSAGES } from "@/constants";
import { categorizeSpell } from "@/utils";
import { logger } from "@/utils";
import { SpellItem } from "./SpellItem";
import type { Spell } from "@/types";
import type { SpellWithCategory } from "@/types";

// Cache for loaded data
const spellsCache = new Map<string, SpellWithCategory[]>();

export const SpellsTab = memo(() => {
  const [spells, setSpells] = useState<SpellWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Lazy load spells data
  const loadSpells = useCallback(async () => {
    const cacheKey = CACHE_KEYS.GM_BINDER_SPELLS;

    if (spellsCache.has(cacheKey)) {
      setSpells(spellsCache.get(cacheKey) as SpellWithCategory[]);
      return;
    }

    setIsLoading(true);
    try {
      const { default: allSpells } = await import("@/data/spells.json");

      // Add category using utility function
      const spellsWithCategory: SpellWithCategory[] = (
        allSpells as Spell[]
      ).map((spell) => ({
        ...spell,
        category: categorizeSpell(spell),
      }));

      spellsCache.set(cacheKey, spellsWithCategory);
      setSpells(spellsWithCategory);
    } catch (error) {
      logger.error("Failed to load spells:", error);
      setSpells([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    if (spells.length === 0) {
      loadSpells();
    }
  }, [spells.length, loadSpells]);

  const renderSpellItem = useCallback(
    (spell: SpellWithCategory) => <SpellItem spell={spell} />,
    []
  );

  if (isLoading) {
    return <LoadingState message={GM_BINDER_MESSAGES.LOADING_SPELLS} />;
  }

  if (spells.length === 0) {
    return (
      <Card variant="standard" className="p-8 text-center">
        <Typography
          variant="body"
          className={GAME_SHEET_STYLES.colors.text.secondary}
        >
          {GM_BINDER_MESSAGES.NO_SPELLS}
        </Typography>
      </Card>
    );
  }

  return (
    <Accordion
      items={spells}
      sortBy="category"
      searchPlaceholder="Search spells by name..."
      renderItem={renderSpellItem}
      showCounts={true}
      showSearch={true}
    />
  );
});

SpellsTab.displayName = "SpellsTab";
