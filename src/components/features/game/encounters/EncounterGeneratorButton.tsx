import { Button } from "@/components/ui/core/primitives";
import { Icon } from "@/components/ui/core/display";
import { LoadingState } from "@/components/ui/core/feedback";
import type { EncounterType } from "@/types";

interface EncounterGeneratorButtonProps {
  encounterType: EncounterType;
  isGenerating: boolean;
  hasTable: boolean;
  onGenerate: () => void;
}

export default function EncounterGeneratorButton({
  encounterType,
  isGenerating,
  hasTable,
  onGenerate,
}: EncounterGeneratorButtonProps) {
  return (
    <div className="space-y-4">
      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={onGenerate}
          disabled={isGenerating || !hasTable}
          className="w-14 h-14 p-0"
          aria-label={`Generate random ${encounterType} encounter${
            hasTable ? "" : " (no encounters available)"
          }`}
          title={`Generate random ${encounterType} encounter`}
          role="button"
        >
          <Icon
            name="dice"
            size="md"
            className={isGenerating ? "animate-spin" : ""}
            aria-hidden={true}
          />
        </Button>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="flex justify-center" role="status" aria-live="polite">
          <LoadingState variant="inline" message="Rolling for encounter..." />
        </div>
      )}
    </div>
  );
}
