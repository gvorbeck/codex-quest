import { Switch, Select, StepWrapper } from "@/components/ui";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";
import type { Character } from "@/types/character";
import { memo, useMemo } from "react";

interface RaceStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
  includeSupplemental: boolean;
  onIncludeSupplementalChange: (includeSupplemental: boolean) => void;
}

function RaceStep({
  character,
  onCharacterChange,
  includeSupplemental,
  onIncludeSupplementalChange,
}: RaceStepProps) {
  // Helper function to get class name from ID
  const getClassName = (classId: string): string => {
    const classData = allClasses.find((cls) => cls.id === classId);
    return classData?.name || classId;
  };

  // Filter races based on supplemental content setting and ability requirements
  const availableRaces = useMemo(() => {
    return allRaces.filter((race) => {
      // Filter by supplemental content
      if (race.supplementalContent && !includeSupplemental) {
        return false;
      }

      // Filter by ability requirements
      return race.abilityRequirements.every((requirement) => {
        const abilityValue = character.abilities[requirement.ability].value;

        if (requirement.min && abilityValue < requirement.min) {
          return false;
        }

        if (requirement.max && abilityValue > requirement.max) {
          return false;
        }

        return true;
      });
    });
  }, [includeSupplemental, character.abilities]);

  // Convert races to select options
  const raceOptions = useMemo(() => {
    return availableRaces.map((race) => ({
      value: race.id,
      label: race.name,
    }));
  }, [availableRaces]);

  const handleRaceChange = (raceId: string) => {
    onCharacterChange({
      ...character,
      race: raceId,
    });
  };

  const currentRaceId = character.race || "";

  // Find the selected race object for display purposes
  const selectedRace = character.race
    ? allRaces.find((race) => race.id === character.race)
    : null;

  return (
    <StepWrapper
      title="Choose Your Race"
      description="Select the race that defines your character's heritage and abilities."
    >
      {/* Race Selection Controls */}
      <section className="mb-8">
        <div className="bg-zinc-800 border-2 border-zinc-600 rounded-lg p-6 shadow-[0_3px_0_0_#3f3f46]">
          <fieldset>
            <legend className="sr-only">Race selection options</legend>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-semibold text-zinc-100 mb-1">
                    Content Options
                  </h4>
                  <p className="text-sm text-zinc-400">
                    Include additional races from supplemental materials
                  </p>
                </div>
                <Switch
                  label="Include Supplemental Content"
                  checked={includeSupplemental}
                  onCheckedChange={onIncludeSupplementalChange}
                />
              </div>

              <div>
                <Select
                  label="Race"
                  options={raceOptions}
                  value={currentRaceId}
                  onValueChange={handleRaceChange}
                  placeholder="Select a race..."
                  required
                  aria-describedby={selectedRace ? "race-details" : undefined}
                />
                {raceOptions.length === 0 && (
                  <p className="text-sm text-amber-400 mt-2">
                    No races available with current ability scores. Try rolling
                    different abilities or including supplemental content.
                  </p>
                )}
              </div>
            </div>
          </fieldset>
        </div>
      </section>

      {/* Selected Race Details */}
      {selectedRace && (
        <section aria-labelledby="race-details-heading" className="mb-8">
          <h4
            id="race-details-heading"
            className="text-lg font-semibold text-zinc-100 mb-6"
          >
            Race Details
          </h4>

          <div className="bg-amber-950/20 border-2 border-amber-600 rounded-lg p-6 shadow-[0_3px_0_0_#b45309]">
            {/* Race Header */}
            <div className="flex items-center gap-3 mb-6">
              <svg
                className="w-6 h-6 flex-shrink-0 text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              <h5 className="text-xl font-semibold text-amber-100 m-0">
                {selectedRace.name}
              </h5>
              {selectedRace.supplementalContent && (
                <span className="bg-lime-600 text-zinc-900 text-xs font-medium px-2 py-1 rounded">
                  Supplemental
                </span>
              )}
            </div>

            {/* Race Description */}
            <div className="mb-6">
              <p className="text-amber-50 leading-relaxed m-0">
                {selectedRace.description}
              </p>
            </div>

            {/* Race Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Physical Description */}
              <div className="bg-zinc-800/50 border border-amber-700/30 rounded-lg p-4">
                <h6 className="font-semibold mb-3 text-amber-400 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Physical Description
                </h6>
                <p className="text-amber-50 text-sm leading-relaxed m-0">
                  {selectedRace.physicalDescription}
                </p>
              </div>

              {/* Ability Requirements */}
              {selectedRace.abilityRequirements.length > 0 && (
                <div className="bg-zinc-800/50 border border-amber-700/30 rounded-lg p-4">
                  <h6 className="font-semibold mb-3 text-amber-400 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Ability Requirements
                  </h6>
                  <div className="space-y-2">
                    {selectedRace.abilityRequirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-amber-100 font-medium">
                          {req.ability.charAt(0).toUpperCase() +
                            req.ability.slice(1)}
                        </span>
                        <span className="text-amber-200 text-sm">
                          {req.min && `min ${req.min}`}
                          {req.min && req.max && " • "}
                          {req.max && `max ${req.max}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Abilities */}
              {selectedRace.specialAbilities.length > 0 && (
                <div className="bg-zinc-800/50 border border-amber-700/30 rounded-lg p-4">
                  <h6 className="font-semibold mb-3 text-amber-400 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Special Abilities
                  </h6>
                  <div className="space-y-3">
                    {selectedRace.specialAbilities.map((ability, index) => (
                      <div key={index}>
                        <div className="font-medium text-amber-100 mb-1">
                          {ability.name}
                        </div>
                        <p className="text-amber-200 text-sm leading-relaxed m-0">
                          {ability.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Allowed Classes */}
              <div className="bg-zinc-800/50 border border-amber-700/30 rounded-lg p-4">
                <h6 className="font-semibold mb-3 text-amber-400 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
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
                  Allowed Classes
                </h6>
                <div className="flex flex-wrap gap-2">
                  {selectedRace.allowedClasses.map((classId, index) => (
                    <span
                      key={index}
                      className="bg-lime-600 text-zinc-900 text-xs font-medium px-2 py-1 rounded"
                    >
                      {getClassName(classId)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lifespan */}
              <div className="bg-zinc-800/50 border border-amber-700/30 rounded-lg p-4">
                <h6 className="font-semibold mb-3 text-amber-400 flex items-center gap-2">
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
                  Lifespan
                </h6>
                <p className="text-amber-50 text-sm m-0">
                  {selectedRace.lifespan}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </StepWrapper>
  );
}

export default memo(RaceStep);
