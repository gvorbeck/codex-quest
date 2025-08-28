import { Button } from "@/components/ui";

interface ActionButtonsProps {
  canLevelUp: boolean;
  hasRequiredXP: boolean;
  isProcessing: boolean;
  onClose: () => void;
  onLevelUp: () => void;
}

export default function ActionButtons({
  canLevelUp,
  hasRequiredXP,
  isProcessing,
  onClose,
  onLevelUp,
}: ActionButtonsProps) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
      <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={onLevelUp}
        disabled={!canLevelUp || isProcessing}
        loading={isProcessing}
        loadingText="Leveling up..."
        className="min-w-[120px]"
      >
        {hasRequiredXP ? "Level Up!" : "Not Ready"}
      </Button>
    </div>
  );
}
