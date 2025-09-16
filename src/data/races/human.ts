import type { Race } from "@/types";

export const human: Race = {
  name: "Human",
  id: "human",
  description:
    "Humans come in a broad variety of shapes and sizes; the Game Master must decide what sorts of Humans live in the game world. Humans learn unusually quickly, gaining a bonus of 10% to all experience points earned.",
  physicalDescription:
    "Humans come in a broad variety of shapes and sizes; the Game Master must decide what sorts of Humans live in the game world. An average Human male in good health stands around six feet tall and weighs about 175 pounds, while females average five feet nine inches and weigh around 145 pounds. Most Humans live around 75 years.",
  allowedClasses: [
    "cleric",
    "fighter",
    "magic-user",
    "thief",
    "assassin",
    "barbarian",
    "druid",
    "illusionist",
    "necromancer",
    "ranger",
    "paladin",
    "scout",
    "spellcrafter",
  ],
  abilityRequirements: [],
  prohibitedWeapons: [],
  specialAbilities: [
    {
      name: "Fast Learning",
      description:
        "Humans learn unusually quickly, gaining a bonus of 10% to all experience points earned",
      effects: {
        experienceBonus: {
          value: 10,
        },
      },
    },
  ],
  savingThrows: [],
  lifespan: "Around 75 years",
  languages: ["Common"],
  carryingCapacity: {
    light: 60,
    heavy: 150,
    strengthModifier: {
      positive: 0.1, // +10% per +1 STR modifier
      negative: 0.2, // -20% per -1 STR modifier
    },
  },
  supplementalContent: false,
};
