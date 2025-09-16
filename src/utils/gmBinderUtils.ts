/**
 * Utility functions for GMBinder categorization
 */

import type { Spell } from "@/types/character";
import type { Monster } from "@/types/monsters";
import {
  SPELL_CATEGORIES,
  SPELL_LEVEL_THRESHOLDS,
  MONSTER_CATEGORIES,
  MONSTER_NAME_PATTERNS,
} from "@/constants";

/**
 * Categorizes a spell based on its maximum level across all classes
 */
export function categorizeSpell(spell: Spell): string {
  const levels = Object.values(spell.level).filter(level => level !== null);
  const maxLevel = Math.max(...(levels as number[]));
  
  if (maxLevel <= SPELL_LEVEL_THRESHOLDS.LOW_MAX) {
    return SPELL_CATEGORIES.LOW_LEVEL;
  }
  
  if (maxLevel <= SPELL_LEVEL_THRESHOLDS.MID_MAX) {
    return SPELL_CATEGORIES.MID_LEVEL;
  }
  
  if (maxLevel <= SPELL_LEVEL_THRESHOLDS.HIGH_5_6_MAX) {
    return SPELL_CATEGORIES.HIGH_LEVEL_5_6;
  }
  
  return SPELL_CATEGORIES.HIGH_LEVEL_7_9;
}

/**
 * Categorizes a monster based on name patterns
 */
export function categorizeMonster(monster: Monster): string {
  const name = monster.name.toLowerCase();
  
  // Check each category's patterns
  for (const [category, patterns] of Object.entries(MONSTER_NAME_PATTERNS)) {
    if (patterns.some(pattern => name.includes(pattern))) {
      return category;
    }
  }
  
  // Default category if no patterns match
  return MONSTER_CATEGORIES.MISCELLANEOUS;
}

/**
 * Creates a searchable text string for a monster including all variant names
 */
export function createSearchableText(monster: Monster): string {
  return [
    monster.name,
    ...(monster.variants || []).map(([variantName]) => variantName).filter(Boolean)
  ].join(' ').toLowerCase();
}