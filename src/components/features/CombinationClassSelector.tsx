import { Select, Callout } from "@/components/ui";
import type { Character } from "@/types/character";
import { memo } from "react";

interface CombinationClassSelectorProps {
  character: Character;
  validCombinations: Array<{ ids: string[]; name: string }>;
  onCombinationChange: (combinationName: string) => void;
}

function CombinationClassSelectorComponent({
  character,
  validCombinations,
  onCombinationChange,
}: CombinationClassSelectorProps) {
  const combinationClassOptions = validCombinations.map((combo) => ({
    value: combo.name,
    label: combo.name,
  }));

  const getCurrentCombination = () => {
    return validCombinations.find(
      (combo) =>
        combo.ids.length === character.class.length &&
        combo.ids.every((id) => character.class.includes(id))
    );
  };

  const currentCombination = getCurrentCombination();

  return (
    <section aria-labelledby="combination-classes-heading">
      <h5 id="combination-classes-heading">Combination Classes</h5>
      <Select
        label="Select Combination Class"
        value={currentCombination ? currentCombination.name : ""}
        onValueChange={onCombinationChange}
        options={combinationClassOptions}
        placeholder="Choose a combination class"
        required
        aria-describedby={
          character.class.length > 1 ? "combination-class-details" : undefined
        }
      />

      {character.class.length > 1 && currentCombination && (
        <Callout
          variant="neutral"
          title={currentCombination.name}
          id="combination-class-details"
        >
          <div aria-labelledby="combination-class-info-heading">
            <p className="mb-3">
              This combination class combines the abilities of{" "}
              {character.class.join(" and ")}.
            </p>
            <dl className="mb-0">
              <dt className="font-semibold text-zinc-300">Classes:</dt>
              <dd className="mb-0">{character.class.join(", ")}</dd>
            </dl>
          </div>
        </Callout>
      )}
    </section>
  );
}

export const CombinationClassSelector = memo(CombinationClassSelectorComponent);
