import { Button } from "@/components/ui/inputs";
import { SectionWrapper } from "@/components/ui/layout";
import type { EncounterType } from "@/types";

interface EncounterTypeSelectorProps {
  selectedType: EncounterType;
  onTypeChange: (type: EncounterType) => void;
}

const ENCOUNTER_TYPES: { type: EncounterType; label: string }[] = [
  { type: "dungeon", label: "Dungeon" },
  { type: "wilderness", label: "Wilderness" },
  { type: "city", label: "City" },
];

export default function EncounterTypeSelector({
  selectedType,
  onTypeChange,
}: EncounterTypeSelectorProps) {
  return (
    <SectionWrapper title="Encounter Type">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Choose encounter type"
        aria-describedby="encounter-type-help"
      >
        {ENCOUNTER_TYPES.map(({ type, label }) => (
          <Button
            key={type}
            variant={selectedType === type ? "primary" : "secondary"}
            size="sm"
            onClick={() => onTypeChange(type)}
            className="capitalize"
            aria-pressed={selectedType === type}
          >
            {label}
          </Button>
        ))}
      </div>
      <div id="encounter-type-help" className="sr-only">
        Select the type of encounter to generate: dungeon, wilderness, or city
      </div>
    </SectionWrapper>
  );
}
