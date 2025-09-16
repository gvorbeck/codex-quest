import type { Race } from "@/types";

export const canein: Race = {
  name: "Canein",
  id: "canein",
  description:
    "Caneins are a race of dog-like humanoids, known for their extreme sense of loyalty whether to liege, friend, or family. Caneins often form almost knight-like codes and attitudes, often serving a patron in exactly that capacity.",
  physicalDescription:
    "There is a great deal of physical variance among the individual Caneins, with some short and stocky, others leanly-muscled, and variations in the colorations of their coats. However, all Caneins share a similar facial structure similar to the various bulldog or boxer-type dog breeds, having jowls and squat features. Caneins vary in their height, but are rarely larger than the average human.",
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
      ability: "constitution",
      min: 9,
    },
    {
      ability: "intelligence",
      max: 17,
    },
  ],
  prohibitedWeapons: [],
  specialAbilities: [
    {
      name: "Keen Scent",
      description:
        "Caneins have a keen sense of smell, able to identify individuals by their scent alone. This powerful olfactory sense allows the Canein to determine the presence of concealed or invisible creatures, and any penalties associated with combating such foes is halved for the Canein. For instance, a Canein suffers only a -2 penalty when attacking an invisible pixie.",
    },
    {
      name: "Tracking",
      description:
        "All Caneins can track as a Ranger of equivalent level, and an actual Canein Ranger (if the class is allowed by the GM) gets a bonus of +20% on Tracking rolls.",
    },
    {
      name: "Canine Affinity",
      description:
        "Caneins have +2 on any reaction rolls involving other canine creatures. However, Caneins do not like vile beasts such as werewolves, hellhounds, and the like, despite any similarities.",
      effects: {
        reactionBonus: {
          value: 2,
          conditions: ["vs canine creatures"],
        },
      },
    },
  ],
  savingThrows: [
    {
      type: "Death Ray or Poison",
      bonus: 2,
    },
    {
      type: "Paralysis or Petrify",
      bonus: 2,
    },
  ],
  lifespan: "Around 60 years",
  languages: ["Common"],
  carryingCapacity: {
    light: 60,
    heavy: 150,
    strengthModifier: {
      positive: 0.1, // +10% per +1 STR modifier
      negative: 0.2, // -20% per -1 STR modifier
    },
  },
  supplementalContent: true,
};
