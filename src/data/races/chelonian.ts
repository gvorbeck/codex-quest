import type { Race } from "@/types/character";

export const chelonian: Race = {
  name: "Chelonian",
  id: "chelonian",
  description:
    "Inhabiting river and lake regions, Chelonian are a race of reptilian humanoids bearing some semblance to turtles. They are normally content to remain within their own societies, but on occasion a more adventurous individual can be found.",
  physicalDescription:
    "They are protected by thick scaly skin as well as a shell-like growth that covers their backside. Chelonian are seldom taller than 5' or so.",
  allowedClasses: ["cleric", "fighter", "magic-user", "thief", "assassin", "barbarian", "druid", "illusionist", "necromancer", "ranger", "paladin", "scout", "spellcrafter"],
  abilityRequirements: [
    {
      ability: "constitution",
      min: 11,
    },
    {
      ability: "dexterity",
      max: 17,
    },
  ],
  prohibitedWeapons: [],
  specialAbilities: [
    {
      name: "Natural Armor",
      description:
        "A Chelonian's thick skin grants it a base AC of 13 (equivalent to leather armor), and a Chelonian's back is especially tough with an AC of 17 (equivalent to plate mail only for rear attacks). Use these figures unless any armor worn grants better AC, then use the armor's AC. A shield will be still effective in either case.",
      effects: {
        naturalArmor: {
          baseAC: 13,
          rearAC: 17,
        },
      },
    },
    {
      name: "Aquatic Abilities",
      description:
        "Chelonian swim no better than other humanoid races, but they can hold their breath twice as long. In addition, their underwater vision is also twice as good as normal.",
    },
    {
      name: "Armor Restrictions",
      description:
        "Normal armors will not fit the physique of a Chelonian and they normally use only shields to enhance their defenses. Specially-constructed armors can be acquired, costing substantially more than listed prices and requiring extra time to create.",
    },
  ],
  savingThrows: [
    {
      type: "Death Ray or Poison",
      bonus: 2,
    },
  ],
  lifespan: "Around 200 years",
  languages: ["Common", "Draconic"],
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