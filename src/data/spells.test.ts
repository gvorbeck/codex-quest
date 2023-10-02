import spells from "./spells.json";

describe("spells", () => {
  test("every spell has a unique name", () => {
    const spellNames = spells.map((spell) => spell.name);
    const uniqueSpellNames = [...new Set(spellNames)];
    expect(spellNames.length).toBe(uniqueSpellNames.length);
  });
});
