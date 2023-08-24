import {
  Abilities,
  AbilityTypes,
} from "../components/CreateCharacter/CharacterAbilities/definitions";
import { ClassNames, RaceNames } from "../components/definitions";
import { ClassNamesTwo, classes } from "../data/classes";
import { RaceNamesTwo, races } from "../data/races";

export const getClassType = (characterClass: string) => {
  // Split the class string by space to check for combination classes
  const classes = characterClass.split(" ");

  // Check if all parts of the class string are standard classes
  const allStandard = classes.every((cls: string) =>
    Object.values(ClassNames).includes(cls as ClassNames)
  );

  if (allStandard) {
    // If there's only one class and it's standard
    if (classes.length === 1) return "standard";
    // If there are two different standard classes
    if (classes.length === 2 && classes[0] !== classes[1]) return "combination";
  }

  // If it's neither standard nor combination, it's custom
  return "custom";
};

export const isStandardRace = (characterRace: string) => {
  // Check if the race is a standard race
  const isStandard = Object.values(RaceNames).includes(
    characterRace as RaceNames
  );

  // Return true if it's a standard race, false otherwise
  return isStandard;
};

export function getDisabledClasses(
  raceKey: RaceNamesTwo,
  abilities: Abilities
): ClassNamesTwo[] {
  const race = races[raceKey];
  const disabledClasses = [];

  // Check if the race is defined
  if (!race) return [];

  for (const className of Object.values(ClassNamesTwo)) {
    const classSetup = classes[className];

    // Check if the class is allowed for the race
    if (
      !race.allowedStandardClasses?.includes(className) &&
      !race.allowedCombinationClasses?.includes(className)
    ) {
      disabledClasses.push(className);
      continue;
    }

    // Check ability requirements
    if (classSetup.minimumAbilityRequirements) {
      for (const ability of Object.keys(
        classSetup.minimumAbilityRequirements
      ) as (keyof AbilityTypes)[]) {
        const requirement = classSetup.minimumAbilityRequirements[ability];
        if (requirement && +abilities.scores[ability] < requirement) {
          disabledClasses.push(className);
          break;
        }
      }
    }
  }

  return disabledClasses;
}
