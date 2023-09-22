import { useEffect, useState } from "react";
import {
  Abilities,
  AbilityTypes,
} from "../components/CharacterCreator/CharacterAbilities/definitions";
import { classes } from "../data/classes";
import { ClassNames, RaceNames } from "../data/definitions";
import { races } from "../data/races";
import { SavingThrowsType } from "../components/CharacterSheet/SavingThrows/definitions";

export const getClassType = (characterClass: string[]) => {
  // NONE
  if (
    characterClass.length === 0 ||
    characterClass.every((className) => className === "")
  )
    return "none";

  // STANDARD
  if (
    characterClass.length === 1 &&
    characterClass.every((className) => isStandardClass(className))
  ) {
    return "standard";
  }

  // COMBINATION
  if (
    characterClass.length === 1 &&
    characterClass[0]
      .split(" ")
      .every((className) => isStandardClass(className))
  ) {
    return "combination";
  }

  if (
    characterClass.length > 1 &&
    characterClass.every((className) => isStandardClass(className))
  ) {
    return "combination";
  }

  // CUSTOM
  return "custom";
};

export const isStandardClass = (className: string) =>
  Object.values(ClassNames).includes(className as ClassNames);

export const isStandardRace = (raceName: string) =>
  Object.values(RaceNames).includes(raceName as RaceNames);

export function getDisabledClasses(
  raceKey: RaceNames,
  abilities: Abilities
): ClassNames[] {
  const race = races[raceKey];
  const disabledClasses = [];

  // Check if the race is defined
  if (!race) return [];

  for (const className of Object.values(ClassNames)) {
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

// Get the saving throws for a class at a given level
export const getSavingThrows = (className: string, level: number) =>
  classes[className as ClassNames]?.savingThrows.find(
    (savingThrow) => (savingThrow[0] as number) >= level
  )?.[1] as SavingThrowsType;

// Get the total weight of a saving throw object in order to determine "best"
export const getSavingThrowsWeight = (savingThrows: SavingThrowsType) =>
  Object.values(savingThrows).reduce((prev, curr) => prev + curr, 0);

export function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const getHitPointsModifier = (classArr: string[]) => {
  let modifier = 0;
  for (const className of classArr) {
    const classHitDiceModifier =
      classes[className as ClassNames]?.hitDiceModifier;
    if (classHitDiceModifier > modifier) {
      modifier = classHitDiceModifier;
    }
  }
  return modifier;
};
