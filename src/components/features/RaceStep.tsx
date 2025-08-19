import { Switch, Select } from "@/components/ui";
import { allRaces } from "@/data/races";
import type { Character } from "@/types/character";

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
  const availableRaces = allRaces.filter((race) => {
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

  // Convert races to select options
  const raceOptions = availableRaces.map((race) => ({
    value: race.id,
    label: race.name,
  }));

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
    <div>
      <div>
        <h2>Choose Your Race</h2>

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
          />
        </div>

        {selectedRace && (
          <div>
            <h3>{selectedRace.name}</h3>
            <p>{selectedRace.description}</p>

            <div>
              <h4>Physical Description</h4>
              <p>{selectedRace.physicalDescription}</p>
            </div>

            {selectedRace.abilityRequirements.length > 0 && (
              <div>
                <h4>Ability Requirements</h4>
                <ul>
                  {selectedRace.abilityRequirements.map((req, index) => (
                    <li key={index}>
                      {req.ability.charAt(0).toUpperCase() +
                        req.ability.slice(1)}
                      : {req.min && `minimum ${req.min}`}
                      {req.min && req.max && ", "}
                      {req.max && `maximum ${req.max}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedRace.specialAbilities.length > 0 && (
              <div>
                <h4>Special Abilities</h4>
                <ul>
                  {selectedRace.specialAbilities.map((ability, index) => (
                    <li key={index}>
                      <span>{ability.name}:</span>{" "}
                      <span>{ability.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4>Allowed Classes</h4>
              <p>{selectedRace.allowedClasses.join(", ")}</p>
            </div>

            <div>
              <h4>Lifespan</h4>
              <p>{selectedRace.lifespan}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RaceStep;
