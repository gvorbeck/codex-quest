import { Button, Card, Typography, Icon } from "@/components/ui";
import { SimpleRoller } from "@/components/domain/dice";
import { StepWrapper } from "@/components/ui/core/layout";
import { InfoCardHeader, StatGrid } from "@/components/ui/composite";
import {
  roller,
  calculateModifier,
  logger,
  abilityScoreSchema,
  Rules,
  ABILITY_NAMES,
} from "@/utils";
import type { Character, AbilityScore, BaseStepProps } from "@/types";
import { memo, useState } from "react";
import { useValidation } from "@/validation";
import type { AbilityName } from "@/validation";

// Helper function to describe what ability-score modifiers mean in gameplay terms
const getModifierDescription = (modifier: number): string => {
  if (modifier >= 3) return "Exceptional bonus to rolls and abilities";
  if (modifier === 2) return "Very good bonus to rolls and abilities";
  if (modifier === 1) return "Good bonus to rolls and abilities";
  if (modifier === 0) return "Average - no bonus or penalty";
  if (modifier === -1) return "Slight penalty to rolls and abilities";
  if (modifier === -2) return "Moderate penalty to rolls and abilities";
  if (modifier <= -3) return "Severe penalty to rolls and abilities";
  return "No effect";
};

type AbilityScoreStepProps = BaseStepProps;

function AbilityScoreStep({
  character,
  onCharacterChange,
}: AbilityScoreStepProps) {
  // Track which ability is selected for swapping
  const [selectedAbility, setSelectedAbility] = useState<AbilityName | null>(
    null
  );

  // Enhanced validation for individual ability scores
  const validationResults = {
    strength: useValidation(
      character.abilities.strength.value,
      abilityScoreSchema
    ),
    dexterity: useValidation(
      character.abilities.dexterity.value,
      abilityScoreSchema
    ),
    constitution: useValidation(
      character.abilities.constitution.value,
      abilityScoreSchema
    ),
    intelligence: useValidation(
      character.abilities.intelligence.value,
      abilityScoreSchema
    ),
    wisdom: useValidation(character.abilities.wisdom.value, abilityScoreSchema),
    charisma: useValidation(
      character.abilities.charisma.value,
      abilityScoreSchema
    ),
  };

  // Type-safe update function for ability scores
  const updateAbilityScore = (ability: AbilityName, value: number) => {
    // Validate the score before applying
    if (!Rules.isValidAbilityScore.validate(value)) {
      logger.warn(`Invalid ability score ${value} for ${ability}`);
      return;
    }

    const updatedCharacter: Character = {
      ...character,
      abilities: {
        ...character.abilities,
        [ability]: {
          value,
          modifier: calculateModifier(value),
        },
      },
    };
    onCharacterChange(updatedCharacter);
  };

  // Roll all ability scores with enhanced type safety
  const rollAllAbilities = () => {
    const newCharacter = { ...character };

    ABILITY_NAMES.forEach((ability) => {
      // Roll 3d6 for each ability using the dice roller
      const result = roller("3d6");
      const total = result.total;

      // Ensure the rolled value is valid
      if (Rules.isValidAbilityScore.validate(total)) {
        newCharacter.abilities[ability] = {
          value: total,
          modifier: calculateModifier(total),
        };
      }
    });

    onCharacterChange(newCharacter);
  };

  // Swap two ability scores
  const swapAbilityScores = (ability1: AbilityName, ability2: AbilityName) => {
    const value1 = character.abilities[ability1].value;
    const value2 = character.abilities[ability2].value;

    const updatedCharacter: Character = {
      ...character,
      abilities: {
        ...character.abilities,
        [ability1]: {
          value: value2,
          modifier: calculateModifier(value2),
        },
        [ability2]: {
          value: value1,
          modifier: calculateModifier(value1),
        },
      },
    };
    onCharacterChange(updatedCharacter);
  };

  // Check if any ability scores have been rolled
  const hasRolledScores = (
    Object.values(character.abilities) as AbilityScore[]
  ).some((ability) => ability.value > 0);

  // Handle clicking an ability card for swapping
  const handleAbilityClick = (abilityName: AbilityName) => {
    // Only allow swapping if scores have been rolled
    if (!hasRolledScores) return;

    if (selectedAbility === null) {
      // Nothing selected, select this ability
      setSelectedAbility(abilityName);
    } else if (selectedAbility === abilityName) {
      // Same ability clicked, deselect
      setSelectedAbility(null);
    } else {
      // Different ability clicked, swap and clear selection
      swapAbilityScores(selectedAbility, abilityName);
      setSelectedAbility(null);
    }
  };

  // Flip all ability scores (subtract from 21)
  const flipAbilityScores = () => {
    const newCharacter = { ...character };

    (
      Object.keys(newCharacter.abilities) as (keyof Character["abilities"])[]
    ).forEach((ability) => {
      const currentValue = newCharacter.abilities[ability].value;
      if (currentValue > 0) {
        const flippedValue = 21 - currentValue;
        newCharacter.abilities[ability] = {
          value: flippedValue,
          modifier: calculateModifier(flippedValue),
        };
      }
    });

    onCharacterChange(newCharacter);
  };

  // Get the status message for screen readers with validation feedback
  const getStatusMessage = () => {
    if (!hasRolledScores) return "";

    // Check for validation errors
    const hasErrors = Object.values(validationResults).some(
      (result) => !result.isValid
    );
    if (hasErrors) {
      const errorCount = Object.values(validationResults).filter(
        (result) => !result.isValid
      ).length;
      return `${errorCount} ability scores need to be corrected`;
    }

    return "";
  };

  return (
    <StepWrapper
      title="Roll Ability Scores"
      description="Roll 3d6 for each ability score. Each score ranges from 3 to 18."
      statusMessage={getStatusMessage()}
    >
      {/* Action Buttons */}
      <fieldset className="mb-8">
        <legend className="sr-only">Ability score generation controls</legend>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={rollAllAbilities} variant="primary" size="lg">
            Roll All Abilities
          </Button>
          {hasRolledScores && (
            <Button onClick={flipAbilityScores} variant="secondary" size="lg">
              Flip All Scores
            </Button>
          )}
        </div>
      </fieldset>

      {/* Ability Scores Summary */}
      {hasRolledScores && (
        <section className="mb-8">
          <Card variant="info" size="compact">
            <InfoCardHeader
              icon={<Icon name="info" size="md" aria-hidden={true} />}
              title="Ability Scores Summary"
              className="mb-3"
            />
            <StatGrid
              stats={Object.entries(character.abilities).map(
                ([name, ability]) => ({
                  label: name,
                  value: ability.value,
                  modifier: ability.modifier,
                })
              )}
              variant="summary"
              columns={{ base: 2, sm: 3, md: 6 }}
            />
          </Card>
        </section>
      )}

      {/* Ability Scores Grid */}
      <section aria-labelledby="ability-scores-heading" className="mb-8">
        <Typography variant="sectionHeading" id="ability-scores-heading">
          Ability Scores
        </Typography>

        {/* Swap hint message */}
        {hasRolledScores && (
          <Typography variant="body" color="zinc" className="mb-4">
            {selectedAbility
              ? `Click another ability to swap with ${selectedAbility}, or click ${selectedAbility} again to cancel.`
              : "Click any ability name to select it, then click another to swap their scores."}
          </Typography>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(
            Object.entries(character.abilities) as [
              keyof Character["abilities"],
              AbilityScore
            ][]
          ).map(([abilityName, ability]) => {
            const isSelected = selectedAbility === abilityName;
            return (
              <Card
                key={abilityName}
                variant="standard"
                hover={true}
                className={
                  isSelected
                    ? "ring-2 ring-amber-500 border-amber-500"
                    : undefined
                }
              >
                {/* Ability Name - clickable for swapping */}
                <button
                  type="button"
                  onClick={() => handleAbilityClick(abilityName as AbilityName)}
                  disabled={!hasRolledScores}
                  aria-pressed={isSelected}
                  aria-label={
                    hasRolledScores
                      ? isSelected
                        ? `${abilityName} selected for swap. Click another ability to swap, or click again to deselect.`
                        : `Select ${abilityName} to swap with another ability`
                      : abilityName
                  }
                  className={`flex items-center justify-between mb-3 w-full text-left rounded p-1 -m-1 transition-colors ${
                    hasRolledScores
                      ? "cursor-pointer hover:bg-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
                      : "cursor-default"
                  }`}
                >
                  <span className="text-base font-semibold text-zinc-100 capitalize">
                    {abilityName}
                  </span>
                  {ability.value > 0 && (
                    <div
                      className="text-sm text-zinc-300 bg-zinc-700 px-2 py-1 rounded border border-zinc-600"
                      aria-label={`${abilityName} modifier: ${
                        ability.modifier >= 0 ? "plus " : "minus "
                      }${Math.abs(ability.modifier)}. ${getModifierDescription(
                        ability.modifier
                      )}`}
                    >
                      <span className="font-medium">
                        Modifier: {ability.modifier >= 0 ? "+" : ""}
                        {ability.modifier}
                      </span>
                    </div>
                  )}
                </button>

              {/* Dice Roller */}
              <SimpleRoller
                formula="3d6"
                label={`Roll ${abilityName}`}
                {...(ability.value > 0 && { initialValue: ability.value })}
                minValue={3}
                maxValue={18}
                onChange={(value) => {
                  if (value !== undefined) {
                    updateAbilityScore(abilityName as AbilityName, value);
                  }
                }}
              />

              {/* Validation Error Display */}
              {!validationResults[abilityName as keyof typeof validationResults]
                .isValid && (
                <div className="mt-2 text-sm text-red-400" role="alert">
                  {
                    validationResults[
                      abilityName as keyof typeof validationResults
                    ].errors[0]
                  }
                </div>
              )}
            </Card>
            );
          })}
        </div>
      </section>

      {/* Flip Scores Information */}
      {hasRolledScores && (
        <Card variant="info">
          <InfoCardHeader
            icon={<Icon name="info" size="md" aria-hidden={true} />}
            title="Flip Scores Information"
            className="mb-3"
          />
          <Typography variant="descriptionCompact" color="amber">
            You can flip all ability scores by subtracting them from 21. This
            turns low scores into high scores and vice versa. For example, a 15
            becomes a 6, and a 3 becomes an 18. All scores must be flipped
            together.
          </Typography>
        </Card>
      )}
    </StepWrapper>
  );
}

export default memo(AbilityScoreStep);
