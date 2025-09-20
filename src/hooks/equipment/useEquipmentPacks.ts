import { useMemo } from "react";
import type { Character } from "@/types";
import type { EquipmentPack } from "@/types/character";
import { getRecommendedPacks } from "@/utils/character";
import equipmentPacksData from "@/data/equipmentPacks.json";

/**
 * Custom hook for equipment pack logic
 * Centralizes pack filtering and recommendation logic
 */
export function useEquipmentPacks(character: Character) {
  const allPacks = equipmentPacksData as EquipmentPack[];

  const { recommendedPacks, affordablePacks, cheapestPackCost } = useMemo(() => {
    const gold = character.currency.gold;
    const recommended = getRecommendedPacks(character, allPacks);
    const affordable = recommended.filter(pack => gold >= pack.cost);
    const cheapest = recommended.length > 0 ? Math.min(...recommended.map(p => p.cost)) : 0;

    return {
      recommendedPacks: recommended,
      affordablePacks: affordable,
      cheapestPackCost: cheapest,
    };
  }, [character, allPacks]);

  const hasAffordablePacks = affordablePacks.length > 0;

  const getPackById = (id: string) => allPacks.find(pack => pack.id === id);

  const isPackRecommended = (pack: EquipmentPack) => {
    return recommendedPacks.includes(pack);
  };

  return {
    allPacks,
    recommendedPacks,
    affordablePacks,
    hasAffordablePacks,
    cheapestPackCost,
    getPackById,
    isPackRecommended,
  };
}