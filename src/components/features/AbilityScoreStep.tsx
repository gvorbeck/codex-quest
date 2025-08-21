import { Button, SimpleRoller, StepWrapper } from "../ui";
import { roller } from "@/utils/dice";
import {
  CARD_STYLES,
  LAYOUT_STYLES,
  ICON_STYLES,
  TEXT_STYLES,
} from "@/constants";
import type { Character, AbilityScore } from "@/types/character";
import { memo } from "react";
import { useValidation } from "@/hooks";
import { abilityScoreSchema } from "@/utils/validationSchemas";
import { isValidAbilityScore, ABILITY_NAMES } from "@/utils/typeGuards";
import type { AbilityName } from "@/utils/typeGuards";

interface AbilityScoreStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

function AbilityScoreStep({
  character,
  onCharacterChange,
}: AbilityScoreStepProps) {
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

  // Calculate modifier based on ability score
  const calculateModifier = (score: number): number => {
    if (score <= 3) return -3;
    if (score <= 5) return -2;
    if (score <= 8) return -1;
    if (score <= 12) return 0;
    if (score <= 15) return 1;
    if (score <= 17) return 2;
    return 3;
  };

  // Type-safe update function for ability scores
  const updateAbilityScore = (ability: AbilityName, value: number) => {
    // Validate the score before applying
    if (!isValidAbilityScore(value)) {
      console.warn(`Invalid ability score ${value} for ${ability}`);
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
      if (isValidAbilityScore(total)) {
        newCharacter.abilities[ability] = {
          value: total,
          modifier: calculateModifier(total),
        };
      }
    });

    onCharacterChange(newCharacter);
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

  // Check if any ability scores have been rolled
  const hasRolledScores = (
    Object.values(character.abilities) as AbilityScore[]
  ).some((ability) => ability.value > 0);

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
          <div className={CARD_STYLES.infoCompact}>
            <div className={`${LAYOUT_STYLES.iconTextLarge} mb-3`}>
              <svg
                className={`${ICON_STYLES.md} flex-shrink-0 text-amber-400`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <h4 className="font-semibold text-amber-100 m-0">
                Ability Scores Summary
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(character.abilities).map(([name, ability]) => (
                <div key={name} className="text-center">
                  <div className="text-xs text-amber-200 uppercase tracking-wider font-medium mb-1">
                    {name.slice(0, 3)}
                  </div>
                  <div className="text-lg font-bold text-amber-100">
                    {ability.value > 0 ? ability.value : "—"}
                  </div>
                  {ability.value > 0 && (
                    <div className="text-xs text-amber-300">
                      {ability.modifier >= 0 ? "+" : ""}
                      {ability.modifier}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ability Scores Grid */}
      <section aria-labelledby="ability-scores-heading" className="mb-8">
        <h4 id="ability-scores-heading" className={TEXT_STYLES.sectionHeading}>
          Ability Scores
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(
            Object.entries(character.abilities) as [
              keyof Character["abilities"],
              AbilityScore
            ][]
          ).map(([abilityName, ability]) => (
            <div
              key={abilityName}
              className={`${CARD_STYLES.standard} hover:shadow-[0_4px_0_0_#3f3f46] transition-all duration-150`}
            >
              {/* Ability Name */}
              <div className="flex items-center justify-between mb-3">
                <label className="text-base font-semibold text-zinc-100 capitalize">
                  {abilityName}
                </label>
                {ability.value > 0 && (
                  <div className="text-sm text-zinc-300 bg-zinc-700 px-2 py-1 rounded border border-zinc-600">
                    <span className="font-medium">
                      Modifier: {ability.modifier >= 0 ? "+" : ""}
                      {ability.modifier}
                    </span>
                  </div>
                )}
              </div>

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
            </div>
          ))}
        </div>
      </section>

      {/* Flip Scores Information */}
      {hasRolledScores && (
        <div className={CARD_STYLES.info}>
          <div className={`${LAYOUT_STYLES.iconTextLarge} mb-3`}>
            <svg
              className={`${ICON_STYLES.md} text-amber-400`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <h5 className="text-base font-semibold text-amber-100 m-0">
              Flip Scores Information
            </h5>
          </div>
          <p className="text-amber-100 text-sm m-0 leading-relaxed">
            You can flip all ability scores by subtracting them from 21. This
            turns low scores into high scores and vice versa. For example, a 15
            becomes a 6, and a 3 becomes an 18. All scores must be flipped
            together.
          </p>
        </div>
      )}
    </StepWrapper>
  );
}

export default memo(AbilityScoreStep);
