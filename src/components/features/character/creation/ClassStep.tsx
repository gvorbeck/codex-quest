import { OptionToggle } from "@/components/ui/core/primitives";
import { StepWrapper } from "@/components/ui/core/layout";
import { Card } from "@/components/ui/core/display";
import { RequirementCard } from "@/components/ui/composite";
import { Icon } from "@/components/ui";
import {
  StandardClassSelector,
  CombinationClassSelector,
  SpellSelector,
} from "@/components/features/character/creation";
import { SpellChecklistSelector } from "@/components/features/character/creation/SpellChecklistSelector";
import { CantripSelector } from "@/components/features/character/shared";
import { allClasses, allRaces } from "@/data";
import {
  findById,
  getFirstLevelSpellsForClass,
  getAllSpellsForCustomClass,
  logger,
  getSpellTypeInfo,
  getEffectiveSpellcastingClass,
  assignStartingCantrips,
  getCharacterSpellSystemType,
  hasCustomRace,
} from "@/utils";
import type { Spell, Cantrip, BaseStepProps, Character } from "@/types";
import { useCharacterStore } from "@/stores";
import { COMBINATION_CLASS_IDS } from "@/constants";
import { memo, useState, useEffect, useMemo } from "react";

interface ClassStepProps extends BaseStepProps {
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
    return findById(character.race, allRaces);
  }, [character.race]);

  // State for managing available spells
  const [availableSpells, setAvailableSpells] = useState<Spell[]>([]);
  const [allSpellsForCustomClass, setAllSpellsForCustomClass] = useState<
    Spell[]
  >([]);
  const [isLoadingSpells, setIsLoadingSpells] = useState(false);
  const [isLoadingAllSpells, setIsLoadingAllSpells] = useState(false);

  // Use Zustand store for custom class magic toggle
  const customClassMagicToggle = useCharacterStore(
    (state) => state.preferences.customClassMagicToggle
  );
  const updatePreferences = useCharacterStore(
    (state) => state.updatePreferences
  );

  // Filter classes based on race restrictions and supplemental content setting
  // Excludes combination classes - those are shown separately via CombinationClassSelector
  const availableClasses = useMemo(() => {
    // Custom races have no class restrictions
    if (hasCustomRace(character)) {
      return allClasses.filter(
        (cls) =>
          (includeSupplementalClass || !cls.supplementalContent) &&
          !COMBINATION_CLASS_IDS.includes(cls.id)
      );
    }

    return allClasses.filter(
      (cls) =>
        selectedRace?.allowedClasses.includes(cls.id) &&
        (includeSupplementalClass || !cls.supplementalContent) &&
        !COMBINATION_CLASS_IDS.includes(cls.id)
    );
  }, [selectedRace, includeSupplementalClass, character]);

  // Check if the character's race can use combination classes
  // A race can use combination classes if their allowedClasses includes any combination class ID
  const canUseCombinationClasses = useMemo(() => {
    // Custom races can use combination classes
    if (hasCustomRace(character)) {
      return true;
    }
    return (
      selectedRace?.allowedClasses.some((cls) =>
        COMBINATION_CLASS_IDS.includes(cls)
      ) ?? false
    );
  }, [selectedRace, character]);

  const handleSingleClassChange = (classId: string) => {
    const newCharacter = {
      ...character,
      class: classId,
      spells: [], // Reset spells when changing class
      cantrips: [], // Reset cantrips to allow auto-assignment
    };

    // Auto-assign starting cantrips
    const startingCantrips = assignStartingCantrips(newCharacter);

    onCharacterChange({
      ...newCharacter,
      cantrips: startingCantrips,
    });
  };

  const handleCombinationClassChange = (combinationClassId: string) => {
    const newCharacter = {
      ...character,
      class: combinationClassId,
      spells: [], // Reset spells when changing class
      cantrips: [], // Reset cantrips to allow auto-assignment
    };

    // Auto-assign starting cantrips
    const startingCantrips = assignStartingCantrips(newCharacter);

    onCharacterChange({
      ...newCharacter,
      cantrips: startingCantrips,
    });
  };

  // Load available spells when spellcasting class changes
  useEffect(() => {
    const spellcastingClass = getEffectiveSpellcastingClass(
      character,
      availableClasses
    );

    if (spellcastingClass) {
      if (spellcastingClass.type === "custom") {
        // Load all spells for custom classes
        setIsLoadingAllSpells(true);
        getAllSpellsForCustomClass()
          .then((spells) => {
            setAllSpellsForCustomClass(spells);
          })
          .catch((error) => {
            logger.error("Failed to load all spells for custom class:", error);
            setAllSpellsForCustomClass([]);
          })
          .finally(() => {
            setIsLoadingAllSpells(false);
          });

        // Clear standard spell loading
        setAvailableSpells([]);
        setIsLoadingSpells(false);
      } else {
        // Load level 1 spells for standard classes
        setIsLoadingSpells(true);
        getFirstLevelSpellsForClass(spellcastingClass.classId)
          .then((spells) => {
            setAvailableSpells(spells);
          })
          .catch((error) => {
            logger.error("Failed to load spells:", error);
            setAvailableSpells([]);
          })
          .finally(() => {
            setIsLoadingSpells(false);
          });

        // Clear custom spell loading
        setAllSpellsForCustomClass([]);
        setIsLoadingAllSpells(false);
      }
    } else {
      // No spellcasting classes
      setAvailableSpells([]);
      setAllSpellsForCustomClass([]);
      setIsLoadingSpells(false);
      setIsLoadingAllSpells(false);
    }
  }, [character, availableClasses]);

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

  const handleSpellsChange = (spells: Spell[]) => {
    onCharacterChange({
      ...character,
      spells,
    });
  };

  const handleCantripChange = (cantrips: Cantrip[]) => {
    onCharacterChange({
      ...character,
      cantrips,
    });
  };

  const handleShowCantripsChange = (showCantrips: boolean) => {
    const updatedCharacter: Character = {
      ...character,
      settings: {
        ...character.settings,
        showCantrips,
      },
    };
    onCharacterChange(updatedCharacter);
  };

  const handleCombinationToggle = (enabled: boolean) => {
    onUseCombinationClassChange(enabled);
    // Clear class selection when toggling to allow fresh selection
    onCharacterChange({
      ...character,
      class: "",
      spells: [], // Clear spells when switching class types
      cantrips: [], // Clear cantrips when switching class types
    });
  };

  // Get spell-related data for current class configuration
  // Only magic-user types get starting spells at level 1 (they have Read Magic)
  // Cleric types start getting spells at level 2
  const characterSpellSystemType = getCharacterSpellSystemType(character);
  const shouldShowStartingSpells =
    characterSpellSystemType === "magic-user" ||
    characterSpellSystemType === "custom";

  const showStandardSpellSelection =
    availableSpells.length > 0 && shouldShowStartingSpells;

  // Memoized cantrip selector props to avoid duplication
  const showCantrips = character.settings?.showCantrips !== false;
  const cantripSelectorProps = useMemo(() => {
    const spellTypeInfo = getSpellTypeInfo(character);
    return {
      title: `Starting ${spellTypeInfo.capitalized}`,
      description: `You automatically know **${
        character.cantrips?.length || 0
      }** starting ${spellTypeInfo.type} (rolled 1d4 + ${
        spellTypeInfo.abilityScore
      } bonus). You may change your selection below.`,
    };
  }, [character]);

  // Check if we have a race selected (either standard or custom)
  const hasRaceSelected = character.race && character.race.length > 0;

  if (!hasRaceSelected) {
    return (
      <StepWrapper
        title="Choose Your Class"
        description="Select the class that defines your character's abilities and role."
        statusMessage=""
      >
        <RequirementCard
          title="Race Required"
          message="Please select a race first before choosing a class. Your race determines which classes are available to you."
          icon={<Icon name="info" size="md" aria-hidden={true} />}
        />
      </StepWrapper>
    );
  }

  return (
    <StepWrapper
      title="Choose Your Class"
      description="Select the class that defines your character's abilities and role."
    >
      {/* Class Selection Controls */}
      <section className="mb-8">
        <Card variant="standard">
          <fieldset>
            <legend className="sr-only">Class selection options</legend>

            <div className="space-y-6">
              <OptionToggle
                title="Content Options"
                description="Include additional classes from supplemental materials"
                switchLabel="Include Supplemental Classes"
                checked={includeSupplementalClass}
                onCheckedChange={onIncludeSupplementalClassChange}
              />

              <div className="border-t border-zinc-600 pt-6">
                <OptionToggle
                  title="Use Cantrips/Orisons"
                  description="Include 0-level spells (cantrips for Magic-Users, orisons for Clerics) in your character"
                  switchLabel="Use Cantrips/Orisons"
                  checked={character.settings?.showCantrips !== false}
                  onCheckedChange={handleShowCantripsChange}
                />
              </div>

              {canUseCombinationClasses && (
                <div className="border-t border-zinc-600 pt-6">
                  <OptionToggle
                    title="Combination Classes"
                    description={`As ${
                      hasCustomRace(character)
                        ? "a custom race"
                        : `an ${selectedRace?.name}`
                    }, you can choose a combination class that combines the abilities of two base classes.`}
                    switchLabel="Use Combination Class"
                    checked={useCombinationClass}
                    onCheckedChange={handleCombinationToggle}
                  />
                </div>
              )}
            </div>
          </fieldset>
        </Card>
      </section>

      {/* Class Selection */}
      {!useCombinationClass ? (
        <>
          <StandardClassSelector
            character={character}
            availableClasses={availableClasses}
            onClassChange={handleSingleClassChange}
            onCharacterChange={onCharacterChange}
            customClassMagicToggle={customClassMagicToggle}
            onCustomClassMagicToggle={(value) => {
              updatePreferences({ customClassMagicToggle: value });
              // Clear spells when magic is toggled off
              if (!value) {
                onCharacterChange({
                  ...character,
                  spells: [],
                });
              }
            }}
          />

          {/* Standard spell selection for built-in classes */}
          {showStandardSpellSelection && (
            <>
              <SpellSelector
                character={character}
                availableSpells={availableSpells}
                onSpellChange={handleSpellChange}
                title="Starting Spell"
                description="Your class grants you the ability to cast spells. You begin knowing the **Read Magic** spell and one additional first-level spell of your choosing."
                detailsId="spell-selection"
                isLoading={isLoadingSpells}
              />

              {showCantrips && (
                <CantripSelector
                  character={character}
                  onCantripChange={handleCantripChange}
                  mode="creation"
                  title={cantripSelectorProps.title}
                  description={cantripSelectorProps.description}
                />
              )}
            </>
          )}

          {/* Custom spell selection for custom classes */}
          {customClassMagicToggle && (
            <>
              <SpellChecklistSelector
                character={character}
                availableSpells={allSpellsForCustomClass}
                onSpellsChange={handleSpellsChange}
                title="Custom Class Spells"
                description="Select all spells your custom class should know. Since this is a custom class, you can choose spells from any level and any class. **Read Magic** is automatically granted if you select any spells."
                isLoading={isLoadingAllSpells}
              />

              {showCantrips && (
                <CantripSelector
                  character={character}
                  onCantripChange={handleCantripChange}
                  mode="creation"
                  title={cantripSelectorProps.title}
                  description={cantripSelectorProps.description}
                />
              )}
            </>
          )}
        </>
      ) : (
        <>
          <CombinationClassSelector
            character={character}
            onCombinationChange={handleCombinationClassChange}
            raceAllowedClasses={selectedRace?.allowedClasses}
          />

          {/* Standard spell selection for built-in combination classes */}
          {showStandardSpellSelection && (
            <>
              <SpellSelector
                character={character}
                availableSpells={availableSpells}
                onSpellChange={handleSpellChange}
                title="Starting Spell"
                description="Your combination class grants you the ability to cast spells. You begin knowing the **Read Magic** spell and one additional first-level spell of your choosing."
                detailsId="combination-spell-selection"
                isLoading={isLoadingSpells}
              />

              {showCantrips && (
                <CantripSelector
                  character={character}
                  onCantripChange={handleCantripChange}
                  mode="creation"
                  title={cantripSelectorProps.title}
                  description={cantripSelectorProps.description}
                />
              )}
            </>
          )}

          {/* Custom spell selection for custom combination classes */}
          {customClassMagicToggle && (
            <>
              <SpellChecklistSelector
                character={character}
                availableSpells={allSpellsForCustomClass}
                onSpellsChange={handleSpellsChange}
                title="Custom Class Spells"
                description="Select all spells your custom combination class should know. Since this is a custom class, you can choose spells from any level and any class. **Read Magic** is automatically granted if you select any spells."
                isLoading={isLoadingAllSpells}
              />

              {showCantrips && (
                <CantripSelector
                  character={character}
                  onCantripChange={handleCantripChange}
                  mode="creation"
                  title={cantripSelectorProps.title}
                  description={cantripSelectorProps.description}
                />
              )}
            </>
          )}
        </>
      )}
    </StepWrapper>
  );
}

export const ClassStep = memo(ClassStepComponent);
