import { Select, OptionToggle, TextInput } from "@/components/ui/core/primitives";
import FormField from "@/components/ui/core/primitives/FormField";
import { StepWrapper } from "@/components/ui/core/layout";
import { Card, Typography, Badge } from "@/components/ui/core/display";
import { Icon } from "@/components/ui/core/display";
import { InfoCardHeader, DetailSection } from "@/components/ui/composite";
import { allRaces, allClasses } from "@/data";
import { isCustomRace, getRaceById } from "@/utils";
import type { BaseStepProps } from "@/types";
import { memo, useMemo, useState, useEffect } from "react";

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

  // Convert races to select options, including custom option
  const raceOptions = useMemo(() => {
    const options = availableRaces.map((race) => ({
      value: race.id,
      label: race.name,
    }));
    options.push({
      value: "custom",
      label: "Custom Race",
    });
    return options;
  }, [availableRaces]);

  const [customRaceName, setCustomRaceName] = useState("");
  const [isInCustomMode, setIsInCustomMode] = useState(false);

  // Initialize custom mode based on current character race
  useEffect(() => {
    const isCurrentRaceCustom = character.race && isCustomRace(character.race);
    if (isCurrentRaceCustom) {
      setIsInCustomMode(true);
      setCustomRaceName(character.race);
    }
  }, [character.race]); // Include character.race dependency

  const handleRaceChange = (raceId: string) => {
    if (raceId === "custom") {
      // Switch to custom race input mode
      setIsInCustomMode(true);
      setCustomRaceName("");
      onCharacterChange({
        ...character,
        race: "", // Clear race until custom name is entered
      });
    } else {
      // Standard race selected
      setIsInCustomMode(false);
      setCustomRaceName("");
      onCharacterChange({
        ...character,
        race: raceId,
      });
    }
  };

  const handleCustomRaceNameChange = (name: string) => {
    setCustomRaceName(name);
    // Store the custom race name directly in the race field
    onCharacterChange({
      ...character,
      race: name,
    });
  };

  const currentRaceId = character.race || "";

  // Find the selected race object for display purposes
  const selectedRace = character.race ? getRaceById(character.race) : null;

  // Check if current race is custom
  const isCurrentRaceCustom = character.race && isCustomRace(character.race);

  // Determine what should be selected in the dropdown
  const selectValue = isInCustomMode ? "custom" : currentRaceId;

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
                  value={selectValue}
                  onValueChange={handleRaceChange}
                  placeholder="Select a race..."
                  required
                  aria-describedby={selectedRace ? "race-details" : undefined}
                />

                {/* Custom Race Name Input */}
                {isInCustomMode && (
                  <div className="mt-4">
                    <FormField label="Custom Race Name" required>
                      <TextInput
                        value={
                          isCurrentRaceCustom ? character.race : customRaceName
                        }
                        onChange={handleCustomRaceNameChange}
                        placeholder="Enter your custom race name..."
                        required
                      />
                    </FormField>
                  </div>
                )}

                {raceOptions.length === 1 && ( // Only custom option available
                  <Typography variant="helper" color="amber" className="mt-2">
                    No standard races available with current ability scores. Try
                    rolling different abilities, including supplemental content,
                    or use a custom race.
                  </Typography>
                )}
              </div>
            </div>
          </fieldset>
        </Card>
      </section>

      {/* Selected Race Details */}
      {(selectedRace || isInCustomMode) && (
        <section aria-labelledby="race-details-heading" className="mb-8">
          <Typography variant="sectionHeading" id="race-details-heading">
            Race Details
          </Typography>

          <Card variant="info">
            {isInCustomMode ? (
              <>
                {/* Custom Race Header */}
                <InfoCardHeader
                  icon={<Icon name="edit" />}
                  title={
                    isCurrentRaceCustom
                      ? character.race
                      : customRaceName || "Custom Race"
                  }
                  iconSize="lg"
                  badge={{ text: "Custom" }}
                  className="mb-6"
                />

                {/* Custom Race Description */}
                <div className="mb-6">
                  <Typography variant="description" color="primary">
                    This is a custom race created by you. Custom races have no
                    class restrictions and can pursue any available class
                    combination.
                  </Typography>
                </div>

                {/* Custom Race Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* No Ability Requirements */}
                  <DetailSection
                    icon={<Icon name="badge-check" />}
                    title="Ability Requirements"
                  >
                    <Typography variant="helper" color="primary">
                      None - custom races have no ability score restrictions
                    </Typography>
                  </DetailSection>

                  {/* No Class Restrictions */}
                  <DetailSection
                    icon={<Icon name="briefcase" />}
                    title="Allowed Classes"
                  >
                    <Typography variant="helper" color="primary">
                      All classes available - no restrictions
                    </Typography>
                  </DetailSection>

                  {/* Custom Properties */}
                  <DetailSection
                    icon={<Icon name="star" />}
                    title="Special Abilities"
                  >
                    <Typography variant="helper" color="primary">
                      Define your own racial abilities and traits
                    </Typography>
                  </DetailSection>

                  {/* Custom Lifespan */}
                  <DetailSection icon={<Icon name="clock" />} title="Lifespan">
                    <Typography variant="helper" color="primary">
                      Determine your own lifespan and aging characteristics
                    </Typography>
                  </DetailSection>
                </div>
              </>
            ) : (
              selectedRace && (
                <>
                  {/* Standard Race Header */}
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
                          {selectedRace.abilityRequirements.map(
                            (req, index) => (
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
                            )
                          )}
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
                          {selectedRace.specialAbilities.map(
                            (ability, index) => (
                              <div key={index}>
                                <div className="font-medium text-amber-100 mb-1">
                                  {ability.name}
                                </div>
                                <Typography variant="helper" color="amber">
                                  {ability.description}
                                </Typography>
                              </div>
                            )
                          )}
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
                    <DetailSection
                      icon={<Icon name="clock" />}
                      title="Lifespan"
                    >
                      <Typography variant="helper" color="primary">
                        {selectedRace.lifespan}
                      </Typography>
                    </DetailSection>
                  </div>
                </>
              )
            )}
          </Card>
        </section>
      )}
    </StepWrapper>
  );
}

export default memo(RaceStep);
