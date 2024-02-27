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
