import type { Race } from "@/types/character";

export const halfOrc: Race = {
  name: "Half-Orc",
  id: "half-orc",
  description:
    "Half-orcs are the result of crossbreeding between humans and orcs. Such creatures tend to be outcasts within Human communities, but sometimes rise to positions of leadership within orcish communities.",
  physicalDescription:
    "Half-orcs are a bit shorter than humans. Their features tend to favor the orcish parent.",
  allowedClasses: ["cleric", "fighter", "magic-user", "thief", "assassin", "barbarian", "druid", "illusionist", "necromancer", "ranger", "paladin", "scout", "spellcrafter"],
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
      name: "Fast Learning",
      description:
        "Half-orcs gain a bonus of +5% on all earned experience",
      effects: {
        experienceBonus: {
          value: 5,
        },
      },
    },
    {
      name: "Darkvision",
      description: "Half-orcs have Darkvision with a 60' range",
      effects: {
        darkvision: {
          range: 60,
        },
      },
    },
    {
      name: "Intimidation Bonus",
      description:
        "When dealing with humanoids of human-size or smaller, a half-orc gains an additional +1 on any reaction die roll, in addition to their Charisma bonus",
      effects: {
        reactionBonus: {
          value: 1,
          conditions: ["vs humanoids human-size or smaller"],
        },
      },
    },
  ],
  savingThrows: [
    {
      type: "Death Ray or Poison",
      bonus: 1,
    },
  ],
  lifespan: "Around 75 years",
  languages: ["Common", "Orcish"],
  supplementalContent: true,
};