import { classes } from "@/data/classes";
import { classSplit } from "@/support/characterSupport";
import React from "react";
import { ClassNames } from "@/data/definitions";

export function useSpellData() {
  const [hasSpellBudget, setHasSpellBudget] = React.useState(false);

  const checkSpellCaster = (charClass: string | string[]) => {
    const classArr = classSplit(charClass);
    return classArr.some((c) => {
      const classData = classes[c as ClassNames];
      return (
        classData && classData.spellBudget && classData.spellBudget.length > 0
      );
    });
  };

  const isSpellCaster = React.useCallback(
    (charClass: string | string[]) => {
      const result = checkSpellCaster(charClass);
      if (result !== hasSpellBudget) {
        setHasSpellBudget(result);
      }
      return result;
    },
    [hasSpellBudget],
  );

  return { isSpellCaster };
}
