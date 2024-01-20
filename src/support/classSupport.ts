import { classes } from "@/data/classes";
import { Abilities, CharData, ClassNames, RaceNames } from "@/data/definitions";
import { races } from "@/data/races";
import { isStandardRace } from "./raceSupport";

export const isStandardClass = (className: string) =>
  Object.values(ClassNames).includes(className as ClassNames);

export const classSplit = (characterClass: string | string[]) => {
  if (typeof characterClass === "string") {
    return characterClass.split(" ");
  }
  return characterClass;
};

export const getClassType = (characterClass: string[] | string) => {
  const classArr = classSplit(characterClass);

  // NONE
  if (classArr.length === 0 || classArr.every((className) => className === ""))
    return "none";
  // STANDARD
  if (
    classArr.length === 1 &&
    classArr.every((className) => isStandardClass(className))
  ) {
    return "standard";
  }
  // COMBINATION
  if (
    classArr.length === 1 &&
    classArr[0].split(" ").every((className) => isStandardClass(className))
  ) {
    return "combination";
  }
  if (
    classArr.length > 1 &&
    classArr.every((className) => isStandardClass(className))
  ) {
    return "combination";
  }
  // CUSTOM
  return "custom";
};

export const baseClasses = [
  ClassNames.CLERIC,
  ClassNames.FIGHTER,
  ClassNames.MAGICUSER,
  ClassNames.THIEF,
];

export const getClassSelectOptions = (
  character: CharData,
  useBase: boolean = true,
) => {
  // Extract required properties from character
  const raceKey = character.race;
  const abilityScores = character.abilities?.scores;

  // Get the list of enabled classes
  const enabledClasses = getEnabledClasses(
    raceKey as RaceNames,
    abilityScores,
  ).filter((className) =>
    useBase ? baseClasses.includes(className) : className,
  );

  return Object.keys(classes)
    .filter((className) => enabledClasses.includes(className as ClassNames))
    .sort((a, b) =>
      classes[a as keyof typeof classes].name >
      classes[b as keyof typeof classes].name
        ? 1
        : -1,
    )
    .map((className) => ({ value: className, label: className }));
};

export const getEnabledClasses = (
  raceKey: RaceNames,
  abilityScores: Abilities,
) => {
  const race = isStandardRace(raceKey) ? races[raceKey] : undefined;
  let classList = Object.values(ClassNames);
  if (!race) return classList;
  classList = classList
    .filter((className) => race.allowedStandardClasses.indexOf(className) > -1)
    .filter((className) => {
      const classSetup = classes[className];
      if (classSetup.minimumAbilityRequirements) {
        for (const ability of Object.keys(
          classSetup.minimumAbilityRequirements,
        ) as (keyof Abilities)[]) {
          const requirement = classSetup.minimumAbilityRequirements[ability];
          if (requirement && +abilityScores[ability] < requirement) {
            return false;
          }
        }
      }
      return true;
    });
  return classList;
};
