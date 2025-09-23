import type { ScrollCreationProject } from "@/types";
import { Badge, Card, Typography } from "@/components/ui/core/display";
import { Button, NumberInput, FormField } from "@/components/ui/core/primitives";
import { SectionHeader } from "@/components/ui/composite";

interface ActiveScrollsProps {
  projects: ScrollCreationProject[];
  isOwner: boolean;
  onUpdateProject: (
    projectId: string,
    updates: Partial<ScrollCreationProject>
  ) => void;
  onCompleteProject: (project: ScrollCreationProject) => void;
  onDeleteProject: (projectId: string) => void;
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

export const ActiveScrolls = ({
  projects,
  isOwner,
  onUpdateProject,
  onCompleteProject,
  onDeleteProject,
}: ActiveScrollsProps) => {
  if (projects.length === 0) return null;

  return (
    <div className="mb-6">
      <SectionHeader title="Active Scrolls" size="md" className="mb-3" />
      <div className="space-y-3">
        {projects.map((project) => (
          <Card key={project.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Typography variant="h5">{project.spellName}</Typography>
                <div className="flex items-center gap-2 mt-1">
                  <Badge>Level {project.spellLevel}</Badge>
                  <Badge variant={getStatusBadgeVariant(project.status)}>
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
                      onClick={() => onCompleteProject(project)}
                      title="Complete scroll and add to inventory"
                    >
                      Complete
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onDeleteProject(project.id)}
                    icon="close"
                    iconSize="xs"
                    title="Delete scroll"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Progress:</strong> {formatProgress(project)}
              </div>
              <div>
                <strong>Cost:</strong> {project.costPaid}/{project.costTotal} gp
              </div>
            </div>

            {project.notes && (
              <div className="mt-2 text-sm">
                <strong>Notes:</strong> {project.notes}
              </div>
            )}

            {isOwner && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <FormField label="Days completed" labelClassName="text-xs">
                  <NumberInput
                    value={project.daysCompleted}
                    onChange={(value) =>
                      onUpdateProject(project.id, {
                        daysCompleted: value || 0,
                      })
                    }
                    minValue={0}
                    maxValue={project.daysRequired}
                  />
                </FormField>
                <FormField label="Cost paid (gp)" labelClassName="text-xs">
                  <NumberInput
                    value={project.costPaid}
                    onChange={(value) =>
                      onUpdateProject(project.id, {
                        costPaid: value || 0,
                      })
                    }
                    minValue={0}
                    maxValue={project.costTotal}
                  />
                </FormField>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
