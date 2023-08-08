import { ClassNames } from "../components/definitions";

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
