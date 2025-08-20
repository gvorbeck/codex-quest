import { Switch, Select, StepWrapper } from "@/components/ui";
import { allRaces } from "@/data/races";
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
      statusMessage={selectedRace ? `Selected race: ${selectedRace.name}` : ""}
    >
      <fieldset>
        <legend className="sr-only">Race selection options</legend>

        <div>
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
        </div>
      </fieldset>

      {selectedRace && (
        <section id="race-details" aria-labelledby="race-info-heading">
          <header>
            <h5 id="race-info-heading">{selectedRace.name}</h5>
            <p>{selectedRace.description}</p>
          </header>

          <div>
            <h6>Physical Description</h6>
            <p>{selectedRace.physicalDescription}</p>
          </div>

          {selectedRace.abilityRequirements.length > 0 && (
            <div>
              <h6>Ability Requirements</h6>
              <ul>
                {selectedRace.abilityRequirements.map((req, index) => (
                  <li key={index}>
                    <strong>
                      {req.ability.charAt(0).toUpperCase() +
                        req.ability.slice(1)}
                      :
                    </strong>{" "}
                    {req.min && `minimum ${req.min}`}
                    {req.min && req.max && ", "}
                    {req.max && `maximum ${req.max}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedRace.specialAbilities.length > 0 && (
            <div>
              <h6>Special Abilities</h6>
              <ul>
                {selectedRace.specialAbilities.map((ability, index) => (
                  <li key={index}>
                    <strong>{ability.name}:</strong> {ability.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h6>Allowed Classes</h6>
            <p>{selectedRace.allowedClasses.join(", ")}</p>
          </div>

          <div>
            <h6>Lifespan</h6>
            <p>{selectedRace.lifespan}</p>
          </div>
        </section>
      )}
    </StepWrapper>
  );
}

export default memo(RaceStep);
