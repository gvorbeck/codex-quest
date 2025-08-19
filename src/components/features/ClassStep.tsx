import { Select, Switch } from "@/components/ui";
import { allClasses } from "@/data/classes";
import { combinationClasses } from "@/data/combinationClasses";
import { allRaces } from "@/data/races";
import type { Character } from "@/types/character";

interface ClassStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
  includeSupplementalClass: boolean;
  onIncludeSupplementalClassChange: (include: boolean) => void;
  useCombinationClass: boolean;
  onUseCombinationClassChange: (use: boolean) => void;
}

export function ClassStep({
  character,
  onCharacterChange,
  includeSupplementalClass,
  onIncludeSupplementalClassChange,
  useCombinationClass,
  onUseCombinationClassChange,
}: ClassStepProps) {
  // Get the selected race data
  const selectedRace = allRaces.find((race) => race.id === character.race);

  // Filter classes based on race restrictions and supplemental content setting
  const availableClasses = allClasses.filter(
    (cls) =>
      selectedRace?.allowedClasses.includes(cls.id) &&
      (includeSupplementalClass || !cls.supplementalContent)
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
    onUseCombinationClassChange(enabled);
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
      <div>
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
    <div>
      <div>
        <h2>Choose Your Class</h2>
        <p>
          Select the class that defines your character's abilities and role.
        </p>
      </div>

      <div>
        <Switch
          label="Include Supplemental Classes"
          checked={includeSupplementalClass}
          onCheckedChange={onIncludeSupplementalClassChange}
        />
      </div>

      {canUseCombinationClasses && (
        <div>
          <Switch
            label="Use Combination Class"
            checked={useCombinationClass}
            onCheckedChange={handleCombinationToggle}
          />
          <p>
            As an {selectedRace.name}, you can choose a combination class that
            combines the abilities of two base classes.
          </p>
        </div>
      )}

      {!useCombinationClass ? (
        <div>
          <h3>Standard Classes</h3>
          <Select
            label="Select Class"
            value={character.class || ""}
            onValueChange={handleClassChange}
            options={classOptions}
            placeholder="Choose a class"
          />

          {character.class && (
            <div>
              {(() => {
                const selectedClass = availableClasses.find(
                  (cls) => cls.id === character.class
                );
                return selectedClass ? (
                  <div>
                    <h4>{selectedClass.name}</h4>
                    <p>{selectedClass.description}</p>
                    <div>
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
          <h3>Combination Classes</h3>
          <Select
            label="Select Combination Class"
            value={character.combinationClass || ""}
            onValueChange={handleCombinationClassChange}
            options={combinationClassOptions}
            placeholder="Choose a combination class"
          />

          {character.combinationClass && (
            <div>
              {(() => {
                const selectedCombClass = availableCombinationClasses.find(
                  (combClass) => combClass.id === character.combinationClass
                );
                return selectedCombClass ? (
                  <div>
                    <h4>{selectedCombClass.name}</h4>
                    <p>{selectedCombClass.description}</p>
                    <div>
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
                        <h5>Special Abilities:</h5>
                        <ul>
                          {selectedCombClass.specialAbilities.map(
                            (ability, index) => (
                              <li key={index}>
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
