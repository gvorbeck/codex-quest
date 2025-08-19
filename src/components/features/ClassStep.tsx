import { useState } from "react";
import { Select, Switch } from "@/components/ui";
import { allClasses } from "@/data/classes";
import { combinationClasses } from "@/data/combinationClasses";
import { allRaces } from "@/data/races";
import type { Character } from "@/types/character";

interface ClassStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

export function ClassStep({ character, onCharacterChange }: ClassStepProps) {
  const [useCombinationClass, setUseCombinationClass] = useState(false);

  // Get the selected race data
  const selectedRace = allRaces.find((race) => race.id === character.race);

  // Filter classes based on race restrictions
  const availableClasses = allClasses.filter((cls) =>
    selectedRace?.allowedClasses.includes(cls.id)
  );

  // Filter combination classes based on race eligibility
  const availableCombinationClasses = combinationClasses.filter((combClass) =>
    combClass.eligibleRaces.includes(character.race)
  );

  const handleClassChange = (classId: string) => {
    onCharacterChange({
      ...character,
      class: classId,
      combinationClass: undefined,
    });
  };

  const handleCombinationClassChange = (combClassId: string) => {
    onCharacterChange({
      ...character,
      class: undefined,
      combinationClass: combClassId,
    });
  };

  const handleCombinationToggle = (enabled: boolean) => {
    setUseCombinationClass(enabled);
    if (!enabled) {
      // Clear combination class when toggling off
      onCharacterChange({
        ...character,
        combinationClass: undefined,
      });
    } else {
      // Clear regular class when toggling on
      onCharacterChange({
        ...character,
        class: undefined,
      });
    }
  };

  // Check if the character's race can use combination classes
  const canUseCombinationClasses = availableCombinationClasses.length > 0;

  if (!selectedRace) {
    return (
      <div className="p-4">
        <p>Please select a race first before choosing a class.</p>
      </div>
    );
  }

  // Prepare options for Select components
  const classOptions = availableClasses.map((cls) => ({
    value: cls.id,
    label: cls.name,
  }));

  const combinationClassOptions = availableCombinationClasses.map(
    (combClass) => ({
      value: combClass.id,
      label: combClass.name,
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Choose Your Class</h2>
        <p className="text-gray-600 mb-4">
          Select the class that defines your character's abilities and role.
        </p>
      </div>

      {canUseCombinationClasses && (
        <div className="p-4 border rounded-lg bg-blue-50">
          <Switch
            label="Use Combination Class"
            checked={useCombinationClass}
            onCheckedChange={handleCombinationToggle}
          />
          <p className="text-sm text-gray-600 mt-2">
            As an {selectedRace.name}, you can choose a combination class that
            combines the abilities of two base classes.
          </p>
        </div>
      )}

      {!useCombinationClass ? (
        <div>
          <h3 className="text-lg font-medium mb-3">Standard Classes</h3>
          <Select
            label="Select Class"
            value={character.class || ""}
            onValueChange={handleClassChange}
            options={classOptions}
            placeholder="Choose a class"
          />

          {character.class && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              {(() => {
                const selectedClass = availableClasses.find(
                  (cls) => cls.id === character.class
                );
                return selectedClass ? (
                  <div>
                    <h4 className="font-semibold mb-2">{selectedClass.name}</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      {selectedClass.description}
                    </p>
                    <div className="text-sm">
                      <p>
                        <strong>Hit Die:</strong> {selectedClass.hitDie}
                      </p>
                      <p>
                        <strong>Primary Attribute:</strong>{" "}
                        {selectedClass.primaryAttribute}
                      </p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-medium mb-3">Combination Classes</h3>
          <Select
            label="Select Combination Class"
            value={character.combinationClass || ""}
            onValueChange={handleCombinationClassChange}
            options={combinationClassOptions}
            placeholder="Choose a combination class"
          />

          {character.combinationClass && (
            <div className="mt-4 p-4 border rounded-lg bg-yellow-50">
              {(() => {
                const selectedCombClass = availableCombinationClasses.find(
                  (combClass) => combClass.id === character.combinationClass
                );
                return selectedCombClass ? (
                  <div>
                    <h4 className="font-semibold mb-2">
                      {selectedCombClass.name}
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                      {selectedCombClass.description}
                    </p>
                    <div className="text-sm mb-3">
                      <p>
                        <strong>Hit Die:</strong> {selectedCombClass.hitDie}
                      </p>
                      <p>
                        <strong>Combines:</strong>{" "}
                        {selectedCombClass.primaryClasses.join(" and ")}
                      </p>
                    </div>
                    {selectedCombClass.specialAbilities.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Special Abilities:</h5>
                        <ul className="space-y-1">
                          {selectedCombClass.specialAbilities.map(
                            (ability, index) => (
                              <li key={index} className="text-sm">
                                <strong>{ability.name}:</strong>{" "}
                                {ability.description}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
