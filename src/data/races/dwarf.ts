import type { Race } from "@/types/character";

export const dwarf: Race = {
  name: "Dwarf",
  id: "dwarf",
  description:
    "Dwarves are typically practical, stubborn and courageous. They can also be introspective, suspicious and possessive.",
  physicalDescription:
    "Dwarves are a short, stocky race; both male and female Dwarves stand around four feet tall and typically weigh around 120 pounds. Their long hair and thick beards are dark brown, gray or black. They take great pride in their beards, sometimes braiding or forking them. They have a fair to ruddy complexion. Dwarves have stout frames and a strong, muscular build. They are rugged and resilient, with the capacity to endure great hardships.",
  allowedClasses: ["cleric", "fighter", "thief"],
  abilityRequirements: [
    {
      ability: "constitution",
      min: 9,
    },
    {
      ability: "charisma",
      max: 17,
    },
  ],
  prohibitedWeapons: ["greatsword", "polearm", "longbow"],
  specialAbilities: [
    {
      name: "Darkvision",
      description: "All Dwarves have Darkvision with a 60' range",
    },
    {
      name: "Detect Construction",
      description:
        "Able to detect slanting passages, stonework traps, shifting walls and new construction on a roll of 1-2 on 1d6; a search must be performed before this roll may be made",
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
  lifespan: "Three to four centuries",
  languages: ["Common", "Dwarvish"],
  supplementalContent: false,
};
