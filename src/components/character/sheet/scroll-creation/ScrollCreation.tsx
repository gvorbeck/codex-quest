import { useModal } from "@/hooks";
import type { Character } from "@/types";
import { SectionWrapper } from "@/components/ui/layout";
import { Button } from "@/components/ui/inputs";

import { useScrollCreation } from "./hooks/useScrollCreation";
import { useScrollActions } from "./hooks/useScrollActions";
import {
  SpellcrafterBonuses,
  ActiveScrolls,
  CompletedScrolls,
  ScrollCreationModal,
  EmptyState,
} from "./components";

interface ScrollCreationProps {
  character: Character;
  onCharacterChange?: (character: Character) => void;
  isOwner?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
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

  const {
    canCreateScrolls,
    scrollCreationBonuses,
    projects,
    activeProjects,
    completedProjects,
    calculateScrollCost,
    calculateScrollTime,
    calculateSuccessRate,
  } = useScrollCreation(character);

  const { createProject, updateProject, completeProject, deleteProject } =
    useScrollActions({
      character,
      onCharacterChange,
      scrollCreationBonuses,
      calculateScrollCost,
      calculateScrollTime,
    });

  if (!canCreateScrolls) {
    return null; // Don't render for non-Spellcrafters
  }

  return (
    <>
      <SectionWrapper
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
            <SpellcrafterBonuses bonuses={scrollCreationBonuses} />
          )}

          {/* Active Scrolls */}
          <ActiveScrolls
            projects={activeProjects}
            isOwner={isOwner}
            onUpdateProject={updateProject}
            onCompleteProject={completeProject}
            onDeleteProject={deleteProject}
          />

          {/* Completed Scrolls */}
          <CompletedScrolls
            projects={completedProjects}
            isOwner={isOwner}
            onDeleteProject={deleteProject}
          />
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <EmptyState isOwner={isOwner} onCreateScroll={openCreateModal} />
        )}
      </SectionWrapper>

      {/* Create Scroll Modal */}
      <ScrollCreationModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onCreateProject={createProject}
        calculateScrollCost={calculateScrollCost}
        calculateScrollTime={calculateScrollTime}
        calculateSuccessRate={calculateSuccessRate}
      />
    </>
  );
}
