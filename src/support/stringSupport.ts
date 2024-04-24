const titleCaseExceptions = [
  "a",
  "an",
  "the",
  "and",
  "but",
  "or",
  "for",
  "nor",
  "on",
  "at",
  "to",
  "from",
  "by",
  "in",
  "of",
];

export function toTitleCase(input: string): string {
  const separators = /[-\s]/;
  const words = input.toLowerCase().split(separators);
  const titleCaseWords = words.map((word, index) => {
    if (
      index === 0 ||
      index === words.length - 1 ||
      !titleCaseExceptions.includes(word)
    ) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    } else {
      return word;
    }
  });

  // Preserve original separators
  let currentIndex = 0;
  const result = [];
  for (const word of words) {
    result.push(titleCaseWords[currentIndex]);
    currentIndex++;
    if (input.indexOf(word) + word.length < input.length) {
      result.push(input[input.indexOf(word) + word.length]);
    }
  }

  return result.join("");
}

export function titleCaseToCamelCase(input: string) {
  return input
    .replace(/\s(.)/g, function ($1) {
      return $1.toUpperCase();
    })
    .replace(/\s/g, "")
    .replace(/^(.)/, function ($1) {
      return $1.toLowerCase();
    });
}

export function toCamelCase(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, nextChar) =>
      nextChar ? nextChar.toUpperCase() : "",
    )
    .replace(/^(.)/, (firstChar) => firstChar.toLowerCase());
}

export function camelCaseToTitleCase(input: string) {
  return toTitleCase(input.replace(/([A-Z])/g, " $1").toLowerCase());
}

export function slugToTitleCase(input: string) {
  return toTitleCase(input.replace(/-/g, " "));
}

export function toSlugCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\W_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function toSnakeCase(str: string): string {
  return (
    str
      // First, replace camelCase with snake_case
      .replace(/([A-Z])/g, (letter, index) =>
        index > 0 ? `_${letter}` : letter,
      )
      // Replace spaces and hyphens with underscores
      .replace(/[\s-]+/g, "_")
      // Convert to lowercase
      .toLowerCase()
  );
}

export const mobileBreakpoint = "(max-width: 639px)";
export const tabletBreakpoint = "(min-width: 768px) and (max-width: 1023px)";
export const desktopBreakpoint = "(min-width: 1024px)";

export enum AttackTypes {
  MELEE = "melee",
  MISSILE = "missile",
  BOTH = "both",
}

export const customClassString =
  'You are using a custom class. Use the "Bio & Notes" field below to calculate your character\'s Saving Throws, Special Abilities, and Restrictions. For standard classes, these values will be calculated here automatically.';

export const getRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const iconStrings = {
  darkVision(range: number) {
    return `Has Darkvision with a range of ${range} feet.`;
  },
  secretDoors(chance: string, die: string) {
    return `They are able to find secret doors with a ${chance} on a ${die}.`;
  },
  paralyzingAttack: "Immune to the paralyzing attack of ghouls.",
  noSurprise(chance: string, die: string) {
    return `Less likely to be surprised in combat, reducing the chance of surprise by ${chance} in ${die}.`;
  },
  stonecunning(chance: string, die: string) {
    return `Able to detect slanting passages, stonework traps, shifting walls, and new construction on a roll of ${chance} on ${die}.`;
  },
  rangedBonus(bonus: number) {
    return `Gain a +${bonus} attack bonus when employing ranged weapons.`;
  },
  sizeBonus(bonus: number) {
    return `When attacked in melee by creatures larger than man-sized, gains a +${bonus} bonus to their Armor Class.`;
  },
  initiativeBonus(bonus: number) {
    return `Adds +${bonus} to initiative die rolls.`;
  },
  hideBonus(indoors: string, outdoors: string) {
    return `Able to hide with a ${indoors} chance of detection in preferred terrain, and a ${outdoors} chance of detection in non-preferred terrain.`;
  },
  weaponLimits(limit: string) {
    return `Weapon Limits: ${limit}`;
  },
  xpBonus(bonus: string) {
    return `Experience bonus of ${bonus}`;
  },
  strengthBonus(bonus: string) {
    return `Bonus to feats of strength: ${bonus}`;
  },
  specialBonus(bonus: string) {
    return `Special: ${bonus}`;
  },
  equipmentLimits(limit: string) {
    return `Equipment Limits: ${limit}`;
  },
  turnUndead() {
    return "Turn Undead ability";
  },
  thiefAbilities() {
    return "Thief special abilities";
  },
  smellBonus() {
    return `Can identify individuals by scent alone, including concealed or invisible creatures. Penalties associated with combating such foes are halved.`;
  },
  rangerBonus() {
    return `Can track as a Ranger of equivalent level, and an actual Canein Ranger gets a bonus of +20% on Tracking rolls.`;
  },
  similarCreatures(bonus: string, type: string) {
    return `${bonus} on any reaction rolls involving other ${type}.`;
  },
  penalties(penalty: string) {
    return `Penalties: ${penalty}`;
  },
  rearAttack(details: string) {
    return `Rear Attack: ${details}`;
  },
  underwaterAbilities(details: string) {
    return `Underwater Abilities: ${details}`;
  },
  sunlightSensitivity(details: string) {
    return `Sunlight Sensitivity: ${details}`;
  },
  charmResist(bonus: string, source: string) {
    return `Resistant to charm-like effects from ${source}, gaining a ${bonus} bonus on relevant saves.`;
  },
  observationBonus(chance: string, subject: string, radius: string) {
    return `Observant: ${chance} chance to detect ${subject} within a ${radius} radius.`;
  },
  flight(duration: number) {
    return `Can fly up to ${duration} rounds, but must remain grounded an equivalent amount of time after any flight.`;
  },
};
