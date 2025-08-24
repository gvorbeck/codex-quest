import { NumberInput } from "@/components/ui/inputs";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
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

  const currencies = [
    { key: 'platinum' as const, label: 'Platinum', abbrev: 'pp' },
    { key: 'gold' as const, label: 'Gold', abbrev: 'gp' },
    { key: 'electrum' as const, label: 'Electrum', abbrev: 'ep' },
    { key: 'silver' as const, label: 'Silver', abbrev: 'sp' },
    { key: 'copper' as const, label: 'Copper', abbrev: 'cp' },
  ];

  const handleCurrencyChange = (currencyType: keyof Character["currency"]) => (value: number | undefined) => {
    if (!onCurrencyChange || value === undefined) return;

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
          {currencies.map(({ key, label, abbrev }) => {
            const value = character.currency[key] || 0;
            
            return (
              <div key={key} className="flex flex-col">
                <label 
                  htmlFor={`currency-${key}`}
                  className="text-xs font-medium text-zinc-300 mb-1"
                >
                  {label} ({abbrev})
                </label>
                {editable ? (
                  <NumberInput
                    id={`currency-${key}`}
                    value={value}
                    onChange={handleCurrencyChange(key)}
                    minValue={0}
                    size="sm"
                    className="text-center font-mono"
                    aria-label={`${label} pieces`}
                    placeholder="0"
                  />
                ) : (
                  <div className="bg-zinc-800 border-2 border-zinc-600 rounded-lg px-3 py-2 text-sm min-h-[36px] flex items-center justify-center font-mono text-zinc-100">
                    {value}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </CharacterSheetSectionWrapper>
  );
}