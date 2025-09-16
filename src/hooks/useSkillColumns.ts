import { useMemo } from "react";
import { allClasses } from "@/data/classes";
import { ALL_SKILLS, type SkillKey } from "@/constants";
import type { TableColumn } from "@/components/ui/display/Table";
import type { ClassSkillData, SkillTableRow } from "./useSkillDataByClass";

/**
 * Custom hook to create table columns for skill classes
 * Includes proper tooltips and accessibility attributes
 */
export const useSkillColumns = (classSkillData: ClassSkillData): TableColumn<SkillTableRow>[] => {
  return useMemo(() => {
    const skillsToShow = Object.keys(ALL_SKILLS).filter(skillKey => {
      // Only show skills that this class actually has
      const classData = allClasses.find(cls => cls.id === classSkillData.classId);
      return classData?.skills?.[1]?.[skillKey] !== undefined;
    }) as SkillKey[];

    const columns: TableColumn<SkillTableRow>[] = [
      {
        key: "level",
        header: "Level",
        width: "80px",
        align: "center",
        cell: (data) => data.level.toString(),
        ariaLabel: "Character level"
      }
    ];

    // Add character name column if there are player characters
    if (classSkillData.skills.some(skill => skill.isPlayer)) {
      columns.push({
        key: "characterName",
        header: "Character",
        width: "140px",
        cell: (data) => data.characterName || "—",
        ariaLabel: "Character name"
      });
    }

    // Add columns for each skill
    skillsToShow.forEach(skillKey => {
      const skillName = ALL_SKILLS[skillKey];
      
      columns.push({
        key: skillKey,
        header: skillName,
        width: "80px",
        align: "center",
        cell: (data) => {
          const value = data[skillKey];
          return typeof value === 'number' ? `${value}%` : "—";
        },
        ariaLabel: `${skillName} percentage chance`
      });
    });

    return columns;
  }, [classSkillData.classId, classSkillData.skills]);
};