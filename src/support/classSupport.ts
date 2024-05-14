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
