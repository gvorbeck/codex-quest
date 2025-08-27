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
                  icon={<Icon name="briefcase" />}
                  title={selectedClass.name}
                  iconSize="lg"
                  {...(selectedClass.supplementalContent && {
                    badge: { text: "Supplemental" },
                  })}
                  className="mb-6"
                />

                <div className="mb-6">
                  <Typography variant="description">
                    {selectedClass.description}
                  </Typography>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DetailSection
                    icon={
                      <Icon name="check-circle" size="md" aria-hidden={true} />
                    }
                    title="Hit Die"
                  >
                    <Typography variant="description">
                      {selectedClass.hitDie}
                    </Typography>
                  </DetailSection>
                  <DetailSection
                    icon={<Icon name="lightning" />}
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
