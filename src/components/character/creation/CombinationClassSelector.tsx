import { Select } from "@/components/ui/inputs";
import { Card, Typography, Badge } from "@/components/ui/design-system";
import type { Character } from "@/types/character";
import {
  ICON_STYLES,
  LAYOUT_STYLES,
} from "@/constants";
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
      <Typography
        variant="sectionHeading"
        id="combination-classes-heading"
      >
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
            <div className={`${LAYOUT_STYLES.iconTextLarge} mb-6`}>
              <svg
                className={`${ICON_STYLES.lg} flex-shrink-0 text-amber-400`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <Typography
                variant="infoHeading"
                id="combination-class-info-heading"
              >
                {currentCombination.name}
              </Typography>
              <Badge variant="combination">Combination</Badge>
            </div>

            <div className="mb-6">
              <Typography variant="description">
                This combination class combines the abilities of{" "}
                {character.class.join(" and ")}, allowing you to gain benefits
                from both classes as you advance.
              </Typography>
            </div>

            <Card variant="nested">
              <Typography variant="subHeading">
                <svg
                  className={ICON_STYLES.sm}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
                Combined Classes
              </Typography>
              <div className={LAYOUT_STYLES.tagContainer}>
                {character.class.map((classId, index) => (
                  <Badge
                    key={index}
                    variant="status"
                    className="capitalize"
                  >
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
