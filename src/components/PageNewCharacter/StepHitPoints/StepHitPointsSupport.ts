import { classes } from "@/data/classes";
import { CharData, ClassNames, DiceTypes, RaceNames } from "@/data/definitions";
import { races } from "@/data/races";
import { classSplit, getClassType } from "@/support/classSupport";

export const getCharacterHitDiceFromClass = (character: CharData) => {
  const diceArr = [
    DiceTypes.D3,
    DiceTypes.D4,
    DiceTypes.D6,
    DiceTypes.D8,
    DiceTypes.D10,
    DiceTypes.D12,
    DiceTypes.D20,
  ];
  const classArr = classSplit(character.class);
  const classType = getClassType(classArr);
  // Some races require the character's hit dice to be incremented or decremented
  const incrementChecker = (dice: DiceTypes) => {
    let diceIndex = diceArr.indexOf(dice);
    if (races[character.race as RaceNames]?.incrementHitDie) {
      diceIndex++;
    }
    if (races[character.race as RaceNames]?.decrementHitDie) {
      diceIndex--;
    }
    return diceArr[diceIndex];
  };
  if (classType === "combination") {
    if (classArr.includes(ClassNames.FIGHTER)) {
      return incrementChecker(DiceTypes.D6);
    }
    if (classArr.includes(ClassNames.THIEF)) {
      return incrementChecker(DiceTypes.D4);
    }
  } else if (classType === "standard") {
    return incrementChecker(classes[classArr[0] as ClassNames].hitDice);
  }
  return undefined;
};
