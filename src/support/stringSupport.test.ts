import {
  camelCaseToTitleCase,
  extractImageName,
  slugToTitleCase,
  titleCaseToCamelCase,
  toTitleCase,
} from "./stringSupport";

describe("toTitleCase", () => {
  test("should return a title cased string", () => {
    expect(toTitleCase("hello world")).toBe("Hello World");
  });

  test('should return a title cased string with "of" in lowercase', () => {
    expect(toTitleCase("the lord of the rings")).toBe("The Lord of the Rings");
  });
});

describe("camelCaseToTitleCase", () => {
  test("should return a title cased string", () => {
    expect(camelCaseToTitleCase("helloWorld")).toBe("Hello World");
  });
});

describe("slugToTitleCase", () => {
  test('should return a title cased string with "of" in lowercase', () => {
    expect(slugToTitleCase("the-lord-of-the-rings")).toBe(
      "The Lord of the Rings"
    );
  });
});

describe("titleCaseToCamelCase", () => {
  test("should return a camel cased string", () => {
    expect(titleCaseToCamelCase("Hello World")).toBe("helloWorld");
  });
});

describe("extractImageName", () => {
  test("should return the image name", () => {
    expect(extractImageName("/static/media/elf.1f3f9b2f.jpg")).toBe("elf");
  });

  test("should return undefined if no match", () => {
    expect(extractImageName("/static/media/elf.jpg")).toBe(undefined);
  });
});
