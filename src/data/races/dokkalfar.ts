import type { Race } from "@/types/character";

export const dokkalfar: Race = {
  name: "Dokkalfar",
  id: "dokkalfar",
  description:
    "Dokkalfar are typically haughty, cold-blooded, resentful, and lack empathy towards other races as they see them as completely inferior. Their negative attitude is strongest against all surface dwelling races, most especially Elves.",
  physicalDescription:
    "Dokkalfar are a subspecies of Elves, but they believe themselves far superior to any and all other types. Both males and females stand around five feet tall and weight around 130 pounds. Most have hair of monochromatic coloration ranging from jet black to pure white, and lack almost all body and facial hair. Their skin is a very pale white, and they have pointed ears and delicate features in common with other elven types. Their eyes are perhaps their most striking feature, being some very pale shade of blue, green, or grey, with the latter being the most common coloration.",
  allowedClasses: ["cleric", "fighter", "magic-user", "thief", "illusionist", "necromancer", "spellcrafter"],
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
      name: "Superior Darkvision",
      description: "All Dokkalfar have superior Darkvision with a 120' range",
      effects: {
        darkvision: {
          range: 120,
        },
      },
    },
    {
      name: "Secret Door Detection",
      description:
        "Able to find secret doors more often than normal (1-2 on 1d6 rather than the usual 1 on 1d6). A Dokkalf is so observant that one has a 1 on 1d6 chance to find a secret door with a cursory look",
    },
    {
      name: "Ghoul Immunity",
      description: "Dokkalfar are immune to the paralyzing attack of ghouls",
    },
    {
      name: "Combat Awareness",
      description:
        "Less likely to be surprised in combat, reducing the chance of surprise by 1 in 1d6",
    },
    {
      name: "Hit Point Restriction",
      description:
        "Dokkalfar never roll larger than six-sided dice (d6) for hit points",
      effects: {
        hitDiceRestriction: {
          maxSize: "d6",
        },
      },
    },
    {
      name: "Light Sensitivity",
      description:
        "Extremely sensitive to light; if suddenly exposed to daylight or any illumination of similar brightness they must save vs. Death Ray or suffer blindness for 2d4 rounds. Even so, when in such illumination they suffer a -2 penalty to all attack rolls",
      effects: {
        attackBonus: {
          value: -2,
          conditions: ["in bright light"],
        },
      },
    },
    {
      name: "Sunlight Vulnerability",
      description:
        "Exposure of a Dokkalf's skin to actual daylight (not merely bright lights) causes their skin to actually harden and begin to crack, inflicting 1d4 points of damage per each full turn of exposure",
    },
  ],
  savingThrows: [
    {
      type: "Death Ray or Poison",
      bonus: 2,
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
  languages: ["Common", "Dokkalfar Elvish"],
  supplementalContent: true,
};
