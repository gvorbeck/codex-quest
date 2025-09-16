import type { Race } from "@/types/character";

export const gnome: Race = {
  name: "Gnome",
  id: "gnome",
  description:
    "Gnomes are small and stocky, more so than halflings but not as much as dwarves. They are renowned for their rapidly-changing moods, sometimes gruff and contrary, sometimes whimsical and humorous.",
  physicalDescription:
    "Both male and female gnomes stand around three and a half feet tall and typically weigh around 90 pounds. Their hair and beards may be blond, brown, black, or sometimes red. They have a fair to ruddy complexion. The most noticeable features about a gnome from the standpoint of other races is their pointed ears and noses.",
  allowedClasses: ["cleric", "fighter", "magic-user", "thief"],
  abilityRequirements: [
    {
      ability: "constitution",
      min: 9,
    },
    {
      ability: "strength",
      max: 17,
    },
  ],
  prohibitedWeapons: ["greatsword", "polearm", "longbow"], // Large weapons more than four feet in length
  specialAbilities: [
    {
      name: "Darkvision",
      description: "All Gnomes have Darkvision with a 30' range",
      effects: {
        darkvision: {
          range: 30,
        },
      },
    },
    {
      name: "Size Defense Bonus",
      description:
        "When attacked in melee by creatures larger than man-sized, Gnomes gain a +1 bonus to their Armor Class",
      effects: {
        acBonus: {
          value: 1,
          conditions: ["vs creatures larger than man-sized"],
        },
      },
    },
    {
      name: "Detect Hidden",
      description:
        "A gnome has a 10% chance to detect an invisible or hidden creature within a 30 foot radius. This ability does not apply to inanimate objects such as secret doors or invisible objects.",
    },
    {
      name: "Invisible Combat Bonus",
      description:
        "When fighting an invisible opponent that has been successfully detected, a gnome suffers only a -2 penalty on the attack roll, rather than the usual -4 penalty.",
    },
    {
      name: "Hit Point Restriction",
      description:
        "Gnomes never roll larger than six-sided dice (d6) for hit points regardless of class",
      effects: {
        hitDiceRestriction: {
          maxSize: "d6",
        },
      },
    },
    {
      name: "Weapon Size Restriction",
      description:
        "Gnomes may not employ Large weapons more than four feet in length (specifically, two-handed swords, polearms, and longbows)",
    },
  ],
  savingThrows: [
    {
      type: "Death Ray or Poison",
      bonus: 4,
    },
    {
      type: "Dragon Breath",
      bonus: 3,
    },
  ],
  lifespan: "Between two and three centuries",
  languages: ["Common", "Gnomish"],
  carryingCapacity: {
    light: 50, // Treat gnomes as equivalent to halflings per BFRPG
    heavy: 100,
    strengthModifier: {
      positive: 0.1, // +10% per +1 STR modifier
      negative: 0.2, // -20% per -1 STR modifier
    }
  },
  supplementalContent: true,
};