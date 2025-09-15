import type { 
  TreasureResult, 
  LairTreasureType, 
  IndividualTreasureType, 
  UnguardedTreasureLevel 
} from "./types";
import { 
  LAIR_TREASURE_CONFIGS, 
  INDIVIDUAL_TREASURE_CONFIGS, 
  UNGUARDED_TREASURE_CONFIGS 
} from "./treasureData";
import { rollPercentage, roller } from "../dice";
import { generateGem, generateJewelry, generateMagicItem } from "./itemGenerators";
import { generateAllCurrency, generateIndividualCurrency } from "./currencyGenerator";

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
    breakdown: []
  };

  const config = LAIR_TREASURE_CONFIGS[type];
  
  // Generate coins
  generateAllCurrency(config, result);
  
  // Generate gems
  if (rollPercentage() <= config.gems.chance) {
    const gemCount = roller(config.gems.amount).total;
    for (let i = 0; i < gemCount; i++) {
      result.gemsAndJewelry.push(generateGem());
    }
    result.breakdown.push(`Gems: ${gemCount} generated`);
  }
  
  // Generate jewelry
  if (rollPercentage() <= config.jewelry.chance) {
    const jewelryCount = roller(config.jewelry.amount).total;
    for (let i = 0; i < jewelryCount; i++) {
      result.gemsAndJewelry.push(generateJewelry());
    }
    result.breakdown.push(`Jewelry: ${jewelryCount} generated`);
  }
  
  // Generate magic items
  if (rollPercentage() <= config.magic.chance) {
    for (let i = 0; i < config.magic.amount; i++) {
      result.magicItems.push(generateMagicItem());
    }
    result.breakdown.push(`Magic Items: ${config.magic.amount} generated`);
  }

  return result;
}

export function generateIndividualTreasure(type: IndividualTreasureType): TreasureResult {
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
    breakdown: []
  };

  const config = INDIVIDUAL_TREASURE_CONFIGS[type];
  
  // Generate coins (most individual treasures are guaranteed)
  generateIndividualCurrency(config, result);
  
  // Generate gems and jewelry for U and V types
  if (config.gems.chance && rollPercentage() <= config.gems.chance) {
    const gemCount = roller(config.gems.amount).total;
    for (let i = 0; i < gemCount; i++) {
      result.gemsAndJewelry.push(generateGem());
    }
    result.breakdown.push(`Gems: ${gemCount} generated`);
  }
  
  if (config.jewelry.chance && rollPercentage() <= config.jewelry.chance) {
    const jewelryCount = roller(config.jewelry.amount).total;
    for (let i = 0; i < jewelryCount; i++) {
      result.gemsAndJewelry.push(generateJewelry());
    }
    result.breakdown.push(`Jewelry: ${jewelryCount} generated`);
  }
  
  // Generate magic items for U and V types
  if (config.magic.chance && rollPercentage() <= config.magic.chance) {
    for (let i = 0; i < config.magic.amount; i++) {
      result.magicItems.push(generateMagicItem());
    }
    result.breakdown.push(`Magic Items: ${config.magic.amount} generated`);
  }

  return result;
}

export function generateUnguardedTreasure(level: UnguardedTreasureLevel): TreasureResult {
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
    breakdown: []
  };

  const config = UNGUARDED_TREASURE_CONFIGS[level];
  
  // Generate all treasure types based on chance
  generateAllCurrency(config, result);
  
  if (rollPercentage() <= config.gems.chance) {
    const gemCount = roller(config.gems.amount).total;
    for (let i = 0; i < gemCount; i++) {
      result.gemsAndJewelry.push(generateGem());
    }
    result.breakdown.push(`Gems: ${gemCount} generated`);
  }
  
  if (rollPercentage() <= config.jewelry.chance) {
    const jewelryCount = roller(config.jewelry.amount).total;
    for (let i = 0; i < jewelryCount; i++) {
      result.gemsAndJewelry.push(generateJewelry());
    }
    result.breakdown.push(`Jewelry: ${jewelryCount} generated`);
  }
  
  if (rollPercentage() <= config.magic.chance) {
    for (let i = 0; i < config.magic.amount; i++) {
      result.magicItems.push(generateMagicItem());
    }
    result.breakdown.push(`Magic Items: ${config.magic.amount} generated`);
  }

  return result;
}