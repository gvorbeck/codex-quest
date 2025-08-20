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
import { memo, useState, useEffect, useMemo } from "react";

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
  const selectedRace = useMemo(() => {
    return allRaces.find((race) => race.id === character.race);
  }, [character.race]);

  // State for managing available spells
  const [availableSpells, setAvailableSpells] = useState<Spell[]>([]);
  const [isLoadingSpells, setIsLoadingSpells] = useState(false);

  // Filter classes based on race restrictions and supplemental content setting
  const availableClasses = useMemo(() => {
    return allClasses.filter(
      (cls) =>
        selectedRace?.allowedClasses.includes(cls.id) &&
        (includeSupplementalClass || !cls.supplementalContent)
    );
  }, [selectedRace, includeSupplementalClass]);

  // Valid combination classes for elves and dokkalfar
  const validCombinations = useMemo(() => {
    return [
      { ids: ["fighter", "magic-user"], name: "Fighter/Magic-User" },
      { ids: ["magic-user", "thief"], name: "Magic-User/Thief" },
    ];
  }, []);

  // Check if the character's race can use combination classes
  const canUseCombinationClasses = useMemo(() => {
    return selectedRace && ["elf", "dokkalfar"].includes(selectedRace.id);
  }, [selectedRace]);

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
          console.error("Failed to load spells:", error);
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

  // Get current class display name

  if (!selectedRace) {
    return (
      <StepWrapper
        title="Choose Your Class"
        description="Select the class that defines your character's abilities and role."
        statusMessage=""
      >
        <div className="bg-amber-950/20 border-2 border-amber-600 rounded-lg p-6 shadow-[0_3px_0_0_#b45309]">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="w-5 h-5 flex-shrink-0 text-amber-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <h4 className="font-semibold text-amber-100 m-0">Race Required</h4>
          </div>
          <p className="text-amber-50 m-0">
            Please select a race first before choosing a class. Your race
            determines which classes are available to you.
          </p>
        </div>
      </StepWrapper>
    );
  }

  // Get spell-related data for current class configuration
  const showSpellSelection = availableSpells.length > 0;

  return (
    <StepWrapper
      title="Choose Your Class"
      description="Select the class that defines your character's abilities and role."
    >
      {/* Class Selection Controls */}
      <section className="mb-8">
        <div className="bg-zinc-800 border-2 border-zinc-600 rounded-lg p-6 shadow-[0_3px_0_0_#3f3f46]">
          <fieldset>
            <legend className="sr-only">Class selection options</legend>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-semibold text-zinc-100 mb-1">
                    Content Options
                  </h4>
                  <p className="text-sm text-zinc-400">
                    Include additional classes from supplemental materials
                  </p>
                </div>
                <Switch
                  label="Include Supplemental Classes"
                  checked={includeSupplementalClass}
                  onCheckedChange={onIncludeSupplementalClassChange}
                />
              </div>

              {canUseCombinationClasses && (
                <div className="border-t border-zinc-600 pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-zinc-100 mb-1">
                        Combination Classes
                      </h4>
                      <p className="text-sm text-zinc-400">
                        As an {selectedRace.name}, you can choose a combination
                        class that combines the abilities of two base classes.
                      </p>
                    </div>
                    <Switch
                      label="Use Combination Class"
                      checked={useCombinationClass}
                      onCheckedChange={handleCombinationToggle}
                    />
                  </div>
                </div>
              )}
            </div>
          </fieldset>
        </div>
      </section>

      {/* Class Selection */}
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
