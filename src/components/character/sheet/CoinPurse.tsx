import { EditableValue } from "@/components/ui/inputs";
import { SectionWrapper } from "@/components/ui/layout";
import { Card } from "@/components/ui/design-system";
import { Icon } from "@/components/ui/display";
import { SIZE_STYLES } from "@/constants/designTokens";
import { convertToWholeCoins, cleanFractionalCurrency } from "@/utils/currency";
import { CURRENCY_UI_CONFIG, type CurrencyKey } from "@/constants/currency";
import type { Character } from "@/types/character";
import { useEffect } from "react";

interface CoinPurseProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onCurrencyChange?: (currency: Partial<Character["currency"]>) => void;
}


export default function CoinPurse({
  character,
  className = "",
  size = "md",
  editable = false,
  onCurrencyChange,
}: CoinPurseProps) {
  const currentSize = SIZE_STYLES[size];
  
  // Auto-fix fractional currency when component mounts
  useEffect(() => {
    const hasFractionalCurrency = Object.values(character.currency).some(
      amount => amount && !Number.isInteger(amount)
    );
    
    if (hasFractionalCurrency && onCurrencyChange) {
      const cleanedCurrency = cleanFractionalCurrency(character.currency);
      onCurrencyChange(cleanedCurrency);
    }
  }, [character.currency, onCurrencyChange]);

  const handleCurrencyChange = (currencyType: CurrencyKey) => (value: number) => {
    if (!onCurrencyChange) return;

    // Convert fractional amounts to whole coins
    const updates = convertToWholeCoins(value, currencyType, character.currency);
    onCurrencyChange(updates);
  };

  return (
    <SectionWrapper
      title="Coin Purse"
      size={size}
      className={className}
    >
      <div className={currentSize.container}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRENCY_UI_CONFIG.map(({ key, label, abbrev, color, ring }) => {
            const value = character.currency[key] || 0;
            // Display should show actual value - fractional amounts will be auto-converted by useEffect
            
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
                  <div className="flex items-center gap-1 mb-2">
                    <Icon 
                      name="coin" 
                      size="sm" 
                      className="flex-shrink-0"
                      aria-label={`${label} coin`}
                    />
                    <label 
                      htmlFor={`currency-${key}`}
                      className="text-xs font-semibold text-white drop-shadow-sm flex-1 min-w-0"
                    >
                      {label}
                    </label>
                    <span className="text-[10px] font-mono text-zinc-300 ml-1">
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
    </SectionWrapper>
  );
}