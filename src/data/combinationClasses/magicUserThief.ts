import type { CombinationClass } from "@/types/character";

export const magicUserThief: CombinationClass = {
  name: "Magic-User/Thief",
  id: "magic-user/thief",
  description:
    "Members of this combination class may cast spells while wearing leather armor. These characters roll four-sided dice (d4) for hit points.",
  hitDie: "1d4",
  primaryClasses: ["magic-user", "thief"],
  specialAbilities: [
    {
      name: "Spellcasting in Leather Armor",
      description:
        "Can cast magic spells while wearing leather armor, unlike pure Magic-Users",
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
