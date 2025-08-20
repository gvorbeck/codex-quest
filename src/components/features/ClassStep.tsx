import { Select, Switch, StepWrapper } from "@/components/ui";
import { allClasses } from "@/data/classes";
import { allRaces } from "@/data/races";
import type { Character } from "@/types/character";
import { getFirstLevelSpellsForClass, hasSpellcasting } from "@/utils/spells";
import { memo } from "react";

interface ClassStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
  includeSupplementalClass: boolean;
  onIncludeSupplementalClassChange: (include: boolean) => void;
  useCombinationClass: boolean;
  onUseCombinationClassChange: (use: boolean) => void;
}

function ClassStepComponent({
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

  // Valid combination classes for elves and dokkalfar
  const validCombinations = [
    { ids: ["fighter", "magic-user"], name: "Fighter/Magic-User" },
    { ids: ["magic-user", "thief"], name: "Magic-User/Thief" },
  ];

  const handleSingleClassChange = (classId: string) => {
    onCharacterChange({
      ...character,
      class: [classId],
      spells: undefined, // Reset spells when changing class
    });
  };

  const handleCombinationClassChange = (combinationName: string) => {
    const combination = validCombinations.find(
      (combo) => combo.name === combinationName
    );
    if (combination) {
      onCharacterChange({
        ...character,
        class: combination.ids,
        spells: undefined, // Reset spells when changing class
      });
    }
  };

  const handleSpellChange = (spellName: string) => {
    const spellcastingClassId = getEffectiveSpellcastingClass();
    if (!spellcastingClassId) return;

    const availableSpells = getFirstLevelSpellsForClass(spellcastingClassId);
    const selectedSpell = availableSpells.find(
      (spell) => spell.name === spellName
    );

    if (selectedSpell) {
      onCharacterChange({
        ...character,
        spells: [selectedSpell], // Replace any existing spells with the new selection
      });
    }
  };

  // Helper function to get the effective spellcasting class
  const getEffectiveSpellcastingClass = (): string | null => {
    // Check if any of the character's classes can cast spells
    for (const classId of character.class) {
      const classData = availableClasses.find((cls) => cls.id === classId);
      if (classData && hasSpellcasting(classData)) {
        return classId;
      }
    }
    return null;
  };

  const handleCombinationToggle = (enabled: boolean) => {
    onUseCombinationClassChange(enabled);
    if (!enabled) {
      // Clear to single class when toggling off
      onCharacterChange({
        ...character,
        class: character.class.length > 0 ? [character.class[0]] : [],
        spells: undefined, // Clear spells when switching class types
      });
    } else {
      // Clear classes when toggling on
      onCharacterChange({
        ...character,
        class: [],
        spells: undefined, // Clear spells when switching class types
      });
    }
  };

  // Check if the character's race can use combination classes
  const canUseCombinationClasses =
    selectedRace && ["elf", "dokkalfar"].includes(selectedRace.id);

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

  const combinationClassOptions = validCombinations.map((combo) => ({
    value: combo.name,
    label: combo.name,
  }));

  // Get current class display name
  const getClassDisplayName = () => {
    if (character.class.length === 0) return undefined;
    if (character.class.length === 1) {
      const singleClass = availableClasses.find(
        (cls) => cls.id === character.class[0]
      );
      return singleClass ? `Selected class: ${singleClass.name}` : undefined;
    } else {
      const combination = validCombinations.find(
        (combo) =>
          combo.ids.length === character.class.length &&
          combo.ids.every((id) => character.class.includes(id))
      );
      return combination
        ? `Selected combination class: ${combination.name}`
        : `Selected classes: ${character.class.join(", ")}`;
    }
  };

  return (
    <StepWrapper
      title="Choose Your Class"
      description="Select the class that defines your character's abilities and role."
      statusMessage={getClassDisplayName()}
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
            value={character.class.length > 0 ? character.class[0] : ""}
            onValueChange={handleSingleClassChange}
            options={classOptions}
            placeholder="Choose a class"
            required
            aria-describedby={
              character.class.length > 0 ? "class-details" : undefined
            }
          />

          {character.class.length > 0 && (
            <div id="class-details">
              {(() => {
                const selectedClass = availableClasses.find(
                  (cls) => cls.id === character.class[0]
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

          {/* Spell Selection for Standard Classes */}
          {character.class.length > 0 &&
            (() => {
              const spellcastingClassId = getEffectiveSpellcastingClass();
              if (!spellcastingClassId) return null;

              const availableSpells =
                getFirstLevelSpellsForClass(spellcastingClassId);
              const spellOptions = availableSpells.map((spell) => ({
                value: spell.name,
                label: spell.name,
              }));

              const selectedSpell =
                character.spells && character.spells.length > 0
                  ? character.spells[0].name
                  : "";

              return (
                <section aria-labelledby="spell-selection-heading">
                  <h6 id="spell-selection-heading">Starting Spell</h6>
                  <p>
                    Your class grants you the ability to cast spells. You begin
                    knowing the <strong>Read Magic</strong> spell and one
                    additional first-level spell of your choosing.
                  </p>
                  <Select
                    label="Choose your starting spell"
                    value={selectedSpell}
                    onValueChange={handleSpellChange}
                    options={spellOptions}
                    placeholder="Choose a spell"
                    required
                    aria-describedby={
                      selectedSpell ? "selected-spell-details" : undefined
                    }
                  />

                  {selectedSpell &&
                    character.spells &&
                    character.spells.length > 0 && (
                      <div id="selected-spell-details">
                        {(() => {
                          const spell = character.spells[0];
                          return (
                            <section aria-labelledby="spell-info-heading">
                              <h6 id="spell-info-heading">{spell.name}</h6>
                              <dl>
                                <dt>Range:</dt>
                                <dd>{spell.range}</dd>
                                <dt>Duration:</dt>
                                <dd>{spell.duration}</dd>
                              </dl>
                              <p>{spell.description}</p>
                            </section>
                          );
                        })()}
                      </div>
                    )}
                </section>
              );
            })()}
        </section>
      ) : (
        <section aria-labelledby="combination-classes-heading">
          <h5 id="combination-classes-heading">Combination Classes</h5>
          <Select
            label="Select Combination Class"
            value={(() => {
              const combination = validCombinations.find(
                (combo) =>
                  combo.ids.length === character.class.length &&
                  combo.ids.every((id) => character.class.includes(id))
              );
              return combination ? combination.name : "";
            })()}
            onValueChange={handleCombinationClassChange}
            options={combinationClassOptions}
            placeholder="Choose a combination class"
            required
            aria-describedby={
              character.class.length > 1
                ? "combination-class-details"
                : undefined
            }
          />

          {character.class.length > 1 && (
            <div id="combination-class-details">
              <section aria-labelledby="combination-class-info-heading">
                <h6 id="combination-class-info-heading">
                  {(() => {
                    const combination = validCombinations.find(
                      (combo) =>
                        combo.ids.length === character.class.length &&
                        combo.ids.every((id) => character.class.includes(id))
                    );
                    return combination ? combination.name : "Combination Class";
                  })()}
                </h6>
                <p>
                  This combination class combines the abilities of{" "}
                  {character.class.join(" and ")}.
                </p>
                <dl>
                  <dt>Classes:</dt>
                  <dd>{character.class.join(", ")}</dd>
                </dl>
              </section>
            </div>
          )}

          {/* Spell Selection for Combination Classes */}
          {character.class.length > 1 &&
            (() => {
              const spellcastingClassId = getEffectiveSpellcastingClass();
              if (!spellcastingClassId) return null;

              const availableSpells =
                getFirstLevelSpellsForClass(spellcastingClassId);
              const spellOptions = availableSpells.map((spell) => ({
                value: spell.name,
                label: spell.name,
              }));

              const selectedSpell =
                character.spells && character.spells.length > 0
                  ? character.spells[0].name
                  : "";

              return (
                <section aria-labelledby="combination-spell-selection-heading">
                  <h6 id="combination-spell-selection-heading">
                    Starting Spell
                  </h6>
                  <p>
                    Your combination class grants you the ability to cast
                    spells. You begin knowing the <strong>Read Magic</strong>{" "}
                    spell and one additional first-level spell of your choosing.
                  </p>
                  <Select
                    label="Choose your starting spell"
                    value={selectedSpell}
                    onValueChange={handleSpellChange}
                    options={spellOptions}
                    placeholder="Choose a spell"
                    required
                    aria-describedby={
                      selectedSpell
                        ? "selected-combination-spell-details"
                        : undefined
                    }
                  />

                  {selectedSpell &&
                    character.spells &&
                    character.spells.length > 0 && (
                      <div id="selected-combination-spell-details">
                        {(() => {
                          const spell = character.spells[0];
                          return (
                            <section aria-labelledby="combination-spell-info-heading">
                              <h6 id="combination-spell-info-heading">
                                {spell.name}
                              </h6>
                              <dl>
                                <dt>Range:</dt>
                                <dd>{spell.range}</dd>
                                <dt>Duration:</dt>
                                <dd>{spell.duration}</dd>
                              </dl>
                              <p>{spell.description}</p>
                            </section>
                          );
                        })()}
                      </div>
                    )}
                </section>
              );
            })()}
        </section>
      )}
    </StepWrapper>
  );
}

export const ClassStep = memo(ClassStepComponent);
