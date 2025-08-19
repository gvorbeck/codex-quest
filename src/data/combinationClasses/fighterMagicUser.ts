import type { CombinationClass } from "@/types/character";

export const fighterMagicUser: CombinationClass = {
  name: "Fighter/Magic-User",
  id: "fighter/magic-user",
  description:
    "These characters may both fight and cast magic spells; further, they are allowed to cast magic spells while wearing armor. These characters roll six-sided dice (d6) for hit points.",
  hitDie: "1d6",
  primaryClasses: ["fighter", "magic-user"],
  specialAbilities: [
    {
      name: "Spellcasting in Armor",
      description:
        "Can cast magic spells while wearing armor, unlike pure Magic-Users",
    },
    {
      name: "Combined Experience Requirements",
      description:
        "Must gain experience equal to the combined requirements of both base classes to advance in levels",
    },
    {
      name: "Best Attack Bonus",
      description: "Use the best attack bonus of their original two classes",
    },
    {
      name: "Best Saving Throws",
      description:
        "Use the best saving throw values of their original two classes",
    },
  ],
  eligibleRaces: ["elf", "dokkalfar"],
  supplementalContent: false,
};
