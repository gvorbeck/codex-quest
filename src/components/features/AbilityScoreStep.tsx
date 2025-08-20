import { Button, SimpleRoller, StepWrapper } from "../ui";
import { roller } from "../../utils/dice";
import type { Character, AbilityScore } from "../../types/character";
import { memo } from "react";

interface AbilityScoreStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

function AbilityScoreStep({
  character,
  onCharacterChange,
}: AbilityScoreStepProps) {
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

  // Update a specific ability score
  const updateAbilityScore = (
    ability: keyof Character["abilities"],
    value: number
  ) => {
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

  // Roll all ability scores
  const rollAllAbilities = () => {
    const abilities: (keyof Character["abilities"])[] = [
      "strength",
      "dexterity",
      "constitution",
      "intelligence",
      "wisdom",
      "charisma",
    ];
    const newCharacter = { ...character };

    abilities.forEach((ability) => {
      // Roll 3d6 for each ability using the dice roller
      const result = roller("3d6");
      const total = result.total;

      newCharacter.abilities[ability] = {
        value: total,
        modifier: calculateModifier(total),
      };
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

  // Get the status message for screen readers
  const getStatusMessage = () => {
    if (!hasRolledScores) return undefined;

    const abilityScores = Object.entries(character.abilities)
      .map(([name, ability]) => `${name}: ${ability.value}`)
      .join(", ");

    return `Ability scores rolled: ${abilityScores}`;
  };

  return (
    <StepWrapper
      title="Roll Ability Scores"
      description="Roll 3d6 for each ability score. Each score ranges from 3 to 18."
      statusMessage={getStatusMessage()}
    >
      <fieldset>
        <legend className="sr-only">Ability score generation controls</legend>

        <div style={{ marginBottom: "16px" }}>
          <Button onClick={rollAllAbilities}>Roll All Abilities</Button>
          {hasRolledScores && (
            <Button onClick={flipAbilityScores} style={{ marginLeft: "8px" }}>
              Flip All Scores
            </Button>
          )}
        </div>
      </fieldset>

      <section aria-labelledby="ability-scores-heading">
        <h5 id="ability-scores-heading" className="sr-only">
          Individual Ability Scores
        </h5>

        <div style={{ display: "grid", gap: "12px" }}>
          {(
            Object.entries(character.abilities) as [
              keyof Character["abilities"],
              AbilityScore
            ][]
          ).map(([abilityName, ability]) => (
            <div
              key={abilityName}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <label style={{ minWidth: "100px", textTransform: "capitalize" }}>
                {abilityName}:
              </label>
              <SimpleRoller
                formula="3d6"
                label={`Roll ${abilityName}`}
                initialValue={ability.value > 0 ? ability.value : undefined}
                minValue={3}
                maxValue={18}
                onChange={(value) => {
                  if (value !== undefined) {
                    updateAbilityScore(abilityName, value);
                  }
                }}
              />
              <span style={{ minWidth: "60px" }}>
                {ability.value > 0 && (
                  <>
                    Modifier: {ability.modifier >= 0 ? "+" : ""}
                    {ability.modifier}
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {hasRolledScores && (
        <section
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
          aria-labelledby="flip-scores-heading"
        >
          <h5 id="flip-scores-heading">Flip Scores Information</h5>
          <p style={{ fontSize: "14px", margin: 0 }}>
            You can flip all ability scores by subtracting them from 21. This
            turns low scores into high scores and vice versa. For example, a 15
            becomes a 6, and a 3 becomes an 18. All scores must be flipped
            together.
          </p>
        </section>
      )}
    </StepWrapper>
  );
}

export default memo(AbilityScoreStep);
