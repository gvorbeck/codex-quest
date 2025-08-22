export const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
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