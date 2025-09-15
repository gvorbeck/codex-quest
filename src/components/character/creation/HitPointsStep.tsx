import React, { useMemo, memo } from "react";
import { SimpleRoller } from "@/components/ui/display";
import { Button, Card, Typography, Icon } from "@/components/ui";
import { StepWrapper } from "@/components/ui/layout";
import { InfoCardHeader, RequirementCard } from "@/components/ui/display";
import { logger } from "@/utils/logger";
import { calculateHitDie, getRacialModificationInfo } from "@/utils/hitDice";
import type { BaseStepProps } from "@/types/character";

type HitPointsStepProps = BaseStepProps;

const HitPointsStep: React.FC<HitPointsStepProps> = ({
  character,
  onCharacterChange,
}) => {
  // Find the hit die for the character's class(es) with racial restrictions
  const hitDie = useMemo(() => calculateHitDie(character), [character]);

  // Calculate maximum possible HP for the hit die
  const maxPossibleHP = useMemo(() => {
    if (!hitDie) return 0;

    try {
      // Extract the die size from the formula (e.g., "1d8" -> 8)
      const match = hitDie.match(/\d*d(\d+)/);
      if (match && match[1]) {
        const dieSize = parseInt(match[1], 10);
        return dieSize + (character.abilities.constitution.modifier || 0);
      }
    } catch (error) {
      logger.error("Failed to parse hit die:", error);
    }

    return 0;
  }, [hitDie, character.abilities.constitution.modifier]);

  // Calculate minimum possible HP (always at least 1)
  const minPossibleHP = useMemo(() => {
    const constitutionBonus = character.abilities.constitution.modifier || 0;
    return Math.max(1, 1 + constitutionBonus);
  }, [character.abilities.constitution.modifier]);

  // Check if racial modification is being applied
  const racialModificationInfo = useMemo(() => getRacialModificationInfo(character), [character]);

  const handleHPChange = (hp: number | undefined) => {
    if (hp === undefined) return;

    // Ensure minimum HP is always 1
    const finalHP = Math.max(1, hp);

    onCharacterChange({
      ...character,
      hp: {
        ...character.hp,
        current: finalHP,
        max: finalHP,
      },
    });
  };

  const handleMaxHP = () => {
    const maxHP = Math.max(1, maxPossibleHP);
    onCharacterChange({
      ...character,
      hp: {
        ...character.hp,
        current: maxHP,
        max: maxHP,
      },
    });
  };

  if (!hitDie) {
    return (
      <StepWrapper
        title="Roll Hit Points"
        description="Determine your character's starting hit points based on their class."
        statusMessage=""
      >
        <RequirementCard
          title="Class Required"
          message="Please select a class first to determine your hit points. Your class determines which hit die you use for rolling hit points."
          icon={<Icon name="info" size="md" aria-hidden={true} />}
        />
      </StepWrapper>
    );
  }

  const constitutionBonus = character.abilities.constitution.modifier || 0;
  const constitutionText =
    constitutionBonus > 0
      ? ` + ${constitutionBonus} (Constitution bonus)`
      : constitutionBonus < 0
      ? ` ${constitutionBonus} (Constitution penalty)`
      : "";

  return (
    <StepWrapper
      title="Roll Hit Points"
      description="Determine your character's starting hit points based on their class."
    >
      {/* Hit Points Information */}
      <section className="mb-8">
        <Card variant="info">
          <InfoCardHeader
            icon={<Icon name="info" size="md" aria-hidden={true} />}
            title="Hit Die Information"
            className="mb-4"
          />
          <Typography variant="description">
            Roll your starting hit points using your{" "}
            {racialModificationInfo ? "modified" : "class's"} hit die:{" "}
            <strong className="text-amber-100">{hitDie}</strong>
            {constitutionText && (
              <span className="text-amber-200">{constitutionText}</span>
            )}
          </Typography>

          {racialModificationInfo && (
            <div className="mt-3 p-3 bg-orange-900/20 border border-orange-700/40 rounded-lg">
              <div className="flex items-start gap-2">
                <Icon
                  name="info"
                  size="md"
                  className="flex-shrink-0 text-orange-400 mt-0.5"
                  aria-hidden={true}
                />
                <div>
                  <Typography
                    variant="helper"
                    weight="medium"
                    color="amber"
                    className="mb-1"
                  >
                    Racial Restriction Applied
                  </Typography>
                  <Typography variant="helper" color="primary">
                    <strong>{racialModificationInfo.abilityName}</strong>{" "}
                    {racialModificationInfo.modificationType ===
                      "restriction" && "restricts"}
                    {racialModificationInfo.modificationType === "increase" &&
                      "increases"}
                    {racialModificationInfo.modificationType === "decrease" &&
                      "decreases"}{" "}
                    your hit die from{" "}
                    <strong>{racialModificationInfo.originalHitDie}</strong> to{" "}
                    <strong>{racialModificationInfo.modifiedHitDie}</strong>
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Hit Points Rolling */}
      <section className="mb-8">
        <Typography variant="sectionHeading">Roll Hit Points</Typography>

        <Card variant="standard">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-end">
            <div className="flex-grow">
              <SimpleRoller
                formula={`${hitDie}${
                  constitutionBonus >= 0 ? "+" : ""
                }${constitutionBonus}`}
                label="Hit Points"
                {...(character.hp.max > 0 && {
                  initialValue: character.hp.max,
                })}
                minValue={minPossibleHP}
                maxValue={maxPossibleHP}
                onChange={handleHPChange}
              />
            </div>

            <Button onClick={handleMaxHP} variant="secondary" size="md">
              Use Max HP ({maxPossibleHP})
            </Button>
          </div>
        </Card>
      </section>

      {/* Hit Points Summary */}
      {character.hp.max > 0 && (
        <section className="mb-8">
          <Typography variant="sectionHeading">Hit Points Summary</Typography>

          <Card variant="success">
            <div className="flex items-center gap-3 mb-4">
              <Icon
                name="check-circle"
                size="lg"
                className="flex-shrink-0 text-lime-400"
                aria-hidden={true}
              />
              <Typography variant="infoHeading" color="zinc">
                Current Hit Points
              </Typography>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card variant="success">
                <Typography variant="subHeading" color="lime">
                  <Icon name="heart" size="sm" />
                  Hit Points
                </Typography>
                <Typography
                  variant="body"
                  weight="bold"
                  color="lime"
                  className="text-lg m-0"
                >
                  {character.hp.current} / {character.hp.max} HP
                </Typography>
              </Card>

              {constitutionBonus !== 0 && (
                <Card variant="success">
                  <Typography variant="subHeading" color="lime">
                    <Icon name="clock" size="sm" />
                    Breakdown
                  </Typography>
                  <Typography variant="helper" color="lime">
                    Base roll:{" "}
                    <strong>{character.hp.max - constitutionBonus}</strong>
                    <br />
                    Constitution:{" "}
                    <strong>
                      {constitutionBonus >= 0 ? "+" : ""}
                      {constitutionBonus}
                    </strong>
                  </Typography>
                </Card>
              )}
            </div>
          </Card>
        </section>
      )}
    </StepWrapper>
  );
};

export default memo(HitPointsStep);
