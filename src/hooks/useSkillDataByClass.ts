import { useMemo } from "react";
import { allClasses } from "@/data/classes";
import { 
  CLASSES_WITH_SKILLS, 
  type SkillClassKey 
} from "@/constants";
import type { CharacterListItem } from "@/services/characters";
import type { Game } from "@/types/game";
import { logger } from "@/utils/logger";

export interface SkillTableRow {
  id: string;
  level: number;
  characterName?: string;
  isPlayer: boolean;
  userId: string | undefined;
  characterId?: string;
  [skillKey: string]: string | number | boolean | undefined;
}

export interface ClassSkillData {
  classId: SkillClassKey;
  displayName: string;
  skills: SkillTableRow[];
}

/**
 * Custom hook to organize player character skill data by class
 * Groups characters by skill classes and generates skill progression tables
 */
export const useSkillDataByClass = (
  playerCharacters: CharacterListItem[], 
  game: Game
): ClassSkillData[] => {
  return useMemo((): ClassSkillData[] => {
    if (!playerCharacters.length) return [];

    // Group player characters by skill classes
    const classGroups: Record<SkillClassKey, CharacterListItem[]> = {} as Record<SkillClassKey, CharacterListItem[]>;
    
    playerCharacters.forEach(character => {
      const characterClasses = Array.isArray(character.class) 
        ? character.class 
        : [character.class].filter(Boolean);
        
      characterClasses.forEach(className => {
        if (className && className in CLASSES_WITH_SKILLS) {
          const skillClassName = className as SkillClassKey;
          if (!classGroups[skillClassName]) {
            classGroups[skillClassName] = [];
          }
          classGroups[skillClassName].push(character);
        }
      });
    });

    // Build skill data for each class
    const result = Object.entries(classGroups).map(([classId, characters]) => {
      const skillClassId = classId as SkillClassKey;
      const classData = allClasses.find(cls => cls.id === skillClassId);
      const classInfo = CLASSES_WITH_SKILLS[skillClassId];

      if (!classData?.skills) {
        logger.warn(`Missing skills data for class: ${skillClassId}`);
        return {
          classId: skillClassId,
          displayName: classInfo.displayName,
          skills: []
        };
      }

      // Generate rows for all levels (1-20) with player data highlighted
      const skillRows: SkillTableRow[] = [];
      
      // Add level progression rows
      for (let level = 1; level <= 20; level++) {
        const skillsForLevel = classData.skills[level];
        if (!skillsForLevel) continue;

        // Check if any player characters are at this level
        const playersAtLevel = characters.filter(char => (char.level as number) === level);
        
        if (playersAtLevel.length > 0) {
          // Add a row for each player at this level
          playersAtLevel.forEach(character => {
            const row: SkillTableRow = {
              id: `${skillClassId}-${level}-${character.name || 'unnamed'}`,
              level,
              characterName: character.name,
              isPlayer: true,
              userId: game.players?.find(p => p.character === character.id)?.user,
              characterId: character.id,
            };

            // Add skill values
            Object.entries(skillsForLevel).forEach(([skillKey, value]) => {
              row[skillKey] = value;
            });

            skillRows.push(row);
          });
        } else {
          // Add a regular progression row
          const row: SkillTableRow = {
            id: `${skillClassId}-${level}`,
            level,
            isPlayer: false,
            userId: undefined,
          };

          Object.entries(skillsForLevel).forEach(([skillKey, value]) => {
            row[skillKey] = value;
          });

          skillRows.push(row);
        }
      }

      return {
        classId: skillClassId,
        displayName: classInfo.displayName,
        skills: skillRows
      };
    });

    logger.debug("Generated skill data by class", {
      classCount: result.length,
      totalSkillRows: result.reduce((sum, cls) => sum + cls.skills.length, 0)
    });

    return result;
  }, [playerCharacters, game.players]);
};