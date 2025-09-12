import { 
  GEM_TYPES, 
  GEM_VALUE_ADJUSTMENTS, 
  JEWELRY_TYPES,
  MAGIC_ITEM_CATEGORIES,
  MAGIC_WEAPONS,
  MAGIC_ARMOR,
  SCROLLS,
  WANDS_STAVES_RODS,
  MISCELLANEOUS_ITEMS,
  RARE_ITEMS
} from "./constants";
import { rollPercentage, roller } from "../dice";

export function generateGem(): string {
  const roll = rollPercentage();
  let gemType = "Garnet"; // default
  let baseValue = 10;
  
  for (const [range, gem] of Object.entries(GEM_TYPES)) {
    const rangeParts = range.split('-').map(n => parseInt(n));
    const min = rangeParts[0];
    const max = rangeParts[1];
    if (min !== undefined && max !== undefined && roll >= min && roll <= max) {
      gemType = gem.name;
      baseValue = gem.baseValue;
      break;
    }
  }
  
  // Apply value adjustment (2d6)
  const adjustment = roller("2d6").total;
  let multiplier = 1;
  
  if (adjustment === GEM_VALUE_ADJUSTMENTS.NEXT_LOWER.roll) {
    multiplier = GEM_VALUE_ADJUSTMENTS.NEXT_LOWER.multiplier;
  } else if (adjustment === GEM_VALUE_ADJUSTMENTS.HALF_VALUE.roll) {
    multiplier = GEM_VALUE_ADJUSTMENTS.HALF_VALUE.multiplier;
  } else if (adjustment === GEM_VALUE_ADJUSTMENTS.THREE_QUARTER.roll) {
    multiplier = GEM_VALUE_ADJUSTMENTS.THREE_QUARTER.multiplier;
  } else if (adjustment >= GEM_VALUE_ADJUSTMENTS.NORMAL_MIN && adjustment <= GEM_VALUE_ADJUSTMENTS.NORMAL_MAX) {
    multiplier = 1; // Normal Value
  } else if (adjustment === GEM_VALUE_ADJUSTMENTS.ONE_AND_HALF.roll) {
    multiplier = GEM_VALUE_ADJUSTMENTS.ONE_AND_HALF.multiplier;
  } else if (adjustment === GEM_VALUE_ADJUSTMENTS.DOUBLE.roll) {
    multiplier = GEM_VALUE_ADJUSTMENTS.DOUBLE.multiplier;
  } else if (adjustment === GEM_VALUE_ADJUSTMENTS.NEXT_HIGHER.roll) {
    multiplier = GEM_VALUE_ADJUSTMENTS.NEXT_HIGHER.multiplier;
  }
  
  const finalValue = Math.round(baseValue * multiplier);
  return `${gemType} (${finalValue} gp)`;
}

export function generateJewelry(): string {
  const type = JEWELRY_TYPES[Math.floor(Math.random() * JEWELRY_TYPES.length)]!;
  const baseValue = roller("2d8").total * 100; // Standard jewelry value
  return `${type} (${baseValue} gp)`;
}

export function generateMagicItem(): string {
  const roll = rollPercentage();
  
  if (roll <= MAGIC_ITEM_CATEGORIES.WEAPON) { // Weapon
    const weapon = MAGIC_WEAPONS[Math.floor(Math.random() * MAGIC_WEAPONS.length)]!;
    
    // Determine weapon bonus
    let bonus = "+1";
    const bonusRoll = rollPercentage();
    if (bonusRoll <= 40) bonus = "+1";
    else if (bonusRoll <= 58) bonus = "+2";
    else if (bonusRoll <= 64) bonus = "+3";
    else if (bonusRoll <= 67) bonus = "+4";
    else if (bonusRoll <= 68) bonus = "+5";
    else if (bonusRoll <= 75) bonus = "+1, +2 vs. Special Enemy";
    else if (bonusRoll <= 85) bonus = "+1, +3 vs. Special Enemy";
    else if (bonusRoll <= 95) bonus = "Roll Again + Special Ability";
    else if (bonusRoll <= 98) bonus = "Cursed, -1";
    else bonus = "Cursed, -2";
    
    return `${weapon} ${bonus}`;
  } else if (roll <= MAGIC_ITEM_CATEGORIES.ARMOR) { // Armor
    const armor = MAGIC_ARMOR[Math.floor(Math.random() * MAGIC_ARMOR.length)]!;
    const bonusRoll = rollPercentage();
    let bonus = "+1";
    if (bonusRoll <= 50) bonus = "+1";
    else if (bonusRoll <= 80) bonus = "+2";
    else if (bonusRoll <= 90) bonus = "+3";
    else if (bonusRoll <= 95) bonus = "Cursed";
    else bonus = "Cursed, AC 11";
    
    return `${armor} ${bonus}`;
  } else if (roll <= MAGIC_ITEM_CATEGORIES.SCROLL) { // Scroll
    return SCROLLS[Math.floor(Math.random() * SCROLLS.length)]!;
  } else if (roll <= MAGIC_ITEM_CATEGORIES.WAND_STAFF_ROD) { // Wand, Staff, or Rod
    return WANDS_STAVES_RODS[Math.floor(Math.random() * WANDS_STAVES_RODS.length)]!;
  } else if (roll <= MAGIC_ITEM_CATEGORIES.MISCELLANEOUS) { // Miscellaneous Items
    return MISCELLANEOUS_ITEMS[Math.floor(Math.random() * MISCELLANEOUS_ITEMS.length)]!;
  } else { // Rare Items
    return RARE_ITEMS[Math.floor(Math.random() * RARE_ITEMS.length)]!;
  }
}