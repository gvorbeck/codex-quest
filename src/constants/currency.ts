/**
 * Unified currency configuration for the entire application
 * Based on official Basic Fantasy Role-Playing Game rules
 * 
 * Official conversion rates:
 * - 1 platinum piece (pp) = 5 gold pieces (gp)
 * - 1 gold piece (gp) = 10 silver pieces (sp) 
 * - 1 electrum piece (ep) = 5 silver pieces (sp)
 * - 1 silver piece (sp) = 10 copper pieces (cp)
 */

// Base conversion rates (all to copper as base unit for precise calculations)
export const CURRENCY_TO_COPPER_RATES = {
  platinum: 500,  // 1 pp = 5 gp = 50 sp = 500 cp
  gold: 100,      // 1 gp = 10 sp = 100 cp  
  electrum: 50,   // 1 ep = 5 sp = 50 cp
  silver: 10,     // 1 sp = 10 cp
  copper: 1       // 1 cp = 1 cp
} as const;

// UI display configuration with consistent styling
export const CURRENCY_UI_CONFIG = [
  { 
    key: 'platinum' as const, 
    label: 'Platinum', 
    abbrev: 'pp', 
    color: 'from-slate-300 to-slate-500', 
    ring: 'ring-slate-400/30',
    textColor: 'text-purple-600' 
  },
  { 
    key: 'gold' as const, 
    label: 'Gold', 
    abbrev: 'gp', 
    color: 'from-yellow-300 to-yellow-600', 
    ring: 'ring-yellow-400/30',
    textColor: 'text-yellow-600' 
  },
  { 
    key: 'electrum' as const, 
    label: 'Electrum', 
    abbrev: 'ep', 
    color: 'from-amber-200 to-amber-500', 
    ring: 'ring-amber-400/30',
    textColor: 'text-blue-600' 
  },
  { 
    key: 'silver' as const, 
    label: 'Silver', 
    abbrev: 'sp', 
    color: 'from-gray-200 to-gray-400', 
    ring: 'ring-gray-400/30',
    textColor: 'text-gray-600' 
  },
  { 
    key: 'copper' as const, 
    label: 'Copper', 
    abbrev: 'cp', 
    color: 'from-orange-400 to-orange-700', 
    ring: 'ring-orange-400/30',
    textColor: 'text-orange-600' 
  },
] as const;

// Type definitions
export type CurrencyKey = typeof CURRENCY_UI_CONFIG[number]['key'];
export type CurrencyAbbreviation = typeof CURRENCY_UI_CONFIG[number]['abbrev'];

// Currency order for display (highest to lowest value)
export const CURRENCY_ORDER: readonly CurrencyKey[] = ['platinum', 'gold', 'electrum', 'silver', 'copper'] as const;

// Helper function to get currency configuration by key
export function getCurrencyConfig(key: CurrencyKey) {
  return CURRENCY_UI_CONFIG.find(config => config.key === key);
}

// Helper function to get currency abbreviation
export function getCurrencyAbbreviation(key: CurrencyKey): string {
  return getCurrencyConfig(key)?.abbrev ?? key;
}

// Helper function to validate currency amounts (must be non-negative whole numbers)
export function validateCurrencyAmount(amount: number): number {
  return Math.max(0, Math.floor(amount));
}