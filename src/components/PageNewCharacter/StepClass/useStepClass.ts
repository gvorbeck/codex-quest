import { CharData, ClassNames } from "@/data/definitions";
import { RaceSetup } from "@/data/races/definitions";
import { SelectProps } from "antd";
import React from "react";

export function useStepClass(character: CharData) {
  const [customClassInput, setCustomClassInput] = React.useState<string>("");
  const [classSelector, setClassSelector] = React.useState<string>(
    character.class[0],
  );
  const [startingSpells, setStartingSpells] = React.useState<string[]>([]);
  const [secondClass, setSecondClass] = React.useState<ClassNames | undefined>(
    undefined,
  );
  const [supplementalContentSwitch, setSupplementalContentSwitch] =
    React.useState<boolean>(false);
  const [classSelectOptions, setClassSelectOptions] = React.useState<
    SelectProps["options"]
  >([]);
  const firstClass = ClassNames.MAGICUSER;

  const adjustHitDice = (hitDie: string, raceSetup: RaceSetup) => {
    const diceSizes = ["d4", "d6", "d8", "d10", "d12", "d20"];
    const classHitDieIndex = diceSizes.indexOf(hitDie);
    hitDie = raceSetup.incrementHitDie
      ? diceSizes[classHitDieIndex + 1]
      : diceSizes[classHitDieIndex - 1];
    return hitDie;
  };
  return {
    customClassInput,
    setCustomClassInput,
    classSelector,
    setClassSelector,
    startingSpells,
    setStartingSpells,
    secondClass,
    setSecondClass,
    supplementalContentSwitch,
    setSupplementalContentSwitch,
    classSelectOptions,
    setClassSelectOptions,
    firstClass,
    adjustHitDice,
  };
}
