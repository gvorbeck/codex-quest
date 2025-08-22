import type { Race } from "@/types/character";

export const halfOgre: Race = {
  name: "Half-Ogre",
  id: "half-ogre",
  description:
    "Half-ogres are the result of crossbreeding between humans and ogres. Such creatures tend to be outcasts within both human and ogrish communities, but they may often be found as leaders in communities of orcs or goblins.",
  physicalDescription:
    "Half-ogres are big, averaging around 7 feet in height, broad-shouldered, and rangy. Their features tend to favor the ogrish parent, with dark coarse hair, tan or brown skin, and dark eyes.",
  allowedClasses: ["cleric", "fighter"],
  abilityRequirements: [
    {
      ability: "strength",
      min: 13,
    },
    {
      ability: "constitution",
      min: 13,
    },
    {
      ability: "intelligence",
      max: 15,
    },
    {
      ability: "wisdom",
      max: 15,
    },
  ],
  prohibitedWeapons: [],
  specialAbilities: [
    {
      name: "Enhanced Hit Dice",
      description:
        "Half-ogres roll hit dice one size larger than normal; so a half-ogre Fighter rolls d10's for hit points, while a half-ogre Cleric rolls d8's",
      effects: {
        hitDiceBonus: {
          sizeIncrease: 1,
        },
      },
    },
    {
      name: "Fast Learning",
      description:
        "Half-ogres gain a bonus of +5% on all earned experience",
      effects: {
        experienceBonus: {
          value: 5,
        },
      },
    },
    {
      name: "Strength Bonus",
      description:
        "Due to their great size, they gain a bonus of +1 on the roll when opening doors or performing other feats of Strength",
      effects: {
        strengthBonus: {
          value: 1,
          conditions: ["feats of strength", "opening doors"],
        },
      },
    },
    {
      name: "Darkvision",
      description: "Half-ogres have Darkvision with a 30' range",
      effects: {
        darkvision: {
          range: 30,
        },
      },
    },
  ],
  savingThrows: [],
  lifespan: "Around 100 years",
  languages: ["Common", "Orcish"],
  supplementalContent: true,
};