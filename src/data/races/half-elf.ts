import type { Race } from "@/types";

export const halfElf: Race = {
  name: "Half-Elf",
  id: "half-elf",
  description:
    "Half-elves are the result of crossbreeding between elves and humans. Half-elves are well tolerated by humans in most cases, but are often shunned (or at best, ignored) by elven society.",
  physicalDescription:
    "An average half-elf male stands around 5 ft. 6 in. in height, with females averaging an inch shorter. They have pointed ears, but their features tend to favor the human parent a bit more than the elf.",
  allowedClasses: ["cleric", "druid", "fighter", "magic-user", "illusionist", "thief", "ranger", "paladin", "fighter-magic-user", "magic-user-thief"],
  abilityRequirements: [
    {
      ability: "intelligence",
      min: 9,
    },
    {
      ability: "constitution",
      max: 17,
    },
  ],
  prohibitedWeapons: [],
  specialAbilities: [
    {
      name: "Darkvision",
      description: "Half-elves have Darkvision with a 30' range",
      effects: {
        darkvision: {
          range: 30,
        },
      },
    },
    {
      name: "Secret Door Detection",
      description:
        "Half-elves are able to find secret doors on a 1-2 on 1d6, but do not find secret doors on a cursory examination as elves do",
    },
    {
      name: "Fast Learning",
      description:
        "Half-elves gain a bonus of +5% on all earned experience, except if the half-elf is a member of a combination class",
      effects: {
        experienceBonus: {
          value: 5,
          conditions: ["not combination class"],
        },
      },
    },
  ],
  savingThrows: [
    {
      type: "Magic Wands",
      bonus: 1,
    },
    {
      type: "Spells",
      bonus: 1,
    },
  ],
  lifespan: "Several centuries",
  languages: ["Common", "Elvish"],
  carryingCapacity: {
    light: 60, // Default human/elf values (no specific rules mentioned)
    heavy: 150,
    strengthModifier: {
      positive: 0.1, // +10% per +1 STR modifier
      negative: 0.2, // -20% per -1 STR modifier
    },
  },
  supplementalContent: true,
};
