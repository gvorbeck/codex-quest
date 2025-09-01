import { Select, OptionToggle } from "@/components/ui/inputs";
import { StepWrapper } from "@/components/ui/layout";
import { Card, Typography, Badge } from "@/components/ui/design-system";
import { InfoCardHeader, DetailSection, Icon } from "@/components/ui/display";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";
import type { BaseStepProps } from "@/types/character";
import { memo, useMemo } from "react";

interface RaceStepProps extends BaseStepProps {
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
        <Card variant="standard">
          <fieldset>
            <legend className="sr-only">Race selection options</legend>

            <div className="space-y-6">
              <OptionToggle
                title="Content Options"
                description="Include additional races from supplemental materials"
                switchLabel="Include Supplemental Content"
                checked={includeSupplemental}
                onCheckedChange={onIncludeSupplementalChange}
              />

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
                  <Typography variant="helper" color="amber" className="mt-2">
                    No races available with current ability scores. Try rolling
                    different abilities or including supplemental content.
                  </Typography>
                )}
              </div>
            </div>
          </fieldset>
        </Card>
      </section>

      {/* Selected Race Details */}
      {selectedRace && (
        <section aria-labelledby="race-details-heading" className="mb-8">
          <Typography variant="sectionHeading" id="race-details-heading">
            Race Details
          </Typography>

          <Card variant="info">
            {/* Race Header */}
            <InfoCardHeader
              icon={<Icon name="eye" />}
              title={selectedRace.name}
              iconSize="lg"
              {...(selectedRace.supplementalContent && {
                badge: { text: "Supplemental" },
              })}
              className="mb-6"
            />

            {/* Race Description */}
            <div className="mb-6">
              <Typography variant="description" color="primary">
                {selectedRace.description}
              </Typography>
            </div>

            {/* Race Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Physical Description */}
              <DetailSection
                icon={<Icon name="user" />}
                title="Physical Description"
              >
                <Typography variant="description" color="primary">
                  {selectedRace.physicalDescription}
                </Typography>
              </DetailSection>

              {/* Ability Requirements */}
              {selectedRace.abilityRequirements.length > 0 && (
                <DetailSection
                  icon={<Icon name="badge-check" />}
                  title="Ability Requirements"
                >
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
                </DetailSection>
              )}

              {/* Special Abilities */}
              {selectedRace.specialAbilities.length > 0 && (
                <DetailSection
                  icon={<Icon name="star" />}
                  title="Special Abilities"
                >
                  <div className="space-y-3">
                    {selectedRace.specialAbilities.map((ability, index) => (
                      <div key={index}>
                        <div className="font-medium text-amber-100 mb-1">
                          {ability.name}
                        </div>
                        <Typography variant="helper" color="amber">
                          {ability.description}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </DetailSection>
              )}

              {/* Allowed Classes */}
              <DetailSection
                icon={<Icon name="briefcase" />}
                title="Allowed Classes"
              >
                <div className="flex flex-wrap gap-2">
                  {selectedRace.allowedClasses.map((classId, index) => (
                    <Badge key={index} variant="status">
                      {getClassName(classId)}
                    </Badge>
                  ))}
                </div>
              </DetailSection>

              {/* Lifespan */}
              <DetailSection icon={<Icon name="clock" />} title="Lifespan">
                <Typography variant="helper" color="primary">
                  {selectedRace.lifespan}
                </Typography>
              </DetailSection>
            </div>
          </Card>
        </section>
      )}
    </StepWrapper>
  );
}

export default memo(RaceStep);
