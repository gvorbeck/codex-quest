import { useMemo } from "react";
import type { Character } from "@/types/character";

interface SavingThrows {
  deathRayOrPoison: number;
  magicWands: number;
  paralysisOrPetrify: number;
  dragonBreath: number;
  spells: number;
  racialBonuses: number[];
}

export function useSavingThrows(character: Character): SavingThrows {
  return useMemo(() => {
    // Base saving throw table for BFRPG classes by level
    const getBaseSavingThrows = (level: number, characterClass: string) => {
      const classLower = characterClass.toLowerCase();
      
      // Base saving throw values by class type and level (based on actual BFRPG tables)
      // [Death Ray/Poison, Magic Wands, Paralysis/Petrify, Dragon Breath, Spells]
      
      // Cleric-based classes (Cleric, Druid)
      if (classLower === "cleric" || classLower === "druid") {
        if (level >= 20) return [5, 6, 9, 11, 10];
        if (level >= 18) return [6, 7, 9, 11, 10];
        if (level >= 16) return [6, 7, 10, 12, 11];
        if (level >= 14) return [7, 8, 10, 12, 11];
        if (level >= 12) return [7, 8, 11, 13, 12];
        if (level >= 10) return [8, 9, 11, 13, 12];
        if (level >= 8) return [8, 9, 12, 14, 13];
        if (level >= 6) return [9, 10, 12, 14, 13];
        if (level >= 4) return [9, 10, 13, 15, 14];
        if (level >= 2) return [10, 11, 13, 15, 14];
        if (level >= 1) return [11, 12, 14, 16, 15];
        return [11, 12, 14, 16, 15];
      }
      
      // Magic-User-based classes (Magic-User, Illusionist, Necromancer, Spellcrafter)
      if (classLower === "magic-user" || classLower === "illusionist" || classLower === "necromancer" || classLower === "spellcrafter") {
        if (level >= 20) return [8, 6, 5, 11, 8];
        if (level >= 18) return [9, 7, 6, 11, 9];
        if (level >= 16) return [9, 8, 7, 12, 9];
        if (level >= 14) return [10, 9, 8, 12, 10];
        if (level >= 12) return [10, 10, 9, 13, 11];
        if (level >= 10) return [11, 10, 9, 13, 11];
        if (level >= 8) return [11, 11, 10, 14, 12];
        if (level >= 6) return [12, 12, 11, 14, 13];
        if (level >= 4) return [12, 13, 12, 15, 13];
        if (level >= 2) return [13, 14, 13, 15, 14];
        if (level >= 1) return [13, 14, 13, 16, 15];
        return [13, 14, 13, 16, 15];
      }
      
      // Fighter-based classes (Fighter, Barbarian, Ranger, Paladin)
      if (classLower === "fighter" || classLower === "barbarian" || classLower === "ranger" || classLower === "paladin") {
        if (level >= 20) return [5, 6, 8, 9, 10];
        if (level >= 18) return [6, 7, 8, 10, 11];
        if (level >= 16) return [7, 7, 9, 10, 11];
        if (level >= 14) return [7, 8, 10, 11, 12];
        if (level >= 12) return [8, 9, 10, 12, 13];
        if (level >= 10) return [9, 9, 11, 12, 13];
        if (level >= 8) return [9, 10, 12, 13, 14];
        if (level >= 6) return [10, 11, 12, 14, 15];
        if (level >= 4) return [11, 12, 13, 14, 15];
        if (level >= 2) return [11, 12, 14, 15, 16];
        if (level >= 1) return [12, 13, 14, 15, 17];
        return [13, 14, 15, 16, 18]; // Normal Man (0 level)
      }
      
      // Thief-based classes (Thief, Assassin, Scout)
      if (classLower === "thief" || classLower === "assassin" || classLower === "scout") {
        if (level >= 20) return [6, 8, 8, 6, 8];
        if (level >= 18) return [7, 9, 8, 7, 9];
        if (level >= 16) return [7, 9, 9, 8, 9];
        if (level >= 14) return [8, 10, 9, 9, 10];
        if (level >= 12) return [9, 10, 10, 10, 11];
        if (level >= 10) return [9, 12, 10, 11, 11];
        if (level >= 8) return [10, 12, 11, 12, 12];
        if (level >= 6) return [11, 13, 11, 13, 13];
        if (level >= 4) return [11, 13, 12, 14, 13];
        if (level >= 2) return [12, 14, 12, 15, 14];
        if (level >= 1) return [13, 14, 13, 16, 15];
        return [13, 14, 13, 16, 15];
      }
      
      // Default for unknown classes (use Fighter table)
      if (level >= 1) return [12, 13, 14, 15, 17];
      return [13, 14, 15, 16, 18];
    };

    // Get racial saving throw bonuses based on actual BFRPG rules
    const getRacialSavingThrowBonuses = () => {
      // Initialize bonuses array [Death Ray/Poison, Magic Wands, Paralysis/Petrify, Dragon Breath, Spells]
      const bonuses = [0, 0, 0, 0, 0];
      
      // Apply bonuses based on race (these are subtracted from the target number as lower is better)
      switch (character.race) {
        case "dwarf":
          bonuses[0] = 4; // Death Ray or Poison
          bonuses[1] = 4; // Magic Wands
          bonuses[2] = 4; // Paralysis or Petrify
          bonuses[3] = 3; // Dragon Breath
          bonuses[4] = 4; // Spells
          break;
        case "elf":
          bonuses[1] = 2; // Magic Wands
          bonuses[2] = 1; // Paralysis or Petrify
          bonuses[4] = 2; // Spells
          break;
        case "halfling":
          bonuses[0] = 4; // Death Ray or Poison
          bonuses[1] = 4; // Magic Wands
          bonuses[2] = 4; // Paralysis or Petrify
          bonuses[3] = 3; // Dragon Breath
          bonuses[4] = 4; // Spells
          break;
        case "human":
        default:
          // Humans have no racial bonuses
          break;
      }
      
      return bonuses;
    };

    // Get the primary class (first in array for multi-class characters)
    const primaryClass = character.class?.[0] || "";
    
    // Calculate base saving throws
    const baseSavingThrows = getBaseSavingThrows(character.level || 1, primaryClass);
    
    // Get racial bonuses
    const racialBonuses = getRacialSavingThrowBonuses();
    
    // Apply bonuses to base values (lower is better in BFRPG)
    const finalSavingThrows = baseSavingThrows.map((base, index) => 
      Math.max(1, base - (racialBonuses[index] || 0))
    );

    return {
      deathRayOrPoison: finalSavingThrows[0] || 12,
      magicWands: finalSavingThrows[1] || 13,
      paralysisOrPetrify: finalSavingThrows[2] || 14,
      dragonBreath: finalSavingThrows[3] || 15,
      spells: finalSavingThrows[4] || 16,
      racialBonuses,
    };
  }, [character.level, character.class, character.race]);
}