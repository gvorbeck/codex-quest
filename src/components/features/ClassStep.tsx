import { Switch, StepWrapper } from "@/components/ui";
import {
  StandardClassSelector,
  CombinationClassSelector,
  SpellSelector,
} from "@/components/features";
import { allClasses } from "@/data/classes";
import { allRaces } from "@/data/races";
import type { Character, Spell } from "@/types/character";
import { getFirstLevelSpellsForClass, hasSpellcasting } from "@/utils/spells";
import { memo, useState, useEffect } from "react";

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
  
  // State for managing available spells
  const [availableSpells, setAvailableSpells] = useState<Spell[]>([]);
  const [isLoadingSpells, setIsLoadingSpells] = useState(false);

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
      spells: [], // Reset spells when changing class
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
        spells: [], // Reset spells when changing class
      });
    }
  };

  // Load available spells when spellcasting class changes
  useEffect(() => {
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

    const spellcastingClassId = getEffectiveSpellcastingClass();
    if (spellcastingClassId) {
      setIsLoadingSpells(true);
      getFirstLevelSpellsForClass(spellcastingClassId)
        .then((spells) => {
          setAvailableSpells(spells);
        })
        .catch((error) => {
          console.error('Failed to load spells:', error);
          setAvailableSpells([]);
        })
        .finally(() => {
          setIsLoadingSpells(false);
        });
    } else {
      setAvailableSpells([]);
      setIsLoadingSpells(false);
    }
  }, [character.class, availableClasses]);

  const handleSpellChange = (spellName: string) => {
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

  const handleCombinationToggle = (enabled: boolean) => {
    onUseCombinationClassChange(enabled);
    if (!enabled) {
      // Clear to single class when toggling off
      const firstClass = character.class[0];
      onCharacterChange({
        ...character,
        class: firstClass ? [firstClass] : [],
        spells: [], // Clear spells when switching class types
      });
    } else {
      // Clear classes when toggling on
      onCharacterChange({
        ...character,
        class: [],
        spells: [], // Clear spells when switching class types
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

  // Get spell-related data for current class configuration
  const showSpellSelection = availableSpells.length > 0;

  return (
    <StepWrapper
      title="Choose Your Class"
      description="Select the class that defines your character's abilities and role."
      statusMessage={getClassDisplayName() || ""}
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
        <>
          <StandardClassSelector
            character={character}
            availableClasses={availableClasses}
            onClassChange={handleSingleClassChange}
          />

          {showSpellSelection && (
            <SpellSelector
              character={character}
              availableSpells={availableSpells}
              onSpellChange={handleSpellChange}
              title="Starting Spell"
              description="Your class grants you the ability to cast spells. You begin knowing the <strong>Read Magic</strong> spell and one additional first-level spell of your choosing."
              detailsId="spell-selection"
              isLoading={isLoadingSpells}
            />
          )}
        </>
      ) : (
        <>
          <CombinationClassSelector
            character={character}
            validCombinations={validCombinations}
            onCombinationChange={handleCombinationClassChange}
          />

          {showSpellSelection && (
            <SpellSelector
              character={character}
              availableSpells={availableSpells}
              onSpellChange={handleSpellChange}
              title="Starting Spell"
              description="Your combination class grants you the ability to cast spells. You begin knowing the <strong>Read Magic</strong> spell and one additional first-level spell of your choosing."
              detailsId="combination-spell-selection"
              isLoading={isLoadingSpells}
            />
          )}
        </>
      )}
    </StepWrapper>
  );
}

export const ClassStep = memo(ClassStepComponent);
