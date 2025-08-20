import React, { useMemo } from "react";
import { SimpleRoller, Button, StepWrapper } from "@/components/ui";
import { allClasses } from "@/data/classes";
import type { Character } from "@/types/character";

interface HitPointsStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

const HitPointsStep: React.FC<HitPointsStepProps> = ({
  character,
  onCharacterChange,
}) => {
  // Find the hit die for the character's class(es)
  const hitDie = useMemo(() => {
    if (character.class.length === 0) return null;

    // For combination classes, use the first class's hit die
    const primaryClassId = character.class[0];
    const primaryClass = allClasses.find((cls) => cls.id === primaryClassId);

    return primaryClass?.hitDie || null;
  }, [character.class]);

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
        <div className="bg-amber-950/20 border-2 border-amber-600 rounded-lg p-6 shadow-[0_3px_0_0_#b45309]">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="w-5 h-5 flex-shrink-0 text-amber-400"
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
          <p className="text-amber-50 m-0">
            Please select a class first to determine your hit points. Your class
            determines which hit die you use for rolling hit points.
          </p>
        </div>
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
        <div className="bg-amber-950/20 border-2 border-amber-600 rounded-lg p-6 shadow-[0_3px_0_0_#b45309]">
          <div className="flex items-center gap-3 mb-4">
            <svg
              className="w-5 h-5 flex-shrink-0 text-amber-400"
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
          <p className="text-amber-50 leading-relaxed m-0">
            Roll your starting hit points using your class's hit die:{" "}
            <strong className="text-amber-100">{hitDie}</strong>
            {constitutionText && (
              <span className="text-amber-200">{constitutionText}</span>
            )}
          </p>
        </div>
      </section>

      {/* Hit Points Rolling */}
      <section className="mb-8">
        <h4 className="text-lg font-semibold text-zinc-100 mb-6">
          Roll Hit Points
        </h4>

        <div className="bg-zinc-800 border-2 border-zinc-600 rounded-lg p-6 shadow-[0_3px_0_0_#3f3f46]">
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
        </div>
      </section>

      {/* Hit Points Summary */}
      {character.hp.max > 0 && (
        <section className="mb-8">
          <h4 className="text-lg font-semibold text-zinc-100 mb-6">
            Hit Points Summary
          </h4>

          <div className="bg-lime-950/20 border-2 border-lime-600 rounded-lg p-6 shadow-[0_3px_0_0_#65a30d]">
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
                    className="w-4 h-4"
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
                      className="w-4 h-4"
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
          </div>
        </section>
      )}
    </StepWrapper>
  );
};

export default HitPointsStep;
