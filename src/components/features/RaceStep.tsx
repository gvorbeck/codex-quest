import { useState } from "react";
import { Switch, Select } from "@/components/ui";
import { allRaces } from "@/data/races";
import type { Character } from "@/types/character";

interface RaceStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

function RaceStep({ character, onCharacterChange }: RaceStepProps) {
  const [includeSupplemental, setIncludeSupplemental] = useState(false);

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
    const selectedRace = allRaces.find((race) => race.id === raceId);
    if (selectedRace) {
      onCharacterChange({
        ...character,
        race: selectedRace,
      });
    }
  };

  const currentRaceId = character.race?.id || "";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Choose Your Race</h2>

        <div className="mb-4">
          <Switch
            label="Include Supplemental Content"
            checked={includeSupplemental}
            onCheckedChange={setIncludeSupplemental}
          />
        </div>

        <div className="mb-6">
          <Select
            label="Race"
            options={raceOptions}
            value={currentRaceId}
            onValueChange={handleRaceChange}
            placeholder="Select a race..."
          />
        </div>

        {character.race && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              {character.race.name}
            </h3>
            <p className="text-gray-700 mb-4">{character.race.description}</p>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Physical Description</h4>
              <p className="text-sm text-gray-600">
                {character.race.physicalDescription}
              </p>
            </div>

            {character.race.abilityRequirements.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Ability Requirements</h4>
                <ul className="text-sm text-gray-600">
                  {character.race.abilityRequirements.map((req, index) => (
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

            {character.race.specialAbilities.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Special Abilities</h4>
                <ul className="space-y-2">
                  {character.race.specialAbilities.map((ability, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{ability.name}:</span>{" "}
                      <span className="text-gray-600">
                        {ability.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-4">
              <h4 className="font-medium mb-2">Allowed Classes</h4>
              <p className="text-sm text-gray-600">
                {character.race.allowedClasses.join(", ")}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Lifespan</h4>
              <p className="text-sm text-gray-600">{character.race.lifespan}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RaceStep;
