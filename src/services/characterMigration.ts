// Character migration service for handling legacy data formats
import { logger } from '@/utils/logger';
import { EQUIPMENT_CATEGORIES, CURRENCY_TYPES } from '@/constants/gameData';

const CURRENT_VERSION = 2;

// Types for legacy character data
interface LegacyAbilities {
  modifiers?: Record<string, string>;
  scores?: Record<string, number>;
  [key: string]: unknown;
}

interface LegacyHp {
  points?: number;
  max?: number;
  desc?: string;
  current?: number;
  [key: string]: unknown;
}

interface LegacySettings {
  version?: number;
  useCoinWeight?: boolean;
}

interface LegacyEquipmentItem {
  name?: string;
  costValue?: number;
  costCurrency?: string;
  weight?: number;
  category?: string;
  amount?: number;
  [key: string]: unknown;
}

interface LegacyCharacterData {
  name?: string;
  race?: string;
  class?: string | string[];
  level?: number;
  xp?: number;
  abilities?: LegacyAbilities;
  gold?: number;
  silver?: number;
  copper?: number;
  electrum?: number;
  platinum?: number;
  hp?: LegacyHp;
  equipment?: LegacyEquipmentItem[];
  settings?: LegacySettings;
  useCoinWeight?: boolean;
  wearing?: boolean;
  [key: string]: unknown;
}

/**
 * Type guard to check if character data is in legacy format
 */
export function isLegacyCharacter(data: LegacyCharacterData): boolean {
  // Check for legacy format indicators
  const hasLegacyAbilities = 
    data['abilities']?.modifiers && 
    data['abilities']?.scores;
  
  const hasLegacyCurrency = 
    typeof data['gold'] === 'number' || 
    typeof data['silver'] === 'number' || 
    typeof data['copper'] === 'number';
  
  const hasLegacyHp = 
    data['hp']?.points !== undefined;

  const isNewVersion = data['settings']?.version === CURRENT_VERSION;
  
  return (hasLegacyAbilities || hasLegacyCurrency || hasLegacyHp) && !isNewVersion;
}

/**
 * Convert class name to proper lowercase ID using standardized rules
 */
function convertClassToId(className: string): string {
  if (!className) return '';
  
  return className
    .toLowerCase()
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ''); // Remove any non-alphanumeric characters except hyphens
}

/**
 * Convert race name to proper lowercase ID using standardized rules
 */
function convertRaceToId(raceName: string): string {
  if (!raceName) return '';
  
  return raceName
    .toLowerCase()
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ''); // Remove any non-alphanumeric characters except hyphens
}

/**
 * Migrate legacy character data to current format
 */
export function migrateLegacyCharacter(legacyData: LegacyCharacterData): LegacyCharacterData {
  const migrated = { ...legacyData };

  // Migrate abilities from separate modifiers/scores to combined structure
  if (legacyData['abilities']?.modifiers && legacyData['abilities']?.scores) {
    migrated['abilities'] = {};
    const abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    
    for (const ability of abilityNames) {
      const score = legacyData['abilities']?.scores?.[ability] || 0;
      const modifierStr = legacyData['abilities']?.modifiers?.[ability] || "+0";
      const modifier = parseInt(modifierStr.replace('+', ''), 10) || 0;
      
      migrated['abilities'][ability] = {
        value: score,
        modifier: modifier
      };
    }
  }

  // Migrate currency from separate properties to nested object
  const currency: Record<string, number> = { gold: 0 };
  if (typeof legacyData['gold'] === 'number') currency['gold'] = legacyData['gold'];
  if (typeof legacyData['silver'] === 'number') currency['silver'] = legacyData['silver'];
  if (typeof legacyData['copper'] === 'number') currency['copper'] = legacyData['copper'];
  if (typeof legacyData['electrum'] === 'number') currency['electrum'] = legacyData['electrum'];
  if (typeof legacyData['platinum'] === 'number') currency['platinum'] = legacyData['platinum'];
  
  migrated['currency'] = currency;

  // Clean up old currency properties
  delete migrated['gold'];
  delete migrated['silver'];
  delete migrated['copper'];
  delete migrated['electrum'];
  delete migrated['platinum'];

  // Migrate HP structure
  if (legacyData['hp']) {
    migrated['hp'] = {
      current: legacyData['hp'].points || legacyData['hp'].max || 0,
      max: legacyData['hp'].max || 0,
      ...(legacyData['hp'].desc && { desc: legacyData['hp'].desc })
    };
  }

  // Migrate equipment - ensure it's an array and has required properties
  if (!Array.isArray(migrated['equipment'])) {
    migrated['equipment'] = [];
  } else {
    // Standardize equipment entries
    migrated['equipment'] = migrated['equipment'].map((item: LegacyEquipmentItem) => ({
      name: item.name || "Unknown Item",
      costValue: item.costValue || 0,
      costCurrency: item.costCurrency || CURRENCY_TYPES.GOLD,
      weight: item.weight || 0,
      category: item.category || EQUIPMENT_CATEGORIES.GENERAL,
      amount: item.amount || 1,
      ...item // Preserve other properties
    }));
  }

  // Ensure required fields exist
  migrated['name'] = migrated['name'] || "Unnamed Character";
  
  // Migrate race name to proper ID
  if (migrated['race']) {
    migrated['race'] = convertRaceToId(migrated['race']);
  } else {
    migrated['race'] = "";
  }
  
  // Migrate class names to proper IDs
  const originalClasses = migrated['class'];
  if (Array.isArray(migrated['class'])) {
    migrated['class'] = migrated['class'].map((className: string) => convertClassToId(className));
  } else {
    const singleClass = migrated['class'] || "";
    migrated['class'] = singleClass ? [convertClassToId(singleClass)] : [""];
  }
  
  // Log class migration if it changed
  if (JSON.stringify(originalClasses) !== JSON.stringify(migrated['class'])) {
    logger.info(`Migrated character classes from ${JSON.stringify(originalClasses)} to ${JSON.stringify(migrated['class'])}`);
  }
  
  migrated['level'] = migrated['level'] || 1;
  migrated['xp'] = migrated['xp'] || 0;

  // Set version and preserve/create settings
  migrated['settings'] = {
    ...migrated['settings'],
    version: CURRENT_VERSION,
    useCoinWeight: migrated['useCoinWeight'] || migrated['settings']?.useCoinWeight || false
  };

  // Clean up legacy properties
  delete migrated['useCoinWeight'];
  delete migrated['wearing'];

  return migrated;
}

/**
 * Process character data and migrate if necessary
 */
export function processCharacterData(data: LegacyCharacterData): LegacyCharacterData {
  if (isLegacyCharacter(data)) {
    logger.debug(`Migrating legacy character: ${data['name'] || 'Unknown'}`);
    return migrateLegacyCharacter(data);
  }
  
  // Ensure current characters have version set
  if (!data['settings']?.version) {
    data['settings'] = { ...data['settings'], version: CURRENT_VERSION };
  }
  
  return data;
}
