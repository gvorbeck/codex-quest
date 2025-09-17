import { Card, Typography } from "@/components/ui/core/display";
import { Button } from "@/components/ui/core/primitives";
import { Icon } from "@/components/ui/core/display";

interface EmptyStateProps {
  isOwner: boolean;
  onCreateScroll: () => void;
}

export const EmptyState = ({ isOwner, onCreateScroll }: EmptyStateProps) => {
  return (
    <Card className="p-6 text-center">
      <div className="mx-auto mb-3">
        <Icon name="clipboard" size="xl" className="text-zinc-400" />
      </div>
      <Typography variant="body" className="text-zinc-400 mb-3">
        No scrolls created yet.
      </Typography>
      {isOwner && (
        <Button onClick={onCreateScroll}>
          Create Your First Scroll
        </Button>
      )}
    </Card>
  );
};