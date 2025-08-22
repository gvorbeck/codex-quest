import type { Race } from "@/types/character";

export const bisren: Race = {
  name: "Bisren",
  id: "bisren",
  description:
    "The Bisren are a race descended from the great Minotaurs of legend. Normally peaceful, Bisren enjoy nature and keep a semi-nomadic lifestyle in regions that other races call wild. When threatened, Bisren can become quite dangerous, much like their warrior ancestors.",
  physicalDescription:
    "Bisren are impressively muscled and generally average 7' tall, with some individuals reaching almost 8' in height. They have horned heads and cloven-hoof feet.",
  allowedClasses: ["fighter", "cleric", "thief", "ranger", "druid"], // Prefer nature-oriented professions
  abilityRequirements: [
    {
      ability: "strength",
      min: 11,
    },
    {
      ability: "constitution",
      min: 11,
    },
    {
      ability: "dexterity",
      max: 17,
    },
    {
      ability: "intelligence",
      max: 17,
    },
  ],
  prohibitedWeapons: [],
  specialAbilities: [
    {
      name: "Enhanced Hit Dice",
      description:
        "Bisren roll hit dice one size larger than normal; a d4 would become a d6, a d6 to d8, etc.",
      effects: {
        hitDiceBonus: {
          sizeIncrease: 1,
        },
      },
    },
    {
      name: "Gore Attack",
      description:
        "Bisren are never truly unarmed, as they can gore for 1d6 damage with their horns. Bisren often charge into battle with a gore attack (+2 to hit with double damage, following all normal charging rules) and then switch to weaponry for the remainder of the fight. They must choose whether to attack with weapons or to gore; they cannot do both in a round.",
    },
    {
      name: "Strength Bonus",
      description:
        "Bisren get an additional +1 bonus on feats of strength such as opening doors due to their great size",
      effects: {
        strengthBonus: {
          value: 1,
          conditions: ["feats of strength", "opening doors"],
        },
      },
    },
    {
      name: "Thief Ability Penalties",
      description:
        "Roguish Bisren have a -10% penalty to Open Locks, Removing Traps, and Picking Pockets. Stealth checks (Moving Silently and Hiding) for Bisren are made normally, although in non-wilderness areas such as indoors, underground (dungeons), or in urban areas they suffer a -20% penalty to their chance to succeed. Outdoor traps, such as hunting snares or deadfalls, do not apply the above penalty and instead are made at +10% bonus.",
    },
    {
      name: "Equipment Restrictions",
      description:
        "Bisren may wear human-sized armor, albeit often adjusted slightly to account for their size. Their cloven-hoof feet may not wear typical footwear, unless specially produced for Bisren. Specially-constructed helmets are likewise needed to fit their horned heads.",
    },
  ],
  savingThrows: [],
  lifespan: "Around 150 years",
  languages: ["Common", "Minotaur"],
  supplementalContent: true,
};