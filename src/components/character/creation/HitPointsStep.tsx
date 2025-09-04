import React, { useMemo, memo } from "react";
import { SimpleRoller } from "@/components/ui/display";
import { Button, Card, Typography, Icon } from "@/components/ui";
import { StepWrapper } from "@/components/ui/layout";
import { InfoCardHeader, RequirementCard } from "@/components/ui/display";
import { logger } from "@/utils/logger";
import { allClasses } from "@/data/classes";
import { allRaces } from "@/data/races";
import type { BaseStepProps } from "@/types/character";

type HitPointsStepProps = BaseStepProps;

const HitPointsStep: React.FC<HitPointsStepProps> = ({
  character,
  onCharacterChange,
}) => {
  // Find the hit die for the character's class(es) with racial restrictions
  const hitDie = useMemo(() => {
    if (character.class.length === 0) return null;

    // For combination classes, use the first class's hit die
    const primaryClassId = character.class[0];
    
    // Check if it's a custom class
    if (character.customClasses && primaryClassId && character.customClasses[primaryClassId]) {
      return character.customClasses[primaryClassId].hitDie || "1d6";
    }
    
    const primaryClass = allClasses.find((cls) => cls.id === primaryClassId);

    if (!primaryClass?.hitDie) return null;

    // Check for racial hit dice modifications
    const raceData = allRaces.find((race) => race.id === character.race);
    let modifiedHitDie = primaryClass.hitDie;

    if (raceData?.specialAbilities) {
      for (const ability of raceData.specialAbilities) {
        // Check for hit dice restrictions (maxSize)
        const hitDiceRestriction = ability.effects?.hitDiceRestriction;
        if (hitDiceRestriction) {
          if (hitDiceRestriction.maxSize) {
            // Apply the most restrictive dice size
            const classHitDie = modifiedHitDie;
            const restrictedDie = hitDiceRestriction.maxSize;

            // Extract die sizes for comparison (e.g., "1d8" -> 8, "d6" -> 6)
            const classMatch = classHitDie.match(/\d*d(\d+)/);
            const restrictedMatch = restrictedDie.match(/d(\d+)/);

            if (classMatch?.[1] && restrictedMatch?.[1]) {
              const classDieSize = parseInt(classMatch[1], 10);
              const restrictedDieSize = parseInt(restrictedMatch[1], 10);

              // Use the smaller die size
              if (restrictedDieSize < classDieSize) {
                modifiedHitDie = `1${restrictedDie}`;
              }
            }
          } else if (hitDiceRestriction.sizeDecrease) {
            // Handle size decrease (Phaerim: d8->d6, d6->d4, d4->d3)
            const match = modifiedHitDie.match(/\d*d(\d+)/);
            if (match?.[1]) {
              const currentSize = parseInt(match[1], 10);
              let newSize;

              switch (currentSize) {
                case 12:
                  newSize = 10;
                  break;
                case 10:
                  newSize = 8;
                  break;
                case 8:
                  newSize = 6;
                  break;
                case 6:
                  newSize = 4;
                  break;
                case 4:
                  newSize = 3;
                  break;
                default:
                  newSize = currentSize;
              }

              modifiedHitDie = `1d${newSize}`;
            }
          }
        }

        // Check for hit dice bonuses (sizeIncrease for Half-Ogre, Bisren)
        const hitDiceBonus = ability.effects?.hitDiceBonus;
        if (hitDiceBonus?.sizeIncrease) {
          const match = modifiedHitDie.match(/\d*d(\d+)/);
          if (match?.[1]) {
            const currentSize = parseInt(match[1], 10);
            let newSize;

            switch (currentSize) {
              case 4:
                newSize = 6;
                break;
              case 6:
                newSize = 8;
                break;
              case 8:
                newSize = 10;
                break;
              case 10:
                newSize = 12;
                break;
              default:
                newSize = currentSize;
            }

            modifiedHitDie = `1d${newSize}`;
          }
        }
      }
    }

    return modifiedHitDie;
  }, [character.class, character.race]);

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
  const racialModificationInfo = useMemo(() => {
    const primaryClassId = character.class[0];
    
    // Custom classes don't have racial modifications
    if (character.customClasses && primaryClassId && character.customClasses[primaryClassId]) {
      return null;
    }
    
    const primaryClass = allClasses.find((cls) => cls.id === primaryClassId);
    const raceData = allRaces.find((race) => race.id === character.race);

    if (!primaryClass?.hitDie || !raceData?.specialAbilities) return null;

    for (const ability of raceData.specialAbilities) {
      const hitDiceRestriction = ability.effects?.hitDiceRestriction;
      const hitDiceBonus = ability.effects?.hitDiceBonus;

      if (hitDiceRestriction?.maxSize) {
        const classMatch = primaryClass.hitDie.match(/\d*d(\d+)/);
        const restrictedMatch = hitDiceRestriction.maxSize.match(/d(\d+)/);

        if (classMatch?.[1] && restrictedMatch?.[1]) {
          const classDieSize = parseInt(classMatch[1], 10);
          const restrictedDieSize = parseInt(restrictedMatch[1], 10);

          if (restrictedDieSize < classDieSize) {
            return {
              abilityName: ability.name,
              originalHitDie: primaryClass.hitDie,
              modifiedHitDie: `1${hitDiceRestriction.maxSize}`,
              modificationType: "restriction",
            };
          }
        }
      } else if (hitDiceRestriction?.sizeDecrease) {
        return {
          abilityName: ability.name,
          originalHitDie: primaryClass.hitDie,
          modifiedHitDie: hitDie, // Use the calculated hit die
          modificationType: "decrease",
        };
      } else if (hitDiceBonus?.sizeIncrease) {
        return {
          abilityName: ability.name,
          originalHitDie: primaryClass.hitDie,
          modifiedHitDie: hitDie, // Use the calculated hit die
          modificationType: "increase",
        };
      }
    }
    return null;
  }, [character.class, character.race, hitDie]);

  const handleHPChange = (hp: number | undefined) => {
    if (hp === undefined) return;

    // Ensure minimum HP is always 1
    const finalHP = Math.max(1, hp);

    onCharacterChange({
      ...character,
      hp: {
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
          <div className="flex flex-col sm:flex-row gap-4 items-end">
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

            <Button onClick={handleMaxHP} variant="secondary" size="lg">
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
