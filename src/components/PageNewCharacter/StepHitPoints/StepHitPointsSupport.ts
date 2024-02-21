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
  const { race } = character;
  // Some races require the character's hit dice to be incremented or decremented
  const incrementChecker = (dice: DiceTypes) => {
    // The index of the character's hit die in the diceArr
    let diceIndex = diceArr.indexOf(dice);
    // The max index a character's hit die is allowed to be in the diceArr
    const diceMaxIndex = diceArr.indexOf(
      races[race as RaceNames]?.maximumHitDice ?? DiceTypes.D20,
    );
    if (races[race as RaceNames]?.incrementHitDie) {
      diceIndex++;
    }
    if (races[race as RaceNames]?.decrementHitDie) {
      diceIndex--;
    }
    // If a character's hit die is greater than the max allowed hit die, set it to the max allowed hit die
    if (diceIndex > diceMaxIndex) {
      diceIndex = diceMaxIndex;
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
