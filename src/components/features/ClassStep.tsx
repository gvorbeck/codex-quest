import { Select, Switch, StepWrapper } from "@/components/ui";
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
    <StepWrapper
      title="Choose Your Class"
      description="Select the class that defines your character's abilities and role."
      statusMessage={
        character.class
          ? `Selected class: ${character.class}`
          : character.combinationClass
          ? `Selected combination class: ${character.combinationClass}`
          : undefined
      }
    >
      <fieldset>
        <legend className="sr-only">Class selection options</legend>

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
      </fieldset>

      {!useCombinationClass ? (
        <section aria-labelledby="standard-classes-heading">
          <h5 id="standard-classes-heading">Standard Classes</h5>
          <Select
            label="Select Class"
            value={character.class || ""}
            onValueChange={handleClassChange}
            options={classOptions}
            placeholder="Choose a class"
            required
            aria-describedby={character.class ? "class-details" : undefined}
          />

          {character.class && (
            <div id="class-details">
              {(() => {
                const selectedClass = availableClasses.find(
                  (cls) => cls.id === character.class
                );
                return selectedClass ? (
                  <section aria-labelledby="class-info-heading">
                    <h6 id="class-info-heading">{selectedClass.name}</h6>
                    <p>{selectedClass.description}</p>
                    <dl>
                      <dt>Hit Die:</dt>
                      <dd>{selectedClass.hitDie}</dd>
                      <dt>Primary Attribute:</dt>
                      <dd>{selectedClass.primaryAttribute}</dd>
                    </dl>
                  </section>
                ) : null;
              })()}
            </div>
          )}
        </section>
      ) : (
        <section aria-labelledby="combination-classes-heading">
          <h5 id="combination-classes-heading">Combination Classes</h5>
          <Select
            label="Select Combination Class"
            value={character.combinationClass || ""}
            onValueChange={handleCombinationClassChange}
            options={combinationClassOptions}
            placeholder="Choose a combination class"
            required
            aria-describedby={
              character.combinationClass
                ? "combination-class-details"
                : undefined
            }
          />

          {character.combinationClass && (
            <div id="combination-class-details">
              {(() => {
                const selectedCombClass = availableCombinationClasses.find(
                  (combClass) => combClass.id === character.combinationClass
                );
                return selectedCombClass ? (
                  <section aria-labelledby="combination-class-info-heading">
                    <h6 id="combination-class-info-heading">
                      {selectedCombClass.name}
                    </h6>
                    <p>{selectedCombClass.description}</p>
                    <dl>
                      <dt>Hit Die:</dt>
                      <dd>{selectedCombClass.hitDie}</dd>
                      <dt>Combines:</dt>
                      <dd>{selectedCombClass.primaryClasses.join(" and ")}</dd>
                    </dl>
                    {selectedCombClass.specialAbilities.length > 0 && (
                      <div>
                        <h6>Special Abilities:</h6>
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
                  </section>
                ) : null;
              })()}
            </div>
          )}
        </section>
      )}
    </StepWrapper>
  );
}
