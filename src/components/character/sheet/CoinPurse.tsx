import { EditableValue } from "@/components/ui/inputs";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { Card } from "@/components/ui/design-system";
import { SIZE_STYLES } from "@/constants/designTokens";
import type { Character } from "@/types/character";

interface CoinPurseProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onCurrencyChange?: (currency: Partial<Character["currency"]>) => void;
}

interface CurrencyConversions {
  pp: number; // 1 pp = 5 gp
  gp: number; // 1 gp = 10 sp
  ep: number; // 1 ep = 5 sp
  sp: number; // 1 sp = 10 cp
  cp: number; // base unit
}

const CURRENCY_VALUES: CurrencyConversions = {
  pp: 50, // 1 pp = 5 gp = 50 cp
  gp: 10, // 1 gp = 10 sp = 100 cp
  ep: 5,  // 1 ep = 5 sp = 50 cp
  sp: 1,  // 1 sp = 10 cp
  cp: 0.1 // 1 cp = 0.1 sp
};

// Currency definitions for UI display
const CURRENCY_DEFINITIONS = [
  { key: 'platinum' as const, label: 'Platinum', abbrev: 'pp', color: 'from-slate-300 to-slate-500', ring: 'ring-slate-400/30', icon: '⚪' },
  { key: 'gold' as const, label: 'Gold', abbrev: 'gp', color: 'from-yellow-300 to-yellow-600', ring: 'ring-yellow-400/30', icon: '🟡' },
  { key: 'electrum' as const, label: 'Electrum', abbrev: 'ep', color: 'from-amber-200 to-amber-500', ring: 'ring-amber-400/30', icon: '🟠' },
  { key: 'silver' as const, label: 'Silver', abbrev: 'sp', color: 'from-gray-200 to-gray-400', ring: 'ring-gray-400/30', icon: '⚫' },
  { key: 'copper' as const, label: 'Copper', abbrev: 'cp', color: 'from-orange-400 to-orange-700', ring: 'ring-orange-400/30', icon: '🟤' },
] as const;

// Convert fractional amounts to smaller denominations
function convertFractionalCurrency(
  amount: number,
  currencyType: keyof CurrencyConversions,
  currentCurrency: Character["currency"]
): Partial<Character["currency"]> {
  if (amount === Math.floor(amount)) {
    // No fractional part, return as-is
    return { [currencyType]: amount };
  }

  const fractionalPart = amount - Math.floor(amount);
  const wholePart = Math.floor(amount);
  const updates: Partial<Character["currency"]> = { [currencyType]: wholePart };

  // Convert fractional part to copper pieces (base unit)
  const fractionalInCopper = Math.round(fractionalPart * CURRENCY_VALUES[currencyType] * 10);

  if (fractionalInCopper > 0) {
    // Try to convert to the next smaller denomination
    if (currencyType === 'pp') {
      // Convert to gold pieces
      const goldFromFraction = Math.floor(fractionalInCopper / 10);
      if (goldFromFraction > 0) {
        updates.gold = (currentCurrency.gold || 0) + goldFromFraction;
        const remainingCopper = fractionalInCopper - (goldFromFraction * 10);
        if (remainingCopper > 0) {
          updates.copper = (currentCurrency.copper || 0) + remainingCopper;
        }
      } else {
        updates.copper = (currentCurrency.copper || 0) + fractionalInCopper;
      }
    } else if (currencyType === 'gp') {
      // Convert to silver pieces
      const silverFromFraction = Math.floor(fractionalInCopper / 1);
      if (silverFromFraction > 0) {
        updates.silver = (currentCurrency.silver || 0) + silverFromFraction;
        const remainingCopper = fractionalInCopper - silverFromFraction;
        if (remainingCopper > 0) {
          updates.copper = (currentCurrency.copper || 0) + remainingCopper;
        }
      } else {
        updates.copper = (currentCurrency.copper || 0) + fractionalInCopper;
      }
    } else if (currencyType === 'ep') {
      // Convert to silver pieces (1 ep = 5 sp, so fractional ep becomes silver)
      const silverFromFraction = Math.floor(fractionalInCopper / 1);
      if (silverFromFraction > 0) {
        updates.silver = (currentCurrency.silver || 0) + silverFromFraction;
        const remainingCopper = fractionalInCopper - silverFromFraction;
        if (remainingCopper > 0) {
          updates.copper = (currentCurrency.copper || 0) + remainingCopper;
        }
      } else {
        updates.copper = (currentCurrency.copper || 0) + fractionalInCopper;
      }
    } else if (currencyType === 'sp') {
      // Convert to copper pieces
      updates.copper = (currentCurrency.copper || 0) + fractionalInCopper;
    }
  }

  return updates;
}

export default function CoinPurse({
  character,
  className = "",
  size = "md",
  editable = false,
  onCurrencyChange,
}: CoinPurseProps) {
  const currentSize = SIZE_STYLES[size];

  const handleCurrencyChange = (currencyType: keyof Character["currency"]) => (value: number) => {
    if (!onCurrencyChange) return;

    // Convert fractional amounts to smaller denominations
    const updates = convertFractionalCurrency(value, currencyType as keyof CurrencyConversions, character.currency);
    onCurrencyChange(updates);
  };

  return (
    <CharacterSheetSectionWrapper
      title="Coin Purse"
      size={size}
      className={className}
    >
      <div className={currentSize.container}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRENCY_DEFINITIONS.map(({ key, label, abbrev, color, ring, icon }) => {
            const value = character.currency[key] || 0;
            
            return (
              <Card
                key={key}
                variant="nested"
                size="compact"
                className={`
                  relative group transition-all duration-200 hover:scale-105
                  bg-gradient-to-br ${color} p-[2px] shadow-lg
                  ring-2 ${ring} group-hover:ring-4 group-hover:shadow-xl
                `}
              >
                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-[10px] p-3">
                  {/* Header with coin icon and label */}
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="text-lg leading-none" 
                      role="img" 
                      aria-label={`${label} coin`}
                    >
                      {icon}
                    </span>
                    <label 
                      htmlFor={`currency-${key}`}
                      className="text-xs font-semibold text-white drop-shadow-sm"
                    >
                      {label}
                    </label>
                    <span className="text-[10px] font-mono text-zinc-300 ml-auto">
                      {abbrev}
                    </span>
                  </div>
                  
                  {/* Value input/display using EditableValue */}
                  <EditableValue
                    value={value}
                    onChange={handleCurrencyChange(key)}
                    editable={editable}
                    minValue={0}
                    maxValue={999999}
                    size="sm"
                    ariaLabel={`${label} pieces`}
                    showEditIcon={false}
                    displayValue={value.toLocaleString()}
                    displayClassName="bg-zinc-800/90 border-2 border-zinc-600/50 rounded-lg px-3 py-2 text-sm min-h-[36px] flex items-center justify-center font-mono text-zinc-100 shadow-inner"
                    inputClassName="text-center font-mono !bg-zinc-800/90 !border-zinc-600/50 hover:!border-zinc-500 focus:!bg-zinc-700/90"
                    displayProps={{
                      id: `currency-${key}`,
                      "aria-describedby": `currency-${key}-description`,
                    }}
                  />
                  
                  {/* Screen reader description */}
                  <div 
                    id={`currency-${key}-description`}
                    className="sr-only"
                  >
                    {editable ? `Current ${label} amount: ${value.toLocaleString()}. Click to edit.` : `${value.toLocaleString()} ${label} pieces`}
                  </div>
                </div>
                
                {/* Subtle shimmer effect on hover */}
                <div className={`
                  absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                  bg-gradient-to-r from-transparent via-white/10 to-transparent
                  animate-pulse transition-opacity duration-300
                  pointer-events-none
                `} />
              </Card>
            );
          })}
        </div>
      </div>
    </CharacterSheetSectionWrapper>
  );
}