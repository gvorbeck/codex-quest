import { Select, Callout } from "@/components/ui";
import type { Character, Class } from "@/types/character";
import { memo } from "react";

interface StandardClassSelectorProps {
  character: Character;
  availableClasses: Class[];
  onClassChange: (classId: string) => void;
}

function StandardClassSelectorComponent({
  character,
  availableClasses,
  onClassChange,
}: StandardClassSelectorProps) {
  const classOptions = availableClasses.map((cls) => ({
    value: cls.id,
    label: cls.name,
  }));

  return (
    <section aria-labelledby="standard-classes-heading">
      <h5 id="standard-classes-heading">Standard Classes</h5>
      <Select
        label="Select Class"
        value={character.class.length > 0 ? character.class[0] : ""}
        onValueChange={onClassChange}
        options={classOptions}
        placeholder="Choose a class"
        required
        aria-describedby={
          character.class.length > 0 ? "class-details" : undefined
        }
      />

      {character.class.length > 0 && (
        <Callout variant="neutral" id="class-details">
          {(() => {
            const selectedClass = availableClasses.find(
              (cls) => cls.id === character.class[0]
            );
            return selectedClass ? (
              <div aria-labelledby="class-info-heading">
                <h6
                  id="class-info-heading"
                  className="font-semibold mb-3 text-amber-400"
                >
                  {selectedClass.name}
                </h6>
                <p className="mb-4">{selectedClass.description}</p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-0">
                  <div>
                    <dt className="font-semibold text-zinc-300">Hit Die:</dt>
                    <dd className="mb-0">{selectedClass.hitDie}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-zinc-300">
                      Primary Attribute:
                    </dt>
                    <dd className="mb-0">{selectedClass.primaryAttribute}</dd>
                  </div>
                </dl>
              </div>
            ) : null;
          })()}
        </Callout>
      )}
    </section>
  );
}

export const StandardClassSelector = memo(StandardClassSelectorComponent);
