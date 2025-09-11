export const CITY_ENCOUNTERS = {
  "Day Encounter": [
    "Doppleganger",
    "Noble",
    "Thief",
    "Bully",
    "City Watch",
    "Merchant",
    "Beggar",
    "Priest",
    "Mercenary",
    "Wizard",
    "Lycanthrope, Wererat*",
  ],
  "Night Encounter": [
    "Doppleganger",
    "Shadow*",
    "Press Gang",
    "Beggar",
    "Thief",
    "Bully",
    "Merchant",
    "Giant Rat",
    "City Watch",
    "Wizard",
    "Lycanthrope, Wererat*",
  ],
} as const;

export type CityType = keyof typeof CITY_ENCOUNTERS;