/**
 * Utility to convert Monster data to GameCombatant format
 */

import type { Monster, MonsterStats } from "@/types/monsters";
import type { GameCombatant } from "@/types/game";

/**
 * Extracts AC as a number from the monster AC string
 * AC can be in formats like "14", "17 (s)", "20 (m)", etc.
 */
function parseArmorClass(acString: string): number {
  // Extract the first number from the AC string
  const match = acString.match(/\d+/);
  return match ? parseInt(match[0], 10) : 11; // Default to AC 11 if parsing fails
}

/**
 * Converts a Monster to a GameCombatant
 * For monsters with variants, uses the first variant by default
 */
export function monsterToCombatant(
  monster: Monster,
  variantIndex: number = 0
): GameCombatant {
  let stats: MonsterStats;
  let name = monster.name;

  // Handle monsters with variants
  if (monster.variants && monster.variants.length > 0) {
    const variant = monster.variants[variantIndex];
    if (variant) {
      const [variantName, variantStats] = variant;
      stats = variantStats;
      // If variant has a name, append it to the monster name
      if (variantName && variantName.trim()) {
        name = `${monster.name} (${variantName})`;
      }
    } else {
      // Fallback to first variant if index is out of bounds
      const firstVariant = monster.variants[0];
      if (firstVariant) {
        const [variantName, variantStats] = firstVariant;
        stats = variantStats;
        if (variantName && variantName.trim()) {
          name = `${monster.name} (${variantName})`;
        }
      } else {
        // If somehow no variants exist, create default stats
        stats = {
          ac: "11",
          hitDice: "1",
          numAttacks: "1",
          damage: "1d6",
          movement: "30'",
          numAppear: "1",
          saveAs: "Fighter: 1",
          morale: "7",
          treasure: "None",
          xp: "10",
        };
      }
    }
  } else {
    // For monsters without variants, use monster properties directly
    stats = {
      ac: monster.ac || "11",
      hitDice: monster.hitDice || "1",
      numAttacks: monster.numAttacks || "1",
      damage: monster.damage || "1d6",
      movement: monster.movement || "30'",
      numAppear: monster.numAppear || "1",
      saveAs: monster.saveAs || "Fighter: 1",
      morale: monster.morale || "7",
      treasure: monster.treasure || "None",
      xp: monster.xp || "10",
    };
  }

  return {
    name,
    ac: parseArmorClass(stats.ac),
    initiative: 0, // Will be rolled when combat starts
  };
}

/**
 * Gets the display name for a monster variant
 */
export function getMonsterVariantName(
  monster: Monster,
  variantIndex: number = 0
): string {
  if (!monster.variants || monster.variants.length === 0) {
    return monster.name;
  }

  const variant = monster.variants[variantIndex];
  if (!variant) {
    return monster.name;
  }

  const [variantName] = variant;
  if (variantName && variantName.trim()) {
    return `${monster.name} (${variantName})`;
  }

  return monster.name;
}
