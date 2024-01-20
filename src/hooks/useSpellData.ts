import { classes } from "@/data/classes";
import React from "react";
import { CharData, ClassNames } from "@/data/definitions";
import { classSplit, getClassType } from "@/support/classSupport";

export function useSpellData() {
  const [hasSpellBudget, setHasSpellBudget] = React.useState(false);

  const checkSpellCaster = (character: CharData) => {
    const classArr = classSplit(character.class);
    return classArr.some((c) => {
      const classData = classes[c as ClassNames];
      return (
        (classData &&
          classData.spellBudget &&
          classData.spellBudget.length > 0) ||
        (getClassType(character.class) === "custom" && character.spells.length)
      );
    });
  };

  const isSpellCaster = React.useCallback(
    (character: CharData) => {
      const result = checkSpellCaster(character);
      if (result !== hasSpellBudget) {
        setHasSpellBudget(result);
      }
      return result;
    },
    [hasSpellBudget],
  );

  return { isSpellCaster };
}
