import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { SIZE_STYLES } from "@/constants/designTokens";
import type { Character } from "@/types/character";

interface WeightProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Carrying capacity tables based on strength and race
const CARRYING_CAPACITY = {
  // Dwarf, Elf, Human
  normal: {
    3: { light: 25, heavy: 60 },
    4: { light: 35, heavy: 90 },
    5: { light: 35, heavy: 90 },
    6: { light: 50, heavy: 120 },
    7: { light: 50, heavy: 120 },
    8: { light: 50, heavy: 120 },
    9: { light: 60, heavy: 150 },
    10: { light: 60, heavy: 150 },
    11: { light: 60, heavy: 150 },
    12: { light: 60, heavy: 150 },
    13: { light: 65, heavy: 165 },
    14: { light: 65, heavy: 165 },
    15: { light: 65, heavy: 165 },
    16: { light: 70, heavy: 180 },
    17: { light: 70, heavy: 180 },
    18: { light: 80, heavy: 195 },
  },
  // Halfling
  halfling: {
    3: { light: 20, heavy: 40 },
    4: { light: 30, heavy: 60 },
    5: { light: 30, heavy: 60 },
    6: { light: 40, heavy: 80 },
    7: { light: 40, heavy: 80 },
    8: { light: 40, heavy: 80 },
    9: { light: 50, heavy: 100 },
    10: { light: 50, heavy: 100 },
    11: { light: 50, heavy: 100 },
    12: { light: 50, heavy: 100 },
    13: { light: 55, heavy: 110 },
    14: { light: 55, heavy: 110 },
    15: { light: 55, heavy: 110 },
    16: { light: 60, heavy: 120 },
    17: { light: 60, heavy: 120 },
    18: { light: 65, heavy: 130 },
  },
};

function getCarryingCapacity(race: string, strengthScore: number) {
  const isHalfling = race.toLowerCase() === 'halfling';
  const table = isHalfling ? CARRYING_CAPACITY.halfling : CARRYING_CAPACITY.normal;
  
  // Clamp strength score to table bounds
  const clampedStr = Math.max(3, Math.min(18, strengthScore));
  return table[clampedStr as keyof typeof table];
}

function calculateTotalWeight(character: Character): number {
  // Calculate equipment weight
  const equipmentWeight = character.equipment.reduce((total, item) => {
    return total + (item.weight * item.amount);
  }, 0);

  // Calculate coin weight if enabled
  let coinWeight = 0;
  if (character.settings?.useCoinWeight) {
    // 1 gold piece = 1/20th of a pound
    const totalCoins = 
      (character.currency.gold || 0) +
      (character.currency.silver || 0) +
      (character.currency.copper || 0) +
      (character.currency.electrum || 0) +
      (character.currency.platinum || 0);
    
    coinWeight = totalCoins / 20;
  }

  return equipmentWeight + coinWeight;
}

function getLoadStatus(currentWeight: number, lightCapacity: number, heavyCapacity: number): {
  status: 'light' | 'heavy' | 'overloaded';
  color: string;
} {
  if (currentWeight <= lightCapacity) {
    return { status: 'light', color: 'text-green-400' };
  } else if (currentWeight <= heavyCapacity) {
    return { status: 'heavy', color: 'text-yellow-400' };
  } else {
    return { status: 'overloaded', color: 'text-red-400' };
  }
}

export default function Weight({
  character,
  className = "",
  size = "md",
}: WeightProps) {
  const currentSize = SIZE_STYLES[size];
  const totalWeight = calculateTotalWeight(character);
  const capacity = getCarryingCapacity(character.race, character.abilities.strength.value);
  const loadStatus = getLoadStatus(totalWeight, capacity.light, capacity.heavy);

  const getStatusText = () => {
    switch (loadStatus.status) {
      case 'light':
        return 'Lightly Loaded';
      case 'heavy':
        return 'Heavily Loaded';
      case 'overloaded':
        return 'Overloaded';
    }
  };

  return (
    <CharacterSheetSectionWrapper
      title="Weight"
      size={size}
      className={className}
    >
      <div className={currentSize.container}>
        <div className="space-y-4">
          {/* Current Weight vs Capacity */}
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-2xl font-mono font-bold text-zinc-100">
                {totalWeight.toFixed(1)}
              </span>
              <span className="text-lg text-zinc-400 font-mono">/</span>
              <span className="text-lg font-mono text-zinc-300">
                {capacity.heavy}
              </span>
              <span className="text-sm text-zinc-500">lbs</span>
            </div>
            
            {/* Load Status */}
            <div className={`font-semibold text-sm ${loadStatus.color}`}>
              {getStatusText()}
            </div>
          </div>

          {/* Weight Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Equipment:</span>
              <span className="font-mono">
                {character.equipment.reduce((total, item) => total + (item.weight * item.amount), 0).toFixed(1)} lbs
              </span>
            </div>
            
            {character.settings?.useCoinWeight && (
              <div className="flex justify-between text-zinc-400">
                <span>Coins:</span>
                <span className="font-mono">
                  {(((character.currency.gold || 0) + (character.currency.silver || 0) + (character.currency.copper || 0) + (character.currency.electrum || 0) + (character.currency.platinum || 0)) / 20).toFixed(1)} lbs
                </span>
              </div>
            )}
            
            <hr className="border-zinc-600" />
            
            <div className="flex justify-between text-zinc-300 font-semibold">
              <span>Total:</span>
              <span className="font-mono">{totalWeight.toFixed(1)} lbs</span>
            </div>
          </div>

          {/* Capacity Indicators */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Light Load:</span>
              <span className="font-mono">{capacity.light} lbs</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Heavy Load:</span>
              <span className="font-mono">{capacity.heavy} lbs</span>
            </div>
          </div>

          {/* Visual Weight Bar */}
          <div className="w-full bg-zinc-700 rounded-full h-2">
            <div className="relative h-full">
              {/* Light capacity zone */}
              <div
                className="absolute left-0 top-0 h-full bg-green-500/50 rounded-full"
                style={{ width: `${Math.min(100, (capacity.light / capacity.heavy) * 100)}%` }}
              />
              
              {/* Current weight indicator */}
              <div
                className={`absolute top-0 h-full rounded-full transition-all duration-300 ${
                  loadStatus.status === 'light' ? 'bg-green-400' :
                  loadStatus.status === 'heavy' ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${Math.min(100, (totalWeight / capacity.heavy) * 100)}%` }}
              />
              
              {/* Overload indicator */}
              {totalWeight > capacity.heavy && (
                <div className="absolute right-0 top-0 w-1 h-full bg-red-500 rounded-full" />
              )}
            </div>
          </div>
        </div>
      </div>
    </CharacterSheetSectionWrapper>
  );
}