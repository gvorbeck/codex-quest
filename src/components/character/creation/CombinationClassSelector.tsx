import { Select } from "@/components/ui/inputs";
import { Card, Typography, Badge } from "@/components/ui/design-system";
import { Icon } from "@/components/ui";
import type { Character } from "@/types";
import { LAYOUT_STYLES } from "@/constants";
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
    <section aria-labelledby="combination-classes-heading" className="mb-8">
      <Typography variant="sectionHeading" id="combination-classes-heading">
        Combination Classes
      </Typography>

      <Card variant="standard" className="mb-6">
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
      </Card>

      {character.class.length > 1 && currentCombination && (
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
              {currentCombination.name}
              <Badge variant="combination">Combination</Badge>
            </Typography>

            <div className="mb-6">
              <Typography variant="description">
                This combination class combines the abilities of{" "}
                {character.class.join(" and ")}, allowing you to gain benefits
                from both classes as you advance.
              </Typography>
            </div>

            <Card variant="nested">
              <Typography variant="subHeading">
                <Icon name="briefcase" size="sm" />
                Combined Classes
              </Typography>
              <div className={LAYOUT_STYLES.tagContainer}>
                {character.class.map((classId, index) => (
                  <Badge key={index} variant="status" className="capitalize">
                    {classId}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </Card>
      )}
    </section>
  );
}

export const CombinationClassSelector = memo(CombinationClassSelectorComponent);
