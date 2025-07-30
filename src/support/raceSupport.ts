import { races } from "@/data/races";

export const isStandardRace = (raceName: string, isBase?: boolean) => {
  if (!raceName) return false;
  const race = races[raceName as keyof typeof races];
  if (!race) return false;
  if (isBase) return race.isBase;
  return true;
};
