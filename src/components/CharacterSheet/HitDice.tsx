import { CharacterDetails } from "../types";

export default function HitDice({ character }: CharacterDetails) {
  const hitDiceModifiers = {
    single: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
    ],
    double: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
    ],
  };
  let hitDice = character.hp.dice;
  let modifier = 0;

  if (!character.class.includes(" ")) {
    modifier =
      character.class === "Cleric" || character.class === "Magic-User"
        ? hitDiceModifiers.single[character.level - 1] || 0
        : hitDiceModifiers.double[character.level - 1] || 0;
  }

  if (character.level < 10) {
    hitDice =
      character.level + hitDice + (modifier !== 0 ? "+" + modifier : "");
  } else {
    hitDice = 9 + hitDice + "+" + modifier;
  }
  console.log("hit dice", hitDice);
  return <div>{hitDice}</div>;
}
