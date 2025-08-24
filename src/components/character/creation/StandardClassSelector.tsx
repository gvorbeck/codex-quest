import { Select } from "@/components/ui/inputs";
import { Card, Typography, Badge } from "@/components/ui/design-system";
import type { Character, Class } from "@/types/character";
import {
  ICON_STYLES,
  LAYOUT_STYLES,
} from "@/constants";
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
                <div className={`${LAYOUT_STYLES.iconTextLarge} mb-6`}>
                  <svg
                    className={`${ICON_STYLES.lg} flex-shrink-0 text-amber-400`}
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
                  <Typography
                    variant="infoHeading"
                    id="class-info-heading"
                  >
                    {selectedClass.name}
                  </Typography>
                  {selectedClass.supplementalContent && (
                    <Badge variant="supplemental">
                      Supplemental
                    </Badge>
                  )}
                </div>

                <div className="mb-6">
                  <Typography variant="description">
                    {selectedClass.description}
                  </Typography>
                </div>

                <div className={LAYOUT_STYLES.infoGrid}>
                  <Card variant="nested">
                    <Typography variant="subHeading">
                      <svg
                        className={ICON_STYLES.sm}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Hit Die
                    </Typography>
                    <Typography variant="description">
                      {selectedClass.hitDie}
                    </Typography>
                  </Card>
                  <Card variant="nested">
                    <Typography variant="subHeading">
                      <svg
                        className={ICON_STYLES.sm}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Primary Attribute
                    </Typography>
                    <Typography variant="description" className="capitalize">
                      {selectedClass.primaryAttribute}
                    </Typography>
                  </Card>
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
