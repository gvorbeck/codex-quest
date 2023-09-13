import {
  Abilities,
  AbilityTypes,
} from "../components/CreateCharacter/CharacterAbilities/definitions";
import { ClassNamesTwo, classes } from "../data/classes";
import { RaceNamesTwo, races } from "../data/races";

export const getClassType = (characterClass: string[]) => {
  if (characterClass.length === 0 || characterClass[0] === "") return "none";
  // If characterClass is an array with more than one element return "combination"
  if (characterClass.length > 1) return "combination";

  // if characterClass[0] is in `ClassNamesTwo` enum return "standard"
  if (Object.values(ClassNamesTwo).includes(characterClass[0] as ClassNamesTwo))
    return "standard";

  console.log(characterClass);
  return "custom";
};

export const isStandardRace = (characterRace: string) => {
  // Check if the race is a standard race
  const isStandard = Object.values(RaceNamesTwo).includes(
    characterRace as RaceNamesTwo
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
