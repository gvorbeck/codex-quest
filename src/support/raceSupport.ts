import { CharData, RaceNames } from "@/data/definitions";
import { races } from "@/data/races";
import { RaceSetup } from "@/data/races/definitions";

export const raceIsDisabled = (choice: RaceSetup, character: CharData) =>
  (choice.minimumAbilityRequirements &&
    Object.entries(choice.minimumAbilityRequirements).some(
      ([ability, requirement]) =>
        +character.abilities?.scores[
          ability as keyof typeof character.abilities.scores
        ] < (requirement as number), // Cast requirement to number
    )) ||
  (choice.maximumAbilityRequirements &&
    Object.entries(choice.maximumAbilityRequirements).some(
      ([ability, requirement]) =>
        +character.abilities?.scores[
          ability as keyof typeof character.abilities.scores
        ] > (requirement as number), // Cast requirement to number
    ));

export const getRaceSelectOptions = (
  character: CharData,
  useBase?: boolean,
) => {
  return Object.keys(races)
    .filter((race) => !raceIsDisabled(races[race as RaceNames], character))
    .filter((race) =>
      useBase
        ? [
            RaceNames.DWARF,
            RaceNames.ELF,
            RaceNames.HALFLING,
            RaceNames.HUMAN,
          ].includes(race as RaceNames)
        : race,
    )
    .sort((a, b) =>
      races[a as keyof typeof races].name > races[b as keyof typeof races].name
        ? 1
        : -1,
    )
    .map((race) => ({
      value: race,
      label: race,
    }));
};

export const isStandardRace = (raceName: string, isBase?: boolean) => {
  if (!raceName) return false;
  const race = races[raceName as keyof typeof races];
  if (!race) return false;
  if (isBase) return race.isBase;
  return true;
};
