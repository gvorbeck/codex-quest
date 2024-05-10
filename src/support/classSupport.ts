import { classes } from "@/data/classes";

export const isStandardClass = (classNameArray: string[], isBase?: boolean) => {
  if (!classNameArray || classNameArray.length === 0) return false;
  return classNameArray.every((className) => {
    const classDetails = classes[className as keyof typeof classes];
    if (!classDetails) return false;
    if (isBase && !classDetails.isBase) return false;
    return true;
  });
};

// export const classSplit = (className: string | string[]) => {
//   if (typeof className === "string") {
//     return className.split(" ");
//   }
//   return className;
// };

type ClassDefKey =
  | "base"
  | "combination"
  | "standard"
  | "supplemental"
  | "none"
  | "custom";
type ClassTypeResult = ClassDefKey[];
export const getClassType = (classNameArray: string[]): ClassTypeResult => {
  const CLASS_DEFS: { [key: string]: ClassDefKey } = {
    base: "base",
    combo: "combination",
    standard: "standard",
    supplemental: "supplemental",
  };
  // NONE
  if (
    classNameArray.length === 0 ||
    classNameArray.every((className) => className === "")
  )
    return ["none"];
  // STANDARD
  if (classNameArray.length === 1) {
    if (isStandardClass(classNameArray, true)) {
      return [CLASS_DEFS.standard, CLASS_DEFS.base];
    }
    if (isStandardClass(classNameArray)) {
      return [CLASS_DEFS.standard, CLASS_DEFS.supplemental];
    }
  }
  // COMBINATION
  if (classNameArray.length > 1) {
    if (isStandardClass(classNameArray, true)) {
      return [CLASS_DEFS.combo, CLASS_DEFS.base];
    }
    if (isStandardClass(classNameArray)) {
      return [CLASS_DEFS.combo, CLASS_DEFS.supplemental];
    }
  }
  // CUSTOM
  return ["custom"];
};

// export const baseClasses = [
//   ClassNames.CLERIC,
//   ClassNames.FIGHTER,
//   ClassNames.MAGICUSER,
//   ClassNames.THIEF,
// ];

// export const getClassSelectOptions = (
//   character: CharData,
//   useBase: boolean = true,
// ) => {
//   // Extract required properties from character
//   const raceKey = character.race;
//   const abilityScores = character.abilities?.scores;

//   // Get the list of enabled classes
//   const enabledClasses = getEnabledClasses(
//     raceKey as RaceNames,
//     abilityScores,
//   ).filter((className) =>
//     useBase ? baseClasses.includes(className) : className,
//   );

//   return Object.keys(classes)
//     .filter((className) => enabledClasses.includes(className as ClassNames))
//     .sort((a, b) =>
//       classes[a as keyof typeof classes].name >
//       classes[b as keyof typeof classes].name
//         ? 1
//         : -1,
//     )
//     .map((className) => ({ value: className, label: className }));
// };

// export const getEnabledClasses = (
//   raceKey: RaceNames,
//   abilityScores: Abilities,
// ) => {
//   const race = isStandardRace(raceKey) ? races[raceKey] : undefined;
//   let classList = Object.values(ClassNames);
//   if (!race) return classList;
//   classList = classList
//     .filter((className) => race.allowedStandardClasses.indexOf(className) > -1)
//     .filter((className) => {
//       const classSetup = classes[className];
//       if (classSetup.minimumAbilityRequirements) {
//         for (const ability of Object.keys(
//           classSetup.minimumAbilityRequirements,
//         ) as (keyof Abilities)[]) {
//           const requirement = classSetup.minimumAbilityRequirements[ability];
//           if (requirement && +abilityScores[ability] < requirement) {
//             return false;
//           }
//         }
//       }
//       return true;
//     });
//   return classList;
// };
