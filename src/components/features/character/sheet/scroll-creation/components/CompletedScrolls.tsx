import type { ScrollCreationProject } from "@/types";
import { Badge, Card, Typography } from "@/components/ui/core/display";
import { Button } from "@/components/ui/core/primitives";
import { SectionHeader } from "@/components/ui/composite";

interface CompletedScrollsProps {
  projects: ScrollCreationProject[];
  isOwner: boolean;
  onDeleteProject: (projectId: string) => void;
}

export const CompletedScrolls = ({
  projects,
  isOwner,
  onDeleteProject,
}: CompletedScrollsProps) => {
  if (projects.length === 0) return null;

  return (
    <div>
      <SectionHeader title="Completed Scrolls" size="md" className="mb-3" />
      <div className="space-y-2">
        {projects.map((project) => (
          <Card key={project.id} className="p-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Typography variant="body">{project.spellName}</Typography>
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
                    onClick={() => onDeleteProject(project.id)}
                    icon="close"
                    iconClasses="w-3 h-3"
                    title="Delete completed scroll"
                  />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
