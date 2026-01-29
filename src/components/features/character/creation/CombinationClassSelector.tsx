import { Select } from "@/components/ui/core/primitives";
import { Card, Typography, Badge } from "@/components/ui/core/display";
import { Icon } from "@/components/ui";
import type { Character } from "@/types";
import { LAYOUT_STYLES, COMBINATION_CLASSES } from "@/constants";
import { memo } from "react";
import { getClassById } from "@/utils";

interface CombinationClassSelectorProps {
  character: Character;
  onCombinationChange: (combinationClassId: string) => void;
  raceAllowedClasses?: string[] | undefined;
}

function CombinationClassSelectorComponent({
  character,
  onCombinationChange,
  raceAllowedClasses,
}: CombinationClassSelectorProps) {
  // Filter combination classes based on race restrictions
  const availableCombinationClasses = raceAllowedClasses
    ? COMBINATION_CLASSES.filter((combo) => raceAllowedClasses.includes(combo.id))
    : COMBINATION_CLASSES;

  const combinationClassOptions = availableCombinationClasses.map((combo) => ({
    value: combo.id,
    label: combo.name,
  }));

  const selectedCombination = availableCombinationClasses.find(
    (combo) => combo.id === character.class
  );

  const selectedClassData = character.class ? getClassById(character.class) : null;

  return (
    <section aria-labelledby="combination-classes-heading" className="mb-8">
      <Typography variant="sectionHeading" id="combination-classes-heading">
        Combination Classes
      </Typography>

      <Card variant="standard" className="mb-6">
        <Select
          label="Select Combination Class"
          value={character.class || ""}
          onValueChange={onCombinationChange}
          options={combinationClassOptions}
          placeholder="Choose a combination class"
          required
          aria-describedby={
            selectedCombination ? "combination-class-details" : undefined
          }
        />
      </Card>

      {selectedCombination && selectedClassData && (
        <Card variant="info" id="combination-class-details">
          <div aria-labelledby="combination-class-info-heading">
            <Typography
              variant="infoHeading"
              className={`${LAYOUT_STYLES.iconText} mb-6`}
              id="combination-class-info-heading"
            >
              <Icon
                name="star"
                size="md"
                className="flex-shrink-0 text-amber-400"
                aria-hidden={true}
              />
              {selectedCombination.name}
              <Badge variant="combination">Combination</Badge>
            </Typography>

            <div className="mb-6">
              <Typography variant="description">
                {selectedCombination.description}
              </Typography>
            </div>

            <div className="mb-6">
              <Typography variant="description">
                {selectedClassData.description}
              </Typography>
            </div>

            <Card variant="nested" className="mb-4">
              <Typography variant="subHeading">
                <Icon name="briefcase" size="sm" />
                Base Classes Combined
              </Typography>
              <div className={LAYOUT_STYLES.tagContainer}>
                {selectedCombination.baseClasses.map((className, index) => (
                  <Badge key={index} variant="status" className="capitalize">
                    {className}
                  </Badge>
                ))}
              </div>
            </Card>

            {selectedClassData.specialAbilities && selectedClassData.specialAbilities.length > 0 && (
              <Card variant="nested">
                <Typography variant="subHeading">
                  <Icon name="star" size="sm" />
                  Special Abilities
                </Typography>
                <ul className="space-y-2">
                  {selectedClassData.specialAbilities.map((ability, index) => (
                    <li key={index}>
                      <Typography variant="body" className="font-semibold">
                        {ability.name}
                      </Typography>
                      <Typography variant="description" color="secondary">
                        {ability.description}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </Card>
      )}
    </section>
  );
}

export const CombinationClassSelector = memo(CombinationClassSelectorComponent);
