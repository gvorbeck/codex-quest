import { useMemo } from "react";
import type { Character } from "@/types";
import type { EquipmentPack } from "@/types";
import { getEquipmentPacksByClass } from "@/utils/equipment";
import equipmentPacksData from "@/data/equipment/equipmentPacks.json";

/**
 * Custom hook for equipment pack logic
 * Centralizes pack filtering and recommendation logic
 */
export function useEquipmentPacks(character: Character) {
  const allPacks = equipmentPacksData as EquipmentPack[];

  const packsById = useMemo(
    () => new Map(allPacks.map((pack) => [pack.id, pack])),
    [allPacks]
  );

  const { recommendedPacks, affordablePacks, cheapestPackCost, gold } =
    useMemo(() => {
      const gold = character.currency.gold;
      const recommended = getEquipmentPacksByClass(character);
      const affordable = recommended.filter((pack) => gold >= pack.cost);
      const cheapest =
        recommended.length > 0
          ? Math.min(...recommended.map((p) => p.cost))
          : 0;

      return {
        recommendedPacks: recommended,
        affordablePacks: affordable,
        cheapestPackCost: cheapest,
        gold,
      };
    }, [character]);

  const hasAffordablePacks = affordablePacks.length > 0;

  const isPackAffordable = (pack: EquipmentPack) => {
    return gold >= pack.cost;
  };

  const getPackById = (id: string) => packsById.get(id);

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
    isPackAffordable,
  };
}
