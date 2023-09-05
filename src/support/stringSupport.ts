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
  const words = input.toLowerCase().split(" ");
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
  return titleCaseWords.join(" ");
}

export function camelCaseToTitleCase(input: string) {
  return toTitleCase(input.replace(/([A-Z])/g, " $1").toLowerCase());
}

export function slugToTitleCase(input: string) {
  return toTitleCase(input.replace(/-/g, " "));
}

export function extractImageName(url: string) {
  const regex = /\/static\/media\/(.*[^-])\..*?\.jpg/;
  const match = url.match(regex);
  return match ? match[1] : undefined;
}
