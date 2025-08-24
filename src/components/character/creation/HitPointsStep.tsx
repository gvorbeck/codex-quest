import React, { useMemo, memo } from "react";
import { SimpleRoller } from "@/components/ui/display";
import { Button, Card, Typography } from "@/components/ui";
import { StepWrapper } from "@/components/ui/layout";
import { allClasses } from "@/data/classes";
import { allRaces } from "@/data/races";
import {
  ICON_STYLES,
  LAYOUT_STYLES,
} from "@/constants";
import type { Character } from "@/types/character";

interface HitPointsStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

const HitPointsStep: React.FC<HitPointsStepProps> = ({
  character,
  onCharacterChange,
}) => {
  // Find the hit die for the character's class(es) with racial restrictions
  const hitDie = useMemo(() => {
    if (character.class.length === 0) return null;

    // For combination classes, use the first class's hit die
    const primaryClassId = character.class[0];
    const primaryClass = allClasses.find((cls) => cls.id === primaryClassId);
    
    if (!primaryClass?.hitDie) return null;

    // Check for racial hit dice modifications
    const raceData = allRaces.find(race => race.id === character.race);
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
                case 12: newSize = 10; break;
                case 10: newSize = 8; break;
                case 8: newSize = 6; break;
                case 6: newSize = 4; break;
                case 4: newSize = 3; break;
                default: newSize = currentSize;
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
              case 4: newSize = 6; break;
              case 6: newSize = 8; break;
              case 8: newSize = 10; break;
              case 10: newSize = 12; break;
              default: newSize = currentSize;
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
      console.error("Failed to parse hit die:", error);
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
    const primaryClass = allClasses.find((cls) => cls.id === primaryClassId);
    const raceData = allRaces.find(race => race.id === character.race);
    
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
              modificationType: "restriction"
            };
          }
        }
      } else if (hitDiceRestriction?.sizeDecrease) {
        return {
          abilityName: ability.name,
          originalHitDie: primaryClass.hitDie,
          modifiedHitDie: hitDie, // Use the calculated hit die
          modificationType: "decrease"
        };
      } else if (hitDiceBonus?.sizeIncrease) {
        return {
          abilityName: ability.name,
          originalHitDie: primaryClass.hitDie,
          modifiedHitDie: hitDie, // Use the calculated hit die
          modificationType: "increase"
        };
      }
    }
    return null;
  }, [character.class, character.race]);

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
        <Card variant="info">
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
            <h4 className="font-semibold text-amber-100 m-0">Class Required</h4>
          </div>
          <Typography variant="description">
            Please select a class first to determine your hit points. Your class
            determines which hit die you use for rolling hit points.
          </Typography>
        </Card>
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
          <div className={`${LAYOUT_STYLES.iconTextLarge} mb-4`}>
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
              Hit Die Information
            </h4>
          </div>
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
                <svg
                  className="w-5 h-5 flex-shrink-0 text-orange-400 mt-0.5"
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
                <div>
                  <p className="text-sm text-orange-200 font-medium mb-1">
                    Racial Restriction Applied
                  </p>
                  <p className="text-sm text-orange-100">
                    <strong>{racialModificationInfo.abilityName}</strong>{" "}
                    {racialModificationInfo.modificationType === "restriction" && "restricts"}
                    {racialModificationInfo.modificationType === "increase" && "increases"}
                    {racialModificationInfo.modificationType === "decrease" && "decreases"}
                    {" "}your hit die from{" "}
                    <strong>{racialModificationInfo.originalHitDie}</strong> to{" "}
                    <strong>{racialModificationInfo.modifiedHitDie}</strong>
                  </p>
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
              <svg
                className="w-6 h-6 flex-shrink-0 text-lime-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h5 className="text-xl font-semibold text-lime-100 m-0">
                Current Hit Points
              </h5>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 border border-lime-700/30 rounded-lg p-4">
                <h6 className="font-semibold mb-2 text-lime-400 flex items-center gap-2">
                  <svg
                    className={ICON_STYLES.sm}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Hit Points
                </h6>
                <p className="text-lime-50 text-lg font-bold m-0">
                  {character.hp.current} / {character.hp.max} HP
                </p>
              </div>

              {constitutionBonus !== 0 && (
                <div className="bg-zinc-800/50 border border-lime-700/30 rounded-lg p-4">
                  <h6 className="font-semibold mb-2 text-lime-400 flex items-center gap-2">
                    <svg
                      className={ICON_STYLES.sm}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Breakdown
                  </h6>
                  <p className="text-lime-50 text-sm m-0">
                    Base roll:{" "}
                    <strong>{character.hp.max - constitutionBonus}</strong>
                    <br />
                    Constitution:{" "}
                    <strong>
                      {constitutionBonus >= 0 ? "+" : ""}
                      {constitutionBonus}
                    </strong>
                  </p>
                </div>
              )}
            </div>
          </Card>
        </section>
      )}
    </StepWrapper>
  );
};

export default memo(HitPointsStep);
