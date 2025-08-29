export const calculateModifier = (score: number): number => {
  if (score <= 3) return -3;
  if (score <= 5) return -2;
  if (score <= 8) return -1;
  if (score <= 12) return 0;
  if (score <= 15) return 1;
  if (score <= 17) return 2;
  return 3;
};

export const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

export const getAbilityScoreColor = (score: number, allScores: number[]): string => {
  const highestScore = Math.max(...allScores);
  const lowestScore = Math.min(...allScores);

  if (score === highestScore) return "text-lime-400"; // Highest score(s)
  if (score === lowestScore) return "text-red-400"; // Lowest score(s)
  return "text-zinc-400"; // Default
};

// Equipment utilities
import type { Equipment } from "@/types/character";

export const cleanEquipmentArray = (equipment: Equipment[]): Equipment[] => {
  return equipment.filter(item => item.amount > 0);
};

export const ensureEquipmentAmount = (equipment: Equipment): Equipment => {
  return { ...equipment, amount: Math.max(1, equipment.amount || 0) };
};