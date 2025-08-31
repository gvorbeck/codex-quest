import { SectionWrapper } from "@/components/ui/layout";
import { StatusIndicator } from "@/components/ui/display";
import { SIZE_STYLES } from "@/constants/designTokens";
import type { Character } from "@/types/character";
import type { StatusThreshold } from "@/components/ui/display/StatusIndicator";

interface WeightProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Carrying capacity tables based on strength and race
const CARRYING_CAPACITY = {
  // Dwarf, Elf, Human - corrected from BFRPG table
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
  const isHalfling = race.toLowerCase() === "halfling";
  const table = isHalfling
    ? CARRYING_CAPACITY.halfling
    : CARRYING_CAPACITY.normal;

  // Clamp strength score to table bounds
  const clampedStr = Math.max(3, Math.min(18, strengthScore));
  return table[clampedStr as keyof typeof table];
}

function calculateTotalWeight(character: Character): number {
  // Calculate equipment weight (excluding beasts of burden which don't count as carried weight)
  const equipmentWeight = character.equipment.reduce((total, item) => {
    if (item.category === "beasts-of-burden") {
      return total; // Beasts of burden don't add to carried weight
    }
    return total + item.weight * item.amount;
  }, 0);

  // Calculate coin weight if enabled (defaults to true)
  let coinWeight = 0;
  const shouldUseCoinWeight = character.settings?.useCoinWeight !== false;
  if (shouldUseCoinWeight) {
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

function calculateBeastCapacity(character: Character): {
  lightCapacity: number;
  heavyCapacity: number;
} {
  return character.equipment.reduce(
    (total, item) => {
      if (item.category === "beasts-of-burden" && item.amount > 0) {
        const lightCap = (item.lowCapacity || 0) * item.amount;
        const heavyCap = (item.capacity || 0) * item.amount;

        return {
          lightCapacity: total.lightCapacity + lightCap,
          heavyCapacity: total.heavyCapacity + heavyCap,
        };
      }
      return total;
    },
    { lightCapacity: 0, heavyCapacity: 0 }
  );
}

function createWeightThresholds(
  lightCapacity: number,
  heavyCapacity: number
): StatusThreshold[] {
  const lightPercentage = (lightCapacity / heavyCapacity) * 100;

  return [
    {
      min: 100.1,
      max: Infinity,
      textColor: "text-red-400",
      barColor: "bg-red-500",
      label: "Overloaded",
    },
    {
      min: lightPercentage,
      max: 100.1,
      textColor: "text-yellow-400",
      barColor: "bg-yellow-500",
      label: "Heavily Loaded",
    },
    {
      min: 0,
      max: lightPercentage,
      textColor: "text-lime-400",
      barColor: "bg-lime-500",
      label: "Lightly Loaded",
    },
  ];
}

export default function Weight({
  character,
  className = "",
  size = "md",
}: WeightProps) {
  const currentSize = SIZE_STYLES[size];
  const totalWeight = calculateTotalWeight(character);
  const pcCapacity = getCarryingCapacity(
    character.race,
    character.abilities.strength.value
  );
  const beastCapacity = calculateBeastCapacity(character);

  // Combined capacity (PC + beasts of burden)
  const totalCapacity = {
    light: pcCapacity.light + beastCapacity.lightCapacity,
    heavy: pcCapacity.heavy + beastCapacity.heavyCapacity,
  };

  const weightThresholds = createWeightThresholds(
    totalCapacity.light,
    totalCapacity.heavy
  );

  // Calculate breakdown for display
  const equipmentWeight = character.equipment.reduce((total, item) => {
    if (item.category === "beasts-of-burden") {
      return total; // Don't count beasts in equipment weight
    }
    return total + item.weight * item.amount;
  }, 0);
  const coinWeight =
    character.settings?.useCoinWeight !== false
      ? ((character.currency.gold || 0) +
          (character.currency.silver || 0) +
          (character.currency.copper || 0) +
          (character.currency.electrum || 0) +
          (character.currency.platinum || 0)) /
        20
      : 0;

  // Check if character has any beasts of burden
  const hasBeasts = character.equipment.some(
    (item) => item.category === "beasts-of-burden" && item.amount > 0
  );

  return (
    <SectionWrapper
      title="Weight"
      size={size}
      className={className}
    >
      <div className={currentSize.container}>
        <div className="space-y-4">
          {/* Current Weight vs Capacity */}
          <div className="text-center">
            <div
              className="flex items-baseline justify-center gap-2 mb-3"
              role="group"
              aria-label={`Current weight: ${totalWeight.toFixed(
                1
              )} pounds out of ${totalCapacity.heavy} pound maximum capacity`}
            >
              <span className="text-2xl font-mono font-bold text-zinc-100">
                {totalWeight.toFixed(1)}
              </span>
              <span
                className="text-lg text-zinc-400 font-mono"
                aria-hidden="true"
              >
                /
              </span>
              <span className="text-lg font-mono text-zinc-300">
                {totalCapacity.heavy}
              </span>
              <span className="text-sm text-zinc-500">lbs</span>
            </div>

            {/* Load Status with StatusIndicator */}
            <StatusIndicator
              current={totalWeight}
              max={totalCapacity.heavy}
              thresholds={weightThresholds}
              showBar={true}
              showLabel={true}
              className="mt-2"
            />
          </div>

          {/* Weight Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Equipment:</span>
              <span className="font-mono">
                {equipmentWeight.toFixed(1)} lbs
              </span>
            </div>

            {character.settings?.useCoinWeight !== false && (
              <div className="flex justify-between text-zinc-400">
                <span>Coins:</span>
                <span className="font-mono">{coinWeight.toFixed(1)} lbs</span>
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
            {hasBeasts ? (
              <>
                {/* PC Capacity */}
                <div className="flex justify-between text-zinc-400">
                  <span>PC Light Load:</span>
                  <span className="font-mono">{pcCapacity.light} lbs</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>PC Heavy Load:</span>
                  <span className="font-mono">{pcCapacity.heavy} lbs</span>
                </div>

                {/* Beast Capacity */}
                <div className="flex justify-between text-zinc-400">
                  <span>Animal Light Load:</span>
                  <span className="font-mono">
                    {beastCapacity.lightCapacity} lbs
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Animal Heavy Load:</span>
                  <span className="font-mono">
                    {beastCapacity.heavyCapacity} lbs
                  </span>
                </div>

                <hr className="border-zinc-600" />

                {/* Total Capacity */}
                <div className="flex justify-between text-zinc-300 font-semibold">
                  <span>Total Light Load:</span>
                  <span className="font-mono">{totalCapacity.light} lbs</span>
                </div>
                <div className="flex justify-between text-zinc-300 font-semibold">
                  <span>Total Heavy Load:</span>
                  <span className="font-mono">{totalCapacity.heavy} lbs</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between text-zinc-400">
                  <span>Light Load Max:</span>
                  <span className="font-mono">{pcCapacity.light} lbs</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Heavy Load Max:</span>
                  <span className="font-mono">{pcCapacity.heavy} lbs</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
