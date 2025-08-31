import { useState, useMemo } from "react";
import { useModal } from "@/hooks/useModal";
import type { Character, ScrollCreationProject } from "@/types/character";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import { Badge, Card, Typography } from "@/components/ui/design-system";
import { Button, NumberInput, TextArea, TextInput } from "@/components/ui/inputs";
import { Modal } from "@/components/ui/feedback";
import { SectionHeader } from "@/components/ui/display";

// Constants for Spellcrafter bonuses and scroll creation rules (BFRPG Core Rules)
const SCROLL_CREATION_CONSTANTS = {
  // Spellcrafter bonuses
  RESEARCH_ROLL_BONUS: 25, // +25% bonus to magical research rolls
  TIME_REDUCTION_THRESHOLD: 6, // Level at which time reduction kicks in
  TIME_REDUCTION_PERCENT: 50, // 50% time reduction at 6th level
  COST_REDUCTION_THRESHOLD: 9, // Level at which cost reduction kicks in
  COST_REDUCTION_PERCENT: 25, // 25% cost reduction at 9th level
  
  // BFRPG Core Rules for scroll creation
  BASE_COST_PER_LEVEL: 50, // 50 gp per spell level
  BASE_TIME_PER_LEVEL: 1, // 1 day per spell level
  BASE_SUCCESS_RATE: 15, // 15% base success rate
  SUCCESS_RATE_PER_LEVEL: 5, // +5% per caster level
  SPELL_LEVEL_PENALTY: 10, // -10% per spell level being inscribed
  MIN_SUCCESS_RATE: 5, // Minimum 5% success rate
  MAX_SUCCESS_RATE: 95, // Maximum 95% success rate
  MIN_TIME_DAYS: 1, // Minimum 1 day for any scroll
} as const;

// Simple ID generation utility
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
};

// Helper to create scroll creation object with proper typing
const createScrollCreationObject = (
  projects: ScrollCreationProject[],
  totalScrollsCreated?: number,
  bonuses?: {
    researchRollBonus: number;
    timeReduction: number;
    costReduction: number;
  }
): NonNullable<Character["scrollCreation"]> => {
  const result: NonNullable<Character["scrollCreation"]> = { projects };

  if (totalScrollsCreated !== undefined) {
    result.totalScrollsCreated = totalScrollsCreated;
  }

  if (bonuses) {
    result.bonuses = bonuses;
  }

  return result;
};

// Form label component for consistency with other character sheet components
const FormLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <label className={`block text-sm font-medium text-zinc-200 mb-1 ${className}`}>
    {children}
  </label>
);

// Custom hook for scroll success rate calculation
const useScrollSuccessRate = (
  spellcrafterLevel: number,
  intelligenceScore: number,
  researchRollBonus?: number
) => {
  return useMemo(() => (spellLevel: number): number => {
    const baseRate = 
      SCROLL_CREATION_CONSTANTS.BASE_SUCCESS_RATE +
      SCROLL_CREATION_CONSTANTS.SUCCESS_RATE_PER_LEVEL * spellcrafterLevel +
      intelligenceScore;
    const spellPenalty = spellLevel * SCROLL_CREATION_CONSTANTS.SPELL_LEVEL_PENALTY;
    const spellcrafterBonus = researchRollBonus || 0;

    return Math.max(
      SCROLL_CREATION_CONSTANTS.MIN_SUCCESS_RATE,
      Math.min(SCROLL_CREATION_CONSTANTS.MAX_SUCCESS_RATE, baseRate - spellPenalty + spellcrafterBonus)
    );
  }, [spellcrafterLevel, intelligenceScore, researchRollBonus]);
};

interface ScrollCreationProps {
  character: Character;
  onCharacterChange?: (character: Character) => void;
  isOwner?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface NewScrollProjectForm {
  spellName: string;
  spellLevel: number;
  notes: string;
}

export default function ScrollCreation({
  character,
  onCharacterChange,
  isOwner = false,
  className = "",
  size = "md",
}: ScrollCreationProps) {
  const {
    isOpen: isCreateModalOpen,
    open: openCreateModal,
    close: closeCreateModal,
  } = useModal();

  const [newProject, setNewProject] = useState<NewScrollProjectForm>({
    spellName: "",
    spellLevel: 1,
    notes: "",
  });

  // Check if character is a Spellcrafter and calculate bonuses
  const spellcrafterLevel = useMemo(() => {
    const spellcrafterClass = character.class.find(
      (cls) => cls === "spellcrafter"
    );
    return spellcrafterClass ? character.level : 0;
  }, [character.class, character.level]);

  const canCreateScrolls = spellcrafterLevel >= 1;

  const scrollCreationBonuses = useMemo(() => {
    if (spellcrafterLevel === 0) return null;

    return {
      researchRollBonus: SCROLL_CREATION_CONSTANTS.RESEARCH_ROLL_BONUS,
      timeReduction: spellcrafterLevel >= SCROLL_CREATION_CONSTANTS.TIME_REDUCTION_THRESHOLD 
        ? SCROLL_CREATION_CONSTANTS.TIME_REDUCTION_PERCENT 
        : 0,
      costReduction: spellcrafterLevel >= SCROLL_CREATION_CONSTANTS.COST_REDUCTION_THRESHOLD 
        ? SCROLL_CREATION_CONSTANTS.COST_REDUCTION_PERCENT 
        : 0,
    };
  }, [spellcrafterLevel]);

  // Use custom hook for success rate calculation
  const calculateSuccessRate = useScrollSuccessRate(
    spellcrafterLevel,
    character.abilities.intelligence?.value || 10,
    scrollCreationBonuses?.researchRollBonus
  );

  // Get current projects
  const projects = character.scrollCreation?.projects || [];
  const activeProjects = projects.filter((p) => p.status === "in-progress");
  const completedProjects = projects.filter((p) => p.status === "completed");

  // Calculate scroll creation costs and time based on BFRPG Core Rules
  const calculateScrollCost = (spellLevel: number): number => {
    const baseCost = spellLevel * SCROLL_CREATION_CONSTANTS.BASE_COST_PER_LEVEL;
    const reduction = scrollCreationBonuses?.costReduction || 0;
    return Math.floor(baseCost * (1 - reduction / 100));
  };

  const calculateScrollTime = (spellLevel: number): number => {
    const baseDays = spellLevel * SCROLL_CREATION_CONSTANTS.BASE_TIME_PER_LEVEL;
    const reduction = scrollCreationBonuses?.timeReduction || 0;
    return Math.max(SCROLL_CREATION_CONSTANTS.MIN_TIME_DAYS, Math.floor(baseDays * (1 - reduction / 100)));
  };

  const handleCreateProject = () => {
    if (!onCharacterChange || !newProject.spellName.trim()) return;

    const notes = newProject.notes.trim();
    const project: ScrollCreationProject = {
      id: generateId(),
      spellName: newProject.spellName.trim(),
      spellLevel: newProject.spellLevel,
      startDate: new Date().toISOString(),
      daysRequired: calculateScrollTime(newProject.spellLevel),
      daysCompleted: 0,
      costTotal: calculateScrollCost(newProject.spellLevel),
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

    // Reset form
    setNewProject({
      spellName: "",
      spellLevel: 1,
      notes: "",
    });

    closeCreateModal();
  };

  const handleUpdateProject = (
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
  };

  const handleCompleteProject = (project: ScrollCreationProject) => {
    if (!onCharacterChange) return;

    // Mark project as completed
    handleUpdateProject(project.id, {
      status: "completed",
      daysCompleted: project.daysRequired,
    });

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
      } spell (${project.spellLevel}${
        project.spellLevel === 1
          ? "st"
          : project.spellLevel === 2
          ? "nd"
          : project.spellLevel === 3
          ? "rd"
          : "th"
      } level).`,
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
  };

  const handleDeleteProject = (projectId: string) => {
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
  };

  if (!canCreateScrolls) {
    return null; // Don't render for non-Spellcrafters
  }

  const getStatusBadgeVariant = (status: ScrollCreationProject["status"]) => {
    switch (status) {
      case "completed":
        return "primary";
      case "in-progress":
        return "primary";
      case "paused":
        return "secondary";
      case "failed":
        return "secondary";
      default:
        return "primary";
    }
  };

  const formatProgress = (project: ScrollCreationProject): string => {
    const percentage = Math.round(
      (project.daysCompleted / project.daysRequired) * 100
    );
    return `${project.daysCompleted}/${project.daysRequired} days (${percentage}%)`;
  };

  return (
    <>
      <CharacterSheetSectionWrapper
        title={
          <div className="flex justify-between items-center w-full gap-4">
            <span>Scroll Creation</span>
            {isOwner && (
              <Button
                size="sm"
                onClick={openCreateModal}
                className="text-xs"
                disabled={!canCreateScrolls}
                title={
                  !canCreateScrolls
                    ? "Must be a Spellcrafter to create scrolls"
                    : "Start new scroll"
                }
              >
                + New Scroll
              </Button>
            )}
          </div>
        }
        className={className}
        size={size}
      >
        <div className="p-4">
          {/* Spellcrafter Bonuses Info */}
          {scrollCreationBonuses && (
            <div className="mb-6">
              <SectionHeader title="Spellcrafter Bonuses" size="md" className="mb-3" />
              <Card className="p-4">
                <div className="space-y-1 text-sm">
                  <div>
                    ✨ +{scrollCreationBonuses.researchRollBonus}% research roll
                    bonus
                  </div>
                  {scrollCreationBonuses.timeReduction > 0 && (
                    <div>
                      ⚡ {scrollCreationBonuses.timeReduction}% time reduction
                      (6th level)
                    </div>
                  )}
                  {scrollCreationBonuses.costReduction > 0 && (
                    <div>
                      💰 {scrollCreationBonuses.costReduction}% cost reduction
                      (9th level)
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Active Scrolls */}
          {activeProjects.length > 0 && (
            <div className="mb-6">
              <SectionHeader title="Active Scrolls" size="md" className="mb-3" />
              <div className="space-y-3">
                {activeProjects.map((project) => (
                  <Card key={project.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Typography variant="h5">
                          {project.spellName}
                        </Typography>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge>Level {project.spellLevel}</Badge>
                          <Badge
                            variant={getStatusBadgeVariant(project.status)}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                      {isOwner && (
                        <div className="flex gap-1">
                          {project.daysCompleted >= project.daysRequired && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleCompleteProject(project)}
                              title="Complete scroll and add to inventory"
                            >
                              Complete
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDeleteProject(project.id)}
                            title="Delete scroll"
                          >
                            ✕
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Progress:</strong> {formatProgress(project)}
                      </div>
                      <div>
                        <strong>Cost:</strong> {project.costPaid}/
                        {project.costTotal} gp
                      </div>
                    </div>

                    {project.notes && (
                      <div className="mt-2 text-sm">
                        <strong>Notes:</strong> {project.notes}
                      </div>
                    )}

                    {isOwner && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div>
                          <FormLabel className="text-xs">Days completed</FormLabel>
                          <NumberInput
                            value={project.daysCompleted}
                            onChange={(value) =>
                              handleUpdateProject(project.id, {
                                daysCompleted: value || 0,
                              })
                            }
                            minValue={0}
                            maxValue={project.daysRequired}
                          />
                        </div>
                        <div>
                          <FormLabel className="text-xs">Cost paid (gp)</FormLabel>
                          <NumberInput
                            value={project.costPaid}
                            onChange={(value) =>
                              handleUpdateProject(project.id, {
                                costPaid: value || 0,
                              })
                            }
                            minValue={0}
                            maxValue={project.costTotal}
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Scrolls */}
          {completedProjects.length > 0 && (
            <div>
              <SectionHeader title="Completed Scrolls" size="md" className="mb-3" />
              <div className="space-y-2">
                {completedProjects.map((project) => (
                  <Card key={project.id} className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Typography variant="body">
                          {project.spellName}
                        </Typography>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge size="sm">Level {project.spellLevel}</Badge>
                          <Badge variant="primary" size="sm">
                            Completed
                          </Badge>
                        </div>
                        {project.notes && (
                          <div className="mt-2 text-sm text-zinc-300">
                            <strong>Notes:</strong> {project.notes}
                          </div>
                        )}
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="text-right text-sm text-zinc-400">
                          <div>{project.costTotal} gp</div>
                          <div>
                            {project.daysRequired}{" "}
                            {project.daysRequired === 1 ? "day" : "days"}
                          </div>
                        </div>
                        {isOwner && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDeleteProject(project.id)}
                            title="Delete completed scroll"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <Card className="p-6 text-center">
            <div className="mx-auto mb-3 text-zinc-400 text-2xl">📜</div>
            <Typography variant="body" className="text-zinc-400 mb-3">
              No scrolls created yet.
            </Typography>
            {isOwner && (
              <Button onClick={openCreateModal}>
                Create Your First Scroll
              </Button>
            )}
          </Card>
        )}
      </CharacterSheetSectionWrapper>

      {/* Create Scroll Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        title="Create New Scroll"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <FormLabel>Spell Name</FormLabel>
            <TextInput
              value={newProject.spellName}
              onChange={(value) =>
                setNewProject((prev) => ({
                  ...prev,
                  spellName: value,
                }))
              }
              placeholder="Enter spell name..."
            />
          </div>

          <div>
            <FormLabel>Spell Level</FormLabel>
            <NumberInput
              value={newProject.spellLevel}
              onChange={(value) =>
                setNewProject((prev) => ({ ...prev, spellLevel: value || 1 }))
              }
              minValue={1}
              maxValue={9}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 p-3 bg-zinc-800 rounded-md">
            <div>
              <strong>Estimated Cost:</strong>
              <br />
              {calculateScrollCost(newProject.spellLevel)} gp
            </div>
            <div>
              <strong>Estimated Time:</strong>
              <br />
              {calculateScrollTime(newProject.spellLevel)}{" "}
              {calculateScrollTime(newProject.spellLevel) === 1
                ? "day"
                : "days"}
            </div>
            <div>
              <strong>Success Rate:</strong>
              <br />
              {calculateSuccessRate(newProject.spellLevel)}%
            </div>
          </div>

          <div>
            <FormLabel>Notes (Optional)</FormLabel>
            <TextArea
              value={newProject.notes}
              onChange={(value) =>
                setNewProject((prev) => ({ ...prev, notes: value }))
              }
              placeholder="Add any notes about this project..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCreateProject}
              disabled={!newProject.spellName.trim()}
              className="flex-1"
            >
              Start Scroll
            </Button>
            <Button variant="secondary" onClick={closeCreateModal}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
