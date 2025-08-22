import type { Race } from "@/types/character";

export const halfling: Race = {
  name: "Halfling",
  id: "halfling",
  description:
    "Halflings are typically outgoing, unassuming and good-natured. They are dexterous and nimble, capable of moving quietly and remaining very still. They usually go barefoot.",
  physicalDescription:
    "Halflings are small, slightly stocky folk who stand around three feet tall and weigh about 60 pounds. They have curly brown hair on their heads and feet, but rarely have facial hair. They are usually fair skinned, often with ruddy cheeks. Halflings are remarkably rugged for their small size. They are dexterous and nimble, capable of moving quietly and remaining very still. They usually go barefoot.",
  allowedClasses: ["cleric", "fighter", "thief", "ranger", "scout"],
  abilityRequirements: [
    {
      ability: "dexterity",
      min: 9,
    },
    {
      ability: "strength",
      max: 17,
    },
  ],
  prohibitedWeapons: ["large"], // Cannot use Large weapons, must wield Medium weapons with both hands
  specialAbilities: [
    {
      name: "Ranged Weapon Accuracy",
      description:
        "Halflings are unusually accurate with all sorts of ranged weapons, gaining a +1 attack bonus when employing them",
      effects: {
        attackBonus: {
          value: 1,
          conditions: ["ranged weapons"],
        },
      },
    },
    {
      name: "Size Defense Bonus",
      description:
        "When attacked in melee by creatures larger than man-sized, Halflings gain a +2 bonus to their Armor Class",
      effects: {
        acBonus: {
          value: 2,
          conditions: ["vs creatures larger than man-sized"],
        },
      },
    },
    {
      name: "Initiative Bonus",
      description:
        "Halflings are quick-witted, adding +1 to Initiative die rolls",
      effects: {
        initiativeBonus: {
          value: 1,
        },
      },
    },
    {
      name: "Forest Hiding",
      description:
        "In their preferred forest terrain, they are able to hide very effectively; so long as they remain still there is only a 10% chance they will be detected",
    },
    {
      name: "General Hiding",
      description:
        "Even indoors, in dungeons or in non-preferred terrain they are able to hide such that there is only a 30% chance of detection",
    },
    {
      name: "Stealth Roll",
      description:
        "Note that a Halfling Thief will roll only once, using either the Thief ability or the Halfling ability, whichever is better",
    },
    {
      name: "Hit Point Restriction",
      description:
        "Halflings never roll larger than six-sided dice (d6) for hit points regardless of class",
      effects: {
        hitDiceRestriction: {
          maxSize: "d6",
        },
      },
    },
    {
      name: "Weapon Size Restriction",
      description:
        "Halflings may not use Large weapons, and must wield Medium weapons with both hands",
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
  lifespan: "About a hundred years",
  languages: ["Common", "Halfling"],
  supplementalContent: false,
};
