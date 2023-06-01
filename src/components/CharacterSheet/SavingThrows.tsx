import { CharacterData, CharacterDetails, SavingThrowsTables } from "../types";

export default function SavingThrows({
  character,
  setCharacter,
}: CharacterDetails) {
  const savingThrowsTables: SavingThrowsTables = {
    Cleric: {
      "1": {
        deathRayOrPoison: 11,
        magicWands: 12,
        paralysisOrPetrify: 14,
        dragonBreath: 16,
        spells: 15,
      },
      "2-3": {
        deathRayOrPoison: 10,
        magicWands: 11,
        paralysisOrPetrify: 13,
        dragonBreath: 15,
        spells: 14,
      },
      "4-5": {
        deathRayOrPoison: 9,
        magicWands: 10,
        paralysisOrPetrify: 13,
        dragonBreath: 15,
        spells: 14,
      },
      "6-7": {
        deathRayOrPoison: 9,
        magicWands: 10,
        paralysisOrPetrify: 12,
        dragonBreath: 14,
        spells: 13,
      },
      "8-9": {
        deathRayOrPoison: 8,
        magicWands: 9,
        paralysisOrPetrify: 12,
        dragonBreath: 14,
        spells: 13,
      },
      "10-11": {
        deathRayOrPoison: 8,
        magicWands: 9,
        paralysisOrPetrify: 11,
        dragonBreath: 13,
        spells: 12,
      },
      "12-13": {
        deathRayOrPoison: 7,
        magicWands: 8,
        paralysisOrPetrify: 11,
        dragonBreath: 13,
        spells: 12,
      },
      "14-15": {
        deathRayOrPoison: 7,
        magicWands: 8,
        paralysisOrPetrify: 10,
        dragonBreath: 12,
        spells: 11,
      },
      "16-17": {
        deathRayOrPoison: 6,
        magicWands: 7,
        paralysisOrPetrify: 10,
        dragonBreath: 12,
        spells: 11,
      },
      "18-19": {
        deathRayOrPoison: 6,
        magicWands: 7,
        paralysisOrPetrify: 9,
        dragonBreath: 11,
        spells: 10,
      },
      "20": {
        deathRayOrPoison: 5,
        magicWands: 6,
        paralysisOrPetrify: 9,
        dragonBreath: 11,
        spells: 10,
      },
    },
    "Magic-User": {
      "1": {
        deathRayOrPoison: 13,
        magicWands: 14,
        paralysisOrPetrify: 13,
        dragonBreath: 16,
        spells: 15,
      },
      "2-3": {
        deathRayOrPoison: 13,
        magicWands: 14,
        paralysisOrPetrify: 13,
        dragonBreath: 15,
        spells: 14,
      },
      "4-5": {
        deathRayOrPoison: 12,
        magicWands: 13,
        paralysisOrPetrify: 12,
        dragonBreath: 15,
        spells: 13,
      },
      "6-7": {
        deathRayOrPoison: 12,
        magicWands: 12,
        paralysisOrPetrify: 11,
        dragonBreath: 14,
        spells: 13,
      },
      "8-9": {
        deathRayOrPoison: 11,
        magicWands: 11,
        paralysisOrPetrify: 10,
        dragonBreath: 14,
        spells: 12,
      },
      "10-11": {
        deathRayOrPoison: 11,
        magicWands: 10,
        paralysisOrPetrify: 9,
        dragonBreath: 13,
        spells: 11,
      },
      "12-13": {
        deathRayOrPoison: 10,
        magicWands: 10,
        paralysisOrPetrify: 9,
        dragonBreath: 13,
        spells: 11,
      },
      "14-15": {
        deathRayOrPoison: 10,
        magicWands: 9,
        paralysisOrPetrify: 8,
        dragonBreath: 12,
        spells: 10,
      },
      "16-17": {
        deathRayOrPoison: 9,
        magicWands: 8,
        paralysisOrPetrify: 7,
        dragonBreath: 12,
        spells: 9,
      },
      "18-19": {
        deathRayOrPoison: 9,
        magicWands: 7,
        paralysisOrPetrify: 6,
        dragonBreath: 11,
        spells: 9,
      },
      "20": {
        deathRayOrPoison: 8,
        magicWands: 6,
        paralysisOrPetrify: 5,
        dragonBreath: 11,
        spells: 8,
      },
    },
    Fighter: {
      "1": {
        deathRayOrPoison: 12,
        magicWands: 13,
        paralysisOrPetrify: 14,
        dragonBreath: 15,
        spells: 17,
      },
      "2-3": {
        deathRayOrPoison: 11,
        magicWands: 12,
        paralysisOrPetrify: 14,
        dragonBreath: 15,
        spells: 16,
      },
      "4-5": {
        deathRayOrPoison: 11,
        magicWands: 11,
        paralysisOrPetrify: 13,
        dragonBreath: 14,
        spells: 15,
      },
      "6-7": {
        deathRayOrPoison: 10,
        magicWands: 11,
        paralysisOrPetrify: 12,
        dragonBreath: 14,
        spells: 15,
      },
      "8-9": {
        deathRayOrPoison: 9,
        magicWands: 10,
        paralysisOrPetrify: 12,
        dragonBreath: 13,
        spells: 14,
      },
      "10-11": {
        deathRayOrPoison: 9,
        magicWands: 9,
        paralysisOrPetrify: 11,
        dragonBreath: 12,
        spells: 13,
      },
      "12-13": {
        deathRayOrPoison: 8,
        magicWands: 9,
        paralysisOrPetrify: 10,
        dragonBreath: 12,
        spells: 13,
      },
      "14-15": {
        deathRayOrPoison: 7,
        magicWands: 8,
        paralysisOrPetrify: 10,
        dragonBreath: 11,
        spells: 12,
      },
      "16-17": {
        deathRayOrPoison: 7,
        magicWands: 7,
        paralysisOrPetrify: 9,
        dragonBreath: 10,
        spells: 11,
      },
      "18-19": {
        deathRayOrPoison: 6,
        magicWands: 7,
        paralysisOrPetrify: 8,
        dragonBreath: 10,
        spells: 11,
      },
      "20": {
        deathRayOrPoison: 5,
        magicWands: 6,
        paralysisOrPetrify: 8,
        dragonBreath: 9,
        spells: 10,
      },
    },
    Thief: {
      "1": {
        deathRayOrPoison: 13,
        magicWands: 14,
        paralysisOrPetrify: 13,
        dragonBreath: 16,
        spells: 15,
      },
      "2-3": {
        deathRayOrPoison: 12,
        magicWands: 14,
        paralysisOrPetrify: 12,
        dragonBreath: 15,
        spells: 14,
      },
      "4-5": {
        deathRayOrPoison: 11,
        magicWands: 13,
        paralysisOrPetrify: 12,
        dragonBreath: 14,
        spells: 13,
      },
      "6-7": {
        deathRayOrPoison: 11,
        magicWands: 13,
        paralysisOrPetrify: 11,
        dragonBreath: 13,
        spells: 13,
      },
      "8-9": {
        deathRayOrPoison: 10,
        magicWands: 12,
        paralysisOrPetrify: 11,
        dragonBreath: 12,
        spells: 12,
      },
      "10-11": {
        deathRayOrPoison: 9,
        magicWands: 12,
        paralysisOrPetrify: 10,
        dragonBreath: 11,
        spells: 11,
      },
      "12-13": {
        deathRayOrPoison: 9,
        magicWands: 10,
        paralysisOrPetrify: 10,
        dragonBreath: 10,
        spells: 11,
      },
      "14-15": {
        deathRayOrPoison: 8,
        magicWands: 10,
        paralysisOrPetrify: 9,
        dragonBreath: 9,
        spells: 10,
      },
      "16-17": {
        deathRayOrPoison: 7,
        magicWands: 9,
        paralysisOrPetrify: 9,
        dragonBreath: 8,
        spells: 9,
      },
      "18-19": {
        deathRayOrPoison: 7,
        magicWands: 9,
        paralysisOrPetrify: 8,
        dragonBreath: 7,
        spells: 9,
      },
      "20": {
        deathRayOrPoison: 6,
        magicWands: 8,
        paralysisOrPetrify: 8,
        dragonBreath: 6,
        spells: 8,
      },
    },
  };

  function getSavingThrows(character: CharacterData) {
    const characterClass = character.class;
    const characterLevel = character.level;

    const levelRange = Object.keys(savingThrowsTables[characterClass]).find(
      (range) => {
        const [min, max] = range.split("-").map(Number);
        return characterLevel >= min && (!max || characterLevel <= max);
      }
    );

    if (levelRange) {
      return savingThrowsTables[characterClass][levelRange];
    } else {
      // Return a default value or throw an error
      throw new Error("Invalid level range");
    }
  }

  // const character = { class: "Cleric", level: 2 };
  console.log(getSavingThrows(character)); // { deathRayOrPoison: 10, magicWands: 11, paralysisOrPetrify: 13, dragonBreath: 15, spells: 14 }

  return <div></div>;
}
