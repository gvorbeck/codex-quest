import type { Race } from "@/types/character";

export const faun: Race = {
  name: "Faun",
  id: "faun",
  description:
    "Fauns are a fey-related race that resemble a sort of strange cross of goat with that of a small human or elf-like being. Fauns share the Halfling love of simple agrarian life, especially with respect to vineyards, as they prize wine (among other brews) above most things in life. Fauns love frivolity and are often quite adept at musical pursuits.",
  physicalDescription:
    "Standing only about 4-5 feet tall, they have a human-like torso and head, but the legs and feet of a goat. One can find Fauns with other small features reminiscent of goats such as small horns or large ears.",
  allowedClasses: ["cleric", "fighter", "magic-user", "thief", "assassin", "barbarian", "druid", "illusionist", "necromancer", "ranger", "paladin", "scout", "spellcrafter"],
  abilityRequirements: [
    {
      ability: "constitution",
      min: 9,
    },
    {
      ability: "charisma",
      max: 15,
    },
  ],
  prohibitedWeapons: [],
  specialAbilities: [
    {
      name: "Darkvision",
      description: "Fauns have Darkvision out to 30'",
      effects: {
        darkvision: {
          range: 30,
        },
      },
    },
    {
      name: "Fey Resistance",
      description:
        "They are resistant to charm-like effects from fey beings, getting a +4 bonus on relevant saves. This includes charms of dryads, nixies, and similar beings.",
      effects: {
        savingThrowBonus: {
          value: 4,
          conditions: ["vs fey charm effects"],
        },
      },
    },
    {
      name: "Equipment Restrictions",
      description:
        "Fauns may not wear typical human-style footwear due to their goat legs and hooves.",
    },
  ],
  savingThrows: [
    {
      type: "Death Ray or Poison",
      bonus: 4,
    },
    {
      type: "Magic Wands",
      bonus: 4,
    },
    {
      type: "Paralysis or Petrify",
      bonus: 4,
    },
    {
      type: "Spells",
      bonus: 4,
    },
    {
      type: "Dragon Breath",
      bonus: 3,
    },
  ],
  lifespan: "Around 150 years",
  languages: ["Common", "Sylvan"],
  carryingCapacity: {
    light: 50,
    heavy: 100,
    strengthModifier: {
      positive: 0.1, // +10% per +1 STR modifier
      negative: 0.2, // -20% per -1 STR modifier
    }
  },
  supplementalContent: true,
};