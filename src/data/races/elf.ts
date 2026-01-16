import type { Race } from "@/types";

export const elf: Race = {
  name: "Elf",
  id: "elf",
  description:
    "Elves are typically inquisitive, passionate, self-assured, and sometimes haughty. They are lithe and graceful with keen eyesight and hearing.",
  physicalDescription:
    "Elves are a slender race, with both males and females standing around five feet tall and weighing around 130 pounds. Most have dark hair, with little or no body or facial hair. Their skin is pale, and they have pointed ears and delicate features. Elves are lithe and graceful. They have keen eyesight and hearing.",
  allowedClasses: [
    "cleric",
    "druid",
    "fighter",
    "magic-user",
    "thief",
    "ranger",
    "scout",
    "paladin",
    "fighter-magic-user",
    "magic-user-thief",
  ],
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
  prohibitedWeapons: [], // Elves can use all weapons but have hit point restrictions
  specialAbilities: [
    {
      name: "Darkvision",
      description: "All Elves have Darkvision with a 60' range",
      effects: {
        darkvision: {
          range: 60,
        },
      },
    },
    {
      name: "Secret Door Detection",
      description:
        "Able to find secret doors more often than normal (1-2 on 1d6 rather than the usual 1 on 1d6). An Elf is so observant that one has a 1 on 1d6 chance to find a secret door with a cursory look",
    },
    {
      name: "Ghoul Immunity",
      description: "Elves are immune to the paralyzing attack of ghouls",
    },
    {
      name: "Combat Awareness",
      description:
        "Less likely to be surprised in combat, reducing the chance of surprise by 1 in 1d6",
    },
    {
      name: "Hit Point Restriction",
      description:
        "Elves never roll larger than six-sided dice (d6) for hit points",
      effects: {
        hitDiceRestriction: {
          maxSize: "d6",
        },
      },
    },
  ],
  savingThrows: [
    {
      type: "Paralysis or Petrify",
      bonus: 1,
    },
    {
      type: "Magic Wands",
      bonus: 2,
    },
    {
      type: "Spells",
      bonus: 2,
    },
  ],
  lifespan: "A dozen centuries or more",
  languages: ["Common", "Elvish"],
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
