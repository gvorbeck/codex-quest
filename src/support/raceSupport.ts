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
  useBase: boolean = true,
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

export const baseClasses = [
  RaceNames.DWARF,
  RaceNames.ELF,
  RaceNames.HALFLING,
  RaceNames.HUMAN,
];

export const isStandardRace = (raceName: string, isBase = false) => {
  if (!raceName) return false;
  if (isBase) return Object.values(baseClasses).includes(raceName as RaceNames);
  return Object.values(RaceNames).includes(raceName as RaceNames);
};
