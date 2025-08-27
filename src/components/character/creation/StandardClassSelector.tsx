import { Select } from "@/components/ui/inputs";
import { Card, Typography } from "@/components/ui/design-system";
import { InfoCardHeader, DetailSection } from "@/components/ui/display";
import { Icon } from "@/components/ui";
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
    <section aria-labelledby="standard-classes-heading" className="mb-8">
      <Typography variant="sectionHeading" id="standard-classes-heading">
        Standard Classes
      </Typography>

      <Card variant="standard" className="mb-6">
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
      </Card>

      {character.class.length > 0 && (
        <Card variant="info" id="class-details">
          {(() => {
            const selectedClass = availableClasses.find(
              (cls) => cls.id === character.class[0]
            );
            return selectedClass ? (
              <div aria-labelledby="class-info-heading">
                <InfoCardHeader
                  icon={
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  }
                  title={selectedClass.name}
                  iconSize="lg"
                  {...(selectedClass.supplementalContent && { badge: { text: "Supplemental" } })}
                  className="mb-6"
                />

                <div className="mb-6">
                  <Typography variant="description">
                    {selectedClass.description}
                  </Typography>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DetailSection
                    icon={<Icon name="check-circle" size="md" aria-hidden={true} />}
                    title="Hit Die"
                  >
                    <Typography variant="description">
                      {selectedClass.hitDie}
                    </Typography>
                  </DetailSection>
                  <DetailSection
                    icon={
                      <svg
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                    title="Primary Attribute"
                  >
                    <Typography variant="description" className="capitalize">
                      {selectedClass.primaryAttribute}
                    </Typography>
                  </DetailSection>
                </div>
              </div>
            ) : null;
          })()}
        </Card>
      )}
    </section>
  );
}

export const StandardClassSelector = memo(StandardClassSelectorComponent);
