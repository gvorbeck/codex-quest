import { OptionToggle } from "@/components/ui/inputs";
import { StepWrapper } from "@/components/ui/layout";
import { Card } from "@/components/ui/design-system";
import { RequirementCard } from "@/components/ui/display";
import { Icon } from "@/components/ui";
import {
  StandardClassSelector,
  CombinationClassSelector,
  SpellSelector,
} from "@/components/character/creation";
import { SpellChecklistSelector } from "@/components/character/creation/SpellChecklistSelector";
import { CantripSelector } from "@/components/character/shared";
import { allClasses } from "@/data/classes";
import { allRaces } from "@/data/races";
import type {
  Spell,
  Cantrip,
  BaseStepProps,
  Character,
} from "@/types/character";
import {
  getFirstLevelSpellsForClass,
  getAllSpellsForCustomClass,
} from "@/utils/spells";
import { logger } from "@/utils/logger";
import { getSpellTypeInfo } from "@/utils/cantrips";
import {
  getEffectiveSpellcastingClass,
  assignStartingCantrips,
} from "@/utils/characterCreation";
import { getCharacterSpellSystemType } from "@/utils/characterHelpers";
import { useLocalStorage } from "@/hooks";
import { STORAGE_KEYS } from "@/constants/storage";
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
    return allRaces.find((race) => race.id === character.race);
  }, [character.race]);

  // State for managing available spells
  const [availableSpells, setAvailableSpells] = useState<Spell[]>([]);
  const [allSpellsForCustomClass, setAllSpellsForCustomClass] = useState<
    Spell[]
  >([]);
  const [isLoadingSpells, setIsLoadingSpells] = useState(false);
  const [isLoadingAllSpells, setIsLoadingAllSpells] = useState(false);

  // Use localStorage for custom class magic toggle
  const [customClassMagicToggle, setCustomClassMagicToggle] =
    useLocalStorage<boolean>(STORAGE_KEYS.CUSTOM_CLASS_MAGIC_TOGGLE, false);

  // Filter classes based on race restrictions and supplemental content setting
  const availableClasses = useMemo(() => {
    // Custom races have no class restrictions
    if (character.race === "custom") {
      return allClasses.filter(
        (cls) => includeSupplementalClass || !cls.supplementalContent
      );
    }

    return allClasses.filter(
      (cls) =>
        selectedRace?.allowedClasses.includes(cls.id) &&
        (includeSupplementalClass || !cls.supplementalContent)
    );
  }, [selectedRace, includeSupplementalClass, character.race]);

  // Valid combination classes for elves and dokkalfar
  const validCombinations = useMemo(() => {
    return [
      { ids: ["fighter", "magic-user"], name: "Fighter/Magic-User" },
      { ids: ["magic-user", "thief"], name: "Magic-User/Thief" },
    ];
  }, []);

  // Check if the character's race can use combination classes
  const canUseCombinationClasses = useMemo(() => {
    // Custom races can use combination classes
    if (character.race === "custom") {
      return true;
    }
    return (
      selectedRace && ["elf", "dokkalfar", "half-elf"].includes(selectedRace.id)
    );
  }, [selectedRace, character.race]);

  const handleSingleClassChange = (classId: string) => {
    const newCharacter = {
      ...character,
      class: [classId],
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

  const handleCombinationClassChange = (combinationName: string) => {
    const combination = validCombinations.find(
      (combo) => combo.name === combinationName
    );
    if (combination) {
      const newCharacter = {
        ...character,
        class: combination.ids,
        spells: [], // Reset spells when changing class
        cantrips: [], // Reset cantrips to allow auto-assignment
      };

      // Auto-assign starting cantrips
      const startingCantrips = assignStartingCantrips(newCharacter);

      onCharacterChange({
        ...newCharacter,
        cantrips: startingCantrips,
      });
    }
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

  // Determine if we have a custom spellcasting class
  // const hasCustomSpellcaster = character.class.some((classId) => {
  //   if (character.customClasses && character.customClasses[classId]) {
  //     return character.customClasses[classId].usesSpells;
  //   }
  //   return false;
  // });

  // Get spell-related data for current class configuration
  // Only magic-user types get starting spells at level 1 (they have Read Magic)
  // Cleric types start getting spells at level 2
  const characterSpellSystemType = getCharacterSpellSystemType(character);
  const shouldShowStartingSpells =
    characterSpellSystemType === "magic-user" ||
    characterSpellSystemType === "custom";

  const showStandardSpellSelection =
    availableSpells.length > 0 && shouldShowStartingSpells;

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
                      character.race === "custom"
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
            customClassMagicToggle={customClassMagicToggle}
            onCustomClassMagicToggle={(value) => {
              setCustomClassMagicToggle(value);
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
                description="Your class grants you the ability to cast spells. You begin knowing the <strong>Read Magic</strong> spell and one additional first-level spell of your choosing."
                detailsId="spell-selection"
                isLoading={isLoadingSpells}
              />

              {character.settings?.showCantrips !== false && (
                <CantripSelector
                  character={character}
                  onCantripChange={handleCantripChange}
                  mode="creation"
                  title={(() => {
                    const spellTypeInfo = getSpellTypeInfo(character);
                    return `Starting ${spellTypeInfo.capitalized}`;
                  })()}
                  description={(() => {
                    const spellTypeInfo = getSpellTypeInfo(character);
                    return `You automatically know <strong>${
                      character.cantrips?.length || 0
                    }</strong> starting ${spellTypeInfo.type} (rolled 1d4 + ${
                      spellTypeInfo.abilityScore
                    } bonus). You may change your selection below.`;
                  })()}
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
                description="Select all spells your custom class should know. Since this is a custom class, you can choose spells from any level and any class. <strong>Read Magic</strong> is automatically granted if you select any spells."
                isLoading={isLoadingAllSpells}
              />

              {character.settings?.showCantrips !== false && (
                <CantripSelector
                  character={character}
                  onCantripChange={handleCantripChange}
                  mode="creation"
                  title={(() => {
                    const spellTypeInfo = getSpellTypeInfo(character);
                    return `Starting ${spellTypeInfo.capitalized}`;
                  })()}
                  description={(() => {
                    const spellTypeInfo = getSpellTypeInfo(character);
                    return `You automatically know <strong>${
                      character.cantrips?.length || 0
                    }</strong> starting ${spellTypeInfo.type} (rolled 1d4 + ${
                      spellTypeInfo.abilityScore
                    } bonus). You may change your selection below.`;
                  })()}
                />
              )}
            </>
          )}
        </>
      ) : (
        <>
          <CombinationClassSelector
            character={character}
            validCombinations={validCombinations}
            onCombinationChange={handleCombinationClassChange}
          />

          {/* Standard spell selection for built-in combination classes */}
          {showStandardSpellSelection && (
            <>
              <SpellSelector
                character={character}
                availableSpells={availableSpells}
                onSpellChange={handleSpellChange}
                title="Starting Spell"
                description="Your combination class grants you the ability to cast spells. You begin knowing the <strong>Read Magic</strong> spell and one additional first-level spell of your choosing."
                detailsId="combination-spell-selection"
                isLoading={isLoadingSpells}
              />

              {character.settings?.showCantrips !== false && (
                <CantripSelector
                  character={character}
                  onCantripChange={handleCantripChange}
                  mode="creation"
                  title={(() => {
                    const spellTypeInfo = getSpellTypeInfo(character);
                    return `Starting ${spellTypeInfo.capitalized}`;
                  })()}
                  description={(() => {
                    const spellTypeInfo = getSpellTypeInfo(character);
                    return `You automatically know <strong>${
                      character.cantrips?.length || 0
                    }</strong> starting ${spellTypeInfo.type} (rolled 1d4 + ${
                      spellTypeInfo.abilityScore
                    } bonus). You may change your selection below.`;
                  })()}
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
                description="Select all spells your custom combination class should know. Since this is a custom class, you can choose spells from any level and any class. <strong>Read Magic</strong> is automatically granted if you select any spells."
                isLoading={isLoadingAllSpells}
              />

              {character.settings?.showCantrips !== false && (
                <CantripSelector
                  character={character}
                  onCantripChange={handleCantripChange}
                  mode="creation"
                  title={(() => {
                    const spellTypeInfo = getSpellTypeInfo(character);
                    return `Starting ${spellTypeInfo.capitalized}`;
                  })()}
                  description={(() => {
                    const spellTypeInfo = getSpellTypeInfo(character);
                    return `You automatically know <strong>${
                      character.cantrips?.length || 0
                    }</strong> starting ${spellTypeInfo.type} (rolled 1d4 + ${
                      spellTypeInfo.abilityScore
                    } bonus). You may change your selection below.`;
                  })()}
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
