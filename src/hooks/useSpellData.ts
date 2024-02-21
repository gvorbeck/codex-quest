import { classes } from "@/data/classes";
import React from "react";
import { CharData, ClassNames } from "@/data/definitions";
import { classSplit, getClassType } from "@/support/classSupport";
import spells from "@/data/spells.json";

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

  // Return true/false if the character has a spell budget
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

  // Return true/false if the spell name appears in the spells.json
  const isCustomSpell = (spellName: string) => {
    return !spells.some((spell) => spell.name === spellName);
  };

  return { isSpellCaster, isCustomSpell };
}
