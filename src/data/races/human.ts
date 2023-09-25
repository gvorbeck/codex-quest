import { ClassNames } from "../definitions";
import { RaceSetup } from "./definitions";

export const human: RaceSetup = {
  name: "Human",
  allowedStandardClasses: [...(Object.values(ClassNames) as ClassNames[])],
  details: {
    description:
      'Humans come in a broad variety of shapes and sizes; the Game Master must decide what sorts of Humans live in the game world. An average Human male in good health stands around six feet tall and weighs about 175 pounds, while females average five feet nine inches and weigh around 145 pounds. Most Humans live around 75 years.\n\n**Restrictions**: Humans may be any single class. They have no minimum or maximum ability score requirements.\n\n**Special Abilities**: Humans learn unusually quickly, gaining a bonus of 10% to all experience points earned.\n\n**Saving Throws**: Humans are the "standard," and thus have no saving throw bonuses.',
    specials: [
      "**Humans** learn unusually quickly, gaining a bonus of 10% to all experience points earned.",
    ],
    restrictions: [],
  },
};
