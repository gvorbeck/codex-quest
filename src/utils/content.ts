/**
 * Game content utilities - consolidated from monsterToCombatant.ts, treasureDisplay.ts, and entire treasure/ folder
 * Contains monster utilities, treasure generation (BFRPG-compliant), and treasure display functions
 */

import type { Monster, MonsterStats } from "@/types";
import type {
  GameCombatant,
  TreasureResult,
  TreasureType,
  LairTreasureType,
  IndividualTreasureType,
  UnguardedTreasureLevel,
} from "@/types";
import { COIN_CONFIGS } from "@/constants";
import { calculateTotalGoldValue } from "./currency";

// Note: Using direct import here to avoid circular dependency with barrel file
import { rollPercentage, roller } from "./mechanics";

// ============================================================================
// MONSTER UTILITIES
// ============================================================================

function parseArmorClass(acString: string): number {
  // Extract the first number from the AC string
  const match = acString.match(/\d+/);
  return match ? parseInt(match[0], 10) : 11; // Default to AC 11 if parsing fails
}

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

// ============================================================================
// TREASURE SYSTEM - BFRPG COMPLIANT
// ============================================================================

interface TreasureConfig {
  copper: { chance: number; amount: string };
  silver: { chance: number; amount: string };
  electrum: { chance: number; amount: string };
  gold: { chance: number; amount: string };
  platinum: { chance: number; amount: string };
  gems: { chance: number; amount: string };
  jewelry: { chance: number; amount: string };
  magic: { chance: number; amount: number };
}

interface IndividualTreasureConfig {
  copper: { amount: string; chance?: number };
  silver: { amount: string; chance?: number };
  electrum: { amount: string; chance?: number };
  gold: { amount: string; chance?: number };
  platinum: { amount: string; chance?: number };
  gems: { amount: string; chance?: number };
  jewelry: { amount: string; chance?: number };
  magic: { amount: number; chance?: number };
}

// BFRPG-compliant treasure tables
const LAIR_TREASURE_CONFIGS: Record<LairTreasureType, TreasureConfig> = {
  A: {
    copper: { chance: 50, amount: "5d6x100" },
    silver: { chance: 60, amount: "5d6x100" },
    electrum: { chance: 40, amount: "5d4x100" },
    gold: { chance: 70, amount: "10d6x100" },
    platinum: { chance: 50, amount: "1d10x100" },
    gems: { chance: 50, amount: "6d6" },
    jewelry: { chance: 50, amount: "6d6" },
    magic: { chance: 30, amount: 3 },
  },
  B: {
    copper: { chance: 75, amount: "5d10x100" },
    silver: { chance: 50, amount: "5d6x100" },
    electrum: { chance: 50, amount: "5d4x100" },
    gold: { chance: 50, amount: "3d6x100" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 25, amount: "1d6" },
    jewelry: { chance: 25, amount: "1d6" },
    magic: { chance: 10, amount: 1 },
  },
  C: {
    copper: { chance: 60, amount: "6d6x100" },
    silver: { chance: 60, amount: "5d4x100" },
    electrum: { chance: 30, amount: "2d6x100" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 25, amount: "1d4" },
    jewelry: { chance: 25, amount: "1d4" },
    magic: { chance: 15, amount: 2 },
  },
  D: {
    copper: { chance: 30, amount: "4d6x100" },
    silver: { chance: 45, amount: "6d6x100" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 90, amount: "5d8x100" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 30, amount: "1d8" },
    jewelry: { chance: 30, amount: "1d8" },
    magic: { chance: 20, amount: 2 },
  },
  E: {
    copper: { chance: 30, amount: "2d8x100" },
    silver: { chance: 60, amount: "6d10x100" },
    electrum: { chance: 50, amount: "3d8x100" },
    gold: { chance: 50, amount: "4d10x100" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 10, amount: "1d10" },
    jewelry: { chance: 10, amount: "1d10" },
    magic: { chance: 30, amount: 4 },
  },
  F: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 40, amount: "3d8x100" },
    electrum: { chance: 50, amount: "4d8x100" },
    gold: { chance: 85, amount: "6d10x100" },
    platinum: { chance: 70, amount: "2d8x100" },
    gems: { chance: 20, amount: "2d12" },
    jewelry: { chance: 10, amount: "1d12" },
    magic: { chance: 35, amount: 4 },
  },
  G: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 0, amount: "0" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 90, amount: "4d6x1000" },
    platinum: { chance: 75, amount: "5d8x100" },
    gems: { chance: 25, amount: "3d6" },
    jewelry: { chance: 25, amount: "1d10" },
    magic: { chance: 50, amount: 4 },
  },
  H: {
    copper: { chance: 0, amount: "8d10x100" }, // Dragon treasure - varies by age
    silver: { chance: 0, amount: "6d10x1000" },
    electrum: { chance: 0, amount: "3d10x1000" },
    gold: { chance: 0, amount: "5d8x1000" },
    platinum: { chance: 0, amount: "9d8x100" },
    gems: { chance: 0, amount: "1d100" },
    jewelry: { chance: 0, amount: "10d4" },
    magic: { chance: 0, amount: 4 },
  },
  I: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 0, amount: "0" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 80, amount: "3d10x100" },
    gems: { chance: 50, amount: "2d6" },
    jewelry: { chance: 50, amount: "2d6" },
    magic: { chance: 15, amount: 1 },
  },
  J: {
    copper: { chance: 45, amount: "3d8" },
    silver: { chance: 45, amount: "1d8" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 0, amount: "0" },
    jewelry: { chance: 0, amount: "0" },
    magic: { chance: 0, amount: 0 },
  },
  K: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 90, amount: "2d10" },
    electrum: { chance: 35, amount: "1d8" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 0, amount: "0" },
    jewelry: { chance: 0, amount: "0" },
    magic: { chance: 0, amount: 0 },
  },
  L: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 0, amount: "0" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 50, amount: "1d4" },
    jewelry: { chance: 0, amount: "0" },
    magic: { chance: 0, amount: 0 },
  },
  M: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 0, amount: "0" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 90, amount: "4d10x100" },
    platinum: { chance: 90, amount: "2d8x1000" },
    gems: { chance: 55, amount: "5d4" },
    jewelry: { chance: 45, amount: "2d6" },
    magic: { chance: 40, amount: 2 },
  },
  N: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 0, amount: "0" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 0, amount: "0" },
    jewelry: { chance: 0, amount: "0" },
    magic: { chance: 50, amount: 4 },
  },
  O: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 0, amount: "0" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 0, amount: "0" },
    jewelry: { chance: 0, amount: "0" },
    magic: { chance: 50, amount: 1 },
  },
};

const INDIVIDUAL_TREASURE_CONFIGS: Record<
  IndividualTreasureType,
  IndividualTreasureConfig
> = {
  P: {
    copper: { amount: "3d8" },
    silver: { amount: "0" },
    electrum: { amount: "0" },
    gold: { amount: "0" },
    platinum: { amount: "0" },
    gems: { amount: "0" },
    jewelry: { amount: "0" },
    magic: { amount: 0 },
  },
  Q: {
    copper: { amount: "0" },
    silver: { amount: "3d6" },
    electrum: { amount: "0" },
    gold: { amount: "0" },
    platinum: { amount: "0" },
    gems: { amount: "0" },
    jewelry: { amount: "0" },
    magic: { amount: 0 },
  },
  R: {
    copper: { amount: "0" },
    silver: { amount: "0" },
    electrum: { amount: "2d6" },
    gold: { amount: "0" },
    platinum: { amount: "0" },
    gems: { amount: "0" },
    jewelry: { amount: "0" },
    magic: { amount: 0 },
  },
  S: {
    copper: { amount: "0" },
    silver: { amount: "0" },
    electrum: { amount: "0" },
    gold: { amount: "2d4" },
    platinum: { amount: "0" },
    gems: { amount: "0" },
    jewelry: { amount: "0" },
    magic: { amount: 0 },
  },
  T: {
    copper: { amount: "0" },
    silver: { amount: "0" },
    electrum: { amount: "0" },
    gold: { amount: "0" },
    platinum: { amount: "1d6" },
    gems: { amount: "0" },
    jewelry: { amount: "0" },
    magic: { amount: 0 },
  },
  U: {
    copper: { amount: "1d20", chance: 50 },
    silver: { amount: "1d20", chance: 50 },
    electrum: { amount: "0" },
    gold: { amount: "1d20", chance: 25 },
    platinum: { amount: "0" },
    gems: { amount: "1d4", chance: 5 },
    jewelry: { amount: "1d4", chance: 5 },
    magic: { amount: 1, chance: 2 },
  },
  V: {
    copper: { amount: "0" },
    silver: { amount: "1d20", chance: 25 },
    electrum: { amount: "1d20", chance: 25 },
    gold: { amount: "1d20", chance: 50 },
    platinum: { amount: "1d20", chance: 25 },
    gems: { amount: "1d4", chance: 10 },
    jewelry: { amount: "1d4", chance: 10 },
    magic: { amount: 1, chance: 5 },
  },
};

const UNGUARDED_TREASURE_CONFIGS: Record<
  UnguardedTreasureLevel,
  TreasureConfig
> = {
  1: {
    copper: { chance: 75, amount: "1d8x100" },
    silver: { chance: 50, amount: "1d6x100" },
    electrum: { chance: 25, amount: "1d4x100" },
    gold: { chance: 7, amount: "1d4x100" },
    platinum: { chance: 1, amount: "1d4x100" },
    gems: { chance: 7, amount: "1d4" },
    jewelry: { chance: 3, amount: "1d4" },
    magic: { chance: 2, amount: 1 },
  },
  2: {
    copper: { chance: 50, amount: "1d10x100" },
    silver: { chance: 50, amount: "1d8x100" },
    electrum: { chance: 25, amount: "1d6x100" },
    gold: { chance: 20, amount: "1d6x100" },
    platinum: { chance: 2, amount: "1d4x100" },
    gems: { chance: 10, amount: "1d6" },
    jewelry: { chance: 7, amount: "1d4" },
    magic: { chance: 5, amount: 1 },
  },
  3: {
    copper: { chance: 30, amount: "2d6x100" },
    silver: { chance: 50, amount: "1d10x100" },
    electrum: { chance: 25, amount: "1d8x100" },
    gold: { chance: 50, amount: "1d6x100" },
    platinum: { chance: 4, amount: "1d4x100" },
    gems: { chance: 15, amount: "1d6" },
    jewelry: { chance: 7, amount: "1d6" },
    magic: { chance: 8, amount: 1 },
  },
  4: {
    copper: { chance: 20, amount: "3d6x100" },
    silver: { chance: 50, amount: "2d6x100" },
    electrum: { chance: 25, amount: "1d10x100" },
    gold: { chance: 50, amount: "2d6x100" },
    platinum: { chance: 8, amount: "1d4x100" },
    gems: { chance: 20, amount: "1d8" },
    jewelry: { chance: 10, amount: "1d6" },
    magic: { chance: 12, amount: 1 },
  },
  5: {
    copper: { chance: 20, amount: "3d6x100" },
    silver: { chance: 50, amount: "2d6x100" },
    electrum: { chance: 25, amount: "1d10x100" },
    gold: { chance: 50, amount: "2d6x100" },
    platinum: { chance: 8, amount: "1d4x100" },
    gems: { chance: 20, amount: "1d8" },
    jewelry: { chance: 10, amount: "1d6" },
    magic: { chance: 12, amount: 1 },
  },
  6: {
    copper: { chance: 15, amount: "4d6x100" },
    silver: { chance: 50, amount: "3d6x100" },
    electrum: { chance: 25, amount: "1d12x100" },
    gold: { chance: 70, amount: "2d8x100" },
    platinum: { chance: 15, amount: "1d4x100" },
    gems: { chance: 30, amount: "1d8" },
    jewelry: { chance: 15, amount: "1d6" },
    magic: { chance: 16, amount: 1 },
  },
  7: {
    copper: { chance: 15, amount: "4d6x100" },
    silver: { chance: 50, amount: "3d6x100" },
    electrum: { chance: 25, amount: "1d12x100" },
    gold: { chance: 70, amount: "2d8x100" },
    platinum: { chance: 15, amount: "1d4x100" },
    gems: { chance: 30, amount: "1d8" },
    jewelry: { chance: 15, amount: "1d6" },
    magic: { chance: 16, amount: 1 },
  },
  8: {
    copper: { chance: 10, amount: "5d6x100" },
    silver: { chance: 50, amount: "5d6x100" },
    electrum: { chance: 25, amount: "2d8x100" },
    gold: { chance: 75, amount: "4d6x100" },
    platinum: { chance: 30, amount: "1d4x100" },
    gems: { chance: 40, amount: "1d8" },
    jewelry: { chance: 30, amount: "1d8" },
    magic: { chance: 20, amount: 1 },
  },
};

// Gem generation tables (BFRPG-compliant)
const GEM_TYPES = [
  { name: "Ornamental", baseValue: 10, chance: 20, dice: "1d10" },
  { name: "Semiprecious", baseValue: 50, chance: 45, dice: "1d8" },
  { name: "Fancy", baseValue: 100, chance: 75, dice: "1d6" },
  { name: "Precious", baseValue: 500, chance: 95, dice: "1d4" },
  { name: "Gem", baseValue: 1000, chance: 99, dice: "1d2" },
  { name: "Jewel", baseValue: 5000, chance: 100, dice: "1" },
];

const MAGIC_ITEM_TYPES = [
  "Potion",
  "Scroll",
  "Wand",
  "Ring",
  "Armor",
  "Weapon",
  "Miscellaneous",
];

// Generation functions
function generateCurrency(
  config: TreasureConfig | IndividualTreasureConfig,
  result: TreasureResult
): void {
  const currencies = [
    "copper",
    "silver",
    "electrum",
    "gold",
    "platinum",
  ] as const;

  currencies.forEach((currency) => {
    const currencyConfig = config[currency];
    if (currencyConfig.amount !== "0") {
      // Handle individual treasure (no chance roll needed)
      if (
        !("chance" in currencyConfig) ||
        currencyConfig.chance === undefined
      ) {
        const amount = roller(currencyConfig.amount).total;
        result[currency] = amount;
        if (amount > 0) {
          result.breakdown.push(`${currency}: ${amount} pieces`);
        }
      } else {
        // Handle lair/unguarded treasure (chance roll required)
        if (rollPercentage() <= currencyConfig.chance) {
          const amount = roller(currencyConfig.amount).total;
          result[currency] = amount;
          result.breakdown.push(`${currency}: ${amount} pieces`);
        }
      }
    }
  });
}

function generateGem(): string {
  const roll = rollPercentage();
  let gemType = GEM_TYPES[0]!; // Default to ornamental

  for (const type of GEM_TYPES) {
    if (roll <= type.chance) {
      gemType = type;
      break;
    }
  }

  const value = gemType.baseValue + roller("1d10").total - 1; // Slight value variation
  return `${gemType.name} Gem (${value} gp)`;
}

function generateJewelry(): string {
  const baseValue = 50 + roller("3d6").total * 10;
  return `Jewelry Piece (${baseValue} gp)`;
}

function generateMagicItem(): string {
  const itemType =
    MAGIC_ITEM_TYPES[Math.floor(Math.random() * MAGIC_ITEM_TYPES.length)];
  return `${itemType} (identify required)`;
}

function generateGemsAndJewelry(
  config: TreasureConfig,
  result: TreasureResult
): void {
  // Gems
  if (rollPercentage() <= config.gems.chance) {
    const gemCount = roller(config.gems.amount).total;
    for (let i = 0; i < gemCount; i++) {
      result.gemsAndJewelry.push(generateGem());
    }
    result.breakdown.push(`Gems: ${gemCount} generated`);
  }

  // Jewelry
  if (rollPercentage() <= config.jewelry.chance) {
    const jewelryCount = roller(config.jewelry.amount).total;
    for (let i = 0; i < jewelryCount; i++) {
      result.gemsAndJewelry.push(generateJewelry());
    }
    result.breakdown.push(`Jewelry: ${jewelryCount} generated`);
  }
}

function generateMagicItems(
  config: TreasureConfig,
  result: TreasureResult
): void {
  if (rollPercentage() <= config.magic.chance) {
    const itemCount = config.magic.amount;
    for (let i = 0; i < itemCount; i++) {
      result.magicItems.push(generateMagicItem());
    }
    result.breakdown.push(`Magic Items: ${itemCount} generated`);
  }
}

export function generateLairTreasure(type: LairTreasureType): TreasureResult {
  const result: TreasureResult = {
    type: "Lair",
    level: type,
    copper: 0,
    silver: 0,
    electrum: 0,
    gold: 0,
    platinum: 0,
    gemsAndJewelry: [],
    magicItems: [],
    description: `Lair Treasure Type ${type}`,
    breakdown: [],
  };

  const config = LAIR_TREASURE_CONFIGS[type];

  generateCurrency(config, result);
  generateGemsAndJewelry(config, result);
  generateMagicItems(config, result);

  return result;
}

export function generateIndividualTreasure(
  type: IndividualTreasureType
): TreasureResult {
  const result: TreasureResult = {
    type: "Individual",
    level: type,
    copper: 0,
    silver: 0,
    electrum: 0,
    gold: 0,
    platinum: 0,
    gemsAndJewelry: [],
    magicItems: [],
    description: `Individual Treasure Type ${type}`,
    breakdown: [],
  };

  const config = INDIVIDUAL_TREASURE_CONFIGS[type];

  generateCurrency(config, result);

  // Handle gems, jewelry, and magic for U and V types
  if (type === "U" || type === "V") {
    if (config.gems.chance && rollPercentage() <= config.gems.chance) {
      const gemCount = roller(config.gems.amount).total;
      for (let i = 0; i < gemCount; i++) {
        result.gemsAndJewelry.push(generateGem());
      }
    }

    if (config.jewelry.chance && rollPercentage() <= config.jewelry.chance) {
      const jewelryCount = roller(config.jewelry.amount).total;
      for (let i = 0; i < jewelryCount; i++) {
        result.gemsAndJewelry.push(generateJewelry());
      }
    }

    if (config.magic.chance && rollPercentage() <= config.magic.chance) {
      result.magicItems.push(generateMagicItem());
    }
  }

  return result;
}

export function generateUnguardedTreasure(
  level: UnguardedTreasureLevel
): TreasureResult {
  const result: TreasureResult = {
    type: "Unguarded",
    level: level.toString(),
    copper: 0,
    silver: 0,
    electrum: 0,
    gold: 0,
    platinum: 0,
    gemsAndJewelry: [],
    magicItems: [],
    description: `Unguarded Treasure Level ${level}`,
    breakdown: [],
  };

  const config = UNGUARDED_TREASURE_CONFIGS[level];

  generateCurrency(config, result);
  generateGemsAndJewelry(config, result);
  generateMagicItems(config, result);

  return result;
}

export function generateTreasure(
  type: TreasureType,
  subtype: LairTreasureType | IndividualTreasureType | UnguardedTreasureLevel
): TreasureResult {
  switch (type) {
    case "lair":
      return generateLairTreasure(subtype as LairTreasureType);
    case "individual":
      return generateIndividualTreasure(subtype as IndividualTreasureType);
    case "unguarded":
      return generateUnguardedTreasure(subtype as UnguardedTreasureLevel);
    default:
      throw new Error(`Unknown treasure type: ${type}`);
  }
}

// ============================================================================
// TREASURE DISPLAY UTILITIES
// ============================================================================

export function formatTreasureResult(treasure: TreasureResult): string {
  const parts: string[] = [];

  // Add description
  parts.push(`**${treasure.description}**\n`);

  // Add coins
  const coins: string[] = [];
  if (treasure.platinum > 0) coins.push(`${treasure.platinum} pp`);
  if (treasure.gold > 0) coins.push(`${treasure.gold} gp`);
  if (treasure.electrum > 0) coins.push(`${treasure.electrum} ep`);
  if (treasure.silver > 0) coins.push(`${treasure.silver} sp`);
  if (treasure.copper > 0) coins.push(`${treasure.copper} cp`);

  if (coins.length > 0) {
    parts.push(`**Coins:** ${coins.join(", ")}`);
  }

  // Add gems and jewelry
  if (treasure.gemsAndJewelry.length > 0) {
    parts.push(`**Gems & Jewelry:**`);
    treasure.gemsAndJewelry.forEach((item) => {
      parts.push(`• ${item}`);
    });
  }

  // Add magic items
  if (treasure.magicItems.length > 0) {
    parts.push(`**Magic Items:**`);
    treasure.magicItems.forEach((item) => {
      parts.push(`• ${item}`);
    });
  }

  // Add breakdown if requested
  if (treasure.breakdown.length > 0) {
    parts.push(`\n**Generation Details:**`);
    treasure.breakdown.forEach((detail) => {
      parts.push(`• ${detail}`);
    });
  }

  return parts.join("\n");
}

export function getCoinsToDisplay(treasure: TreasureResult) {
  return COIN_CONFIGS.filter((coin) => {
    const key = coin.key as keyof Pick<
      TreasureResult,
      "copper" | "silver" | "electrum" | "gold" | "platinum"
    >;
    return treasure[key] > 0;
  }).map((coin) => {
    const key = coin.key as keyof Pick<
      TreasureResult,
      "copper" | "silver" | "electrum" | "gold" | "platinum"
    >;
    return {
      ...coin,
      amount: treasure[key],
    };
  });
}

export function hasCoins(treasure: TreasureResult): boolean {
  return COIN_CONFIGS.some((coin) => {
    const key = coin.key as keyof Pick<
      TreasureResult,
      "copper" | "silver" | "electrum" | "gold" | "platinum"
    >;
    return treasure[key] > 0;
  });
}

export function getTotalCoinValue(treasure: TreasureResult): number {
  // Note: Minimal currency conversion to avoid circular dependency
  return calculateTotalGoldValue(treasure);
}
