// Character migration service for handling legacy data formats
const CURRENT_VERSION = 2;

/**
 * Type guard to check if character data is in legacy format
 */
export function isLegacyCharacter(data: Record<string, any>): boolean {
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
 * Migrate legacy character data to current format
 */
export function migrateLegacyCharacter(legacyData: Record<string, any>): Record<string, any> {
  const migrated = { ...legacyData };

  // Migrate abilities from separate modifiers/scores to combined structure
  if (legacyData['abilities']?.modifiers && legacyData['abilities']?.scores) {
    migrated['abilities'] = {};
    const abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    
    for (const ability of abilityNames) {
      const score = legacyData['abilities'].scores[ability] || 0;
      const modifierStr = legacyData['abilities'].modifiers[ability] || "+0";
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
      desc: legacyData['hp'].desc || undefined
    };
  }

  // Migrate equipment - ensure it's an array and has required properties
  if (!Array.isArray(migrated['equipment'])) {
    migrated['equipment'] = [];
  } else {
    // Standardize equipment entries
    migrated['equipment'] = migrated['equipment'].map((item: any) => ({
      name: item.name || "Unknown Item",
      costValue: item.costValue || 0,
      costCurrency: item.costCurrency || "gp",
      weight: item.weight || 0,
      category: item.category || "general-equipment",
      amount: item.amount || 1,
      ...item // Preserve other properties
    }));
  }

  // Ensure required fields exist
  migrated['name'] = migrated['name'] || "Unnamed Character";
  migrated['race'] = migrated['race'] || "";
  migrated['class'] = Array.isArray(migrated['class']) ? migrated['class'] : [migrated['class'] || ""];
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
export function processCharacterData(data: any): any {
  if (isLegacyCharacter(data)) {
    console.log(`Migrating legacy character: ${data['name'] || 'Unknown'}`);
    return migrateLegacyCharacter(data);
  }
  
  // Ensure current characters have version set
  if (!data['settings']?.version) {
    data['settings'] = { ...data['settings'], version: CURRENT_VERSION };
  }
  
  return data;
}
