import { useCallback, useMemo } from "react";
import type { Character, ScrollCreationProject } from "@/types/character";
import { formatSpellLevel } from "@/utils/spellSystem";
import { generateId, createScrollCreationObject } from "./useScrollCreation";

interface UseScrollActionsProps {
  character: Character;
  onCharacterChange: ((character: Character) => void) | undefined;
  scrollCreationBonuses: {
    researchRollBonus: number;
    timeReduction: number;
    costReduction: number;
  } | null;
  calculateScrollCost: (spellLevel: number) => number;
  calculateScrollTime: (spellLevel: number) => number;
}

export const useScrollActions = ({
  character,
  onCharacterChange,
  scrollCreationBonuses,
  calculateScrollCost,
  calculateScrollTime,
}: UseScrollActionsProps) => {
  const projects = useMemo(() => 
    character.scrollCreation?.projects || [], 
    [character.scrollCreation?.projects]
  );

  const createProject = useCallback((projectData: {
    spellName: string;
    spellLevel: number;
    notes: string;
  }) => {
    if (!onCharacterChange || !projectData.spellName.trim()) return;

    const notes = projectData.notes.trim();
    const project: ScrollCreationProject = {
      id: generateId(),
      spellName: projectData.spellName.trim(),
      spellLevel: projectData.spellLevel,
      startDate: new Date().toISOString(),
      daysRequired: calculateScrollTime(projectData.spellLevel),
      daysCompleted: 0,
      costTotal: calculateScrollCost(projectData.spellLevel),
      costPaid: 0,
      status: "in-progress",
      ...(notes && { notes }),
    };

    const scrollCreation = createScrollCreationObject(
      [...projects, project],
      character.scrollCreation?.totalScrollsCreated,
      scrollCreationBonuses ? scrollCreationBonuses : undefined
    );

    const updatedCharacter: Character = {
      ...character,
      scrollCreation,
    };

    onCharacterChange(updatedCharacter);
  }, [character, onCharacterChange, scrollCreationBonuses, projects, calculateScrollCost, calculateScrollTime]);

  const updateProject = useCallback((
    projectId: string,
    updates: Partial<ScrollCreationProject>
  ) => {
    if (!onCharacterChange) return;

    const updatedProjects = projects.map((project) =>
      project.id === projectId ? { ...project, ...updates } : project
    );

    const scrollCreation = createScrollCreationObject(
      updatedProjects,
      character.scrollCreation?.totalScrollsCreated,
      scrollCreationBonuses || undefined
    );

    const updatedCharacter: Character = {
      ...character,
      scrollCreation,
    };

    onCharacterChange(updatedCharacter);
  }, [character, onCharacterChange, projects, scrollCreationBonuses]);

  const completeProject = useCallback((project: ScrollCreationProject) => {
    if (!onCharacterChange) return;

    // Add scroll to equipment
    const scrollEquipment = {
      name: `Scroll of ${project.spellName}`,
      costValue: project.costTotal,
      costCurrency: "gp" as const,
      weight: 0.1, // Scrolls are very light
      category: "Magic Items",
      subCategory: "Scrolls",
      amount: 1,
      isScroll: true,
      scrollSpell: project.spellName,
      scrollLevel: project.spellLevel,
      description: `A magical scroll containing the ${
        project.spellName
      } spell (${formatSpellLevel(project.spellLevel)} level).`,
    };

    const scrollCreation = createScrollCreationObject(
      projects.map((p) =>
        p.id === project.id
          ? {
              ...p,
              status: "completed" as const,
              daysCompleted: project.daysRequired,
            }
          : p
      ),
      (character.scrollCreation?.totalScrollsCreated || 0) + 1,
      scrollCreationBonuses || undefined
    );

    const updatedCharacter: Character = {
      ...character,
      equipment: [...character.equipment, scrollEquipment],
      scrollCreation,
    };

    onCharacterChange(updatedCharacter);
  }, [character, onCharacterChange, projects, scrollCreationBonuses]);

  const deleteProject = useCallback((projectId: string) => {
    if (!onCharacterChange) return;

    const updatedProjects = projects.filter(
      (project) => project.id !== projectId
    );

    const scrollCreation = createScrollCreationObject(
      updatedProjects,
      character.scrollCreation?.totalScrollsCreated,
      scrollCreationBonuses || undefined
    );

    const updatedCharacter: Character = {
      ...character,
      scrollCreation,
    };

    onCharacterChange(updatedCharacter);
  }, [character, onCharacterChange, projects, scrollCreationBonuses]);

  return {
    createProject,
    updateProject,
    completeProject,
    deleteProject,
  };
};