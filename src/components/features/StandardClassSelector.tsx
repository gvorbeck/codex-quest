import { Select } from "@/components/ui";
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
        <div id="class-details">
          {(() => {
            const selectedClass = availableClasses.find(
              (cls) => cls.id === character.class[0]
            );
            return selectedClass ? (
              <section aria-labelledby="class-info-heading">
                <h6 id="class-info-heading">{selectedClass.name}</h6>
                <p>{selectedClass.description}</p>
                <dl>
                  <dt>Hit Die:</dt>
                  <dd>{selectedClass.hitDie}</dd>
                  <dt>Primary Attribute:</dt>
                  <dd>{selectedClass.primaryAttribute}</dd>
                </dl>
              </section>
            ) : null;
          })()}
        </div>
      )}
    </section>
  );
}

export const StandardClassSelector = memo(StandardClassSelectorComponent);
