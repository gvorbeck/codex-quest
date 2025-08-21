"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Test file to verify character migration
const characterMigration_1 = require("../src/services/characterMigration");
// Legacy character data from the user's example
const legacyCharacterData = {
    abilities: {
        modifiers: {
            charisma: "+0",
            constitution: "+0",
            dexterity: "+0",
            intelligence: "+0",
            strength: "-1",
            wisdom: "+2",
        },
        scores: {
            charisma: 12,
            constitution: 9,
            dexterity: 11,
            intelligence: 9,
            strength: 7,
            wisdom: 17,
        },
    },
    avatar: "/faces/dwarf-man-1.webp",
    class: ["Cleric"],
    copper: 0,
    desc: [""],
    electrum: 0,
    equipment: [
        {
            amount: 1,
            category: "general-equipment",
            costCurrency: "gp",
            costValue: 25,
            name: "Holy Symbol",
            subCategory: "class-items",
            weight: 0.1,
        },
        {
            AC: 12,
            amount: 2,
            category: "armor",
            costCurrency: "gp",
            costValue: 15,
            name: "Padded/Quilted Armor",
            type: 1,
            weight: 10,
        },
    ],
    gold: 2,
    hp: {
        desc: "",
        dice: "d6",
        max: 6,
        points: 6,
    },
    level: 1,
    name: "Corndog",
    platinum: 0,
    race: "Elf",
    silver: 25,
    spells: [],
    useCoinWeight: true,
    wearing: {
        armor: "Padded/Quilted Armor",
        shield: "",
    },
    weight: 0,
    xp: 0,
};
console.log("Testing legacy character migration...");
// Test 1: Check if it's detected as legacy
console.log("Is legacy character?", (0, characterMigration_1.isLegacyCharacter)(legacyCharacterData));
// Test 2: Migrate the character
const migratedCharacter = (0, characterMigration_1.processCharacterData)(legacyCharacterData);
console.log("Migrated character:", JSON.stringify(migratedCharacter, null, 2));
// Test 3: Check specific migrated fields
console.log("\nChecking specific migrations:");
console.log("Abilities structure:", migratedCharacter.abilities);
console.log("Currency structure:", migratedCharacter.currency);
console.log("HP structure:", migratedCharacter.hp);
console.log("Settings version:", migratedCharacter.settings?.version);
