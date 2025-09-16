import type { Race } from "@/types";

export const phaerim: Race = {
  name: "Phaerim",
  id: "phaerim",
  description:
    "The beautiful Phaerim are related to fey such as booka, pixies, or similar faeries. Phaerim can be any class but generally gravitate to magical classes. If allowed by the GM, Phaerim will be more likely to pursue classes associated with nature than the standard fare.",
  physicalDescription:
    "Phaerim appear to be smaller than normal Elf-like folk, except that they have a pair of wings resembling those of dragonflies or sometimes butterflies. For unknown reasons, there are at least twice as many Phaerim females as there are males. Phaerim stand no taller than the average Halfling (3') but have a more slight build, seldom being heavier than 40 pounds.",
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
  abilityRequirements: [
    {
      ability: "dexterity",
      min: 9,
    },
    {
      ability: "charisma",
      min: 11,
    },
    {
      ability: "strength",
      max: 15,
    },
  ],
  prohibitedWeapons: ["large"], // May not use Large weapons, must wield Medium weapons with both hands
  specialAbilities: [
    {
      name: "Flight",
      description:
        "Phaerim normally walk like other races, but their most remarkable ability is limited flight while unencumbered (at double the normal movement rates). Phaerim can fly up to 10 rounds, but must remain grounded an equivalent amount of time after any flight. A lightly-encumbered Phaerim can fly up to 5 rounds but must rest for twice as many rounds as those flown.",
    },
    {
      name: "Fall Damage Resistance",
      description:
        "Phaerim take half-damage from falls due to their reduced weight and wings.",
    },
    {
      name: "Natural Hiding",
      description:
        "Similar to halflings, Phaerim are able to hide very effectively; so long as they remain still there is only a 10% chance they will be detected outdoors in forested environments. Even indoors, in dungeons, or in non-preferred terrain they are able to hide such that there is only a 30% chance of detection. Note that a Phaerim Thief will roll for hiding attempts only once, using either the Thief ability or the Phaerim ability, whichever is better.",
    },
    {
      name: "Hit Point Reduction",
      description:
        "Due to their very small stature, Phaerim roll hit dice one size smaller than normal; a d8 would become a d6, a d6 to d4, and a d4 would instead be d3 (d6, 1-2=1, 3-4=2, 5-6=3)",
      effects: {
        hitDiceRestriction: {
          sizeDecrease: 1,
        },
      },
    },
    {
      name: "Weapon Size Restriction",
      description:
        "Phaerim may not use Large weapons, and must wield Medium weapons with both hands.",
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
  lifespan: "Around 300 years",
  languages: ["Common", "Sylvan"],
  carryingCapacity: {
    light: 50,
    heavy: 100,
    strengthModifier: {
      positive: 0.1, // +10% per +1 STR modifier
      negative: 0.2, // -20% per -1 STR modifier
    },
  },
  supplementalContent: true,
};
