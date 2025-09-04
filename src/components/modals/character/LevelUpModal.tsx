import { useMemo, useState, useEffect } from "react";
import { Modal } from "../base";
import { Typography } from "@/components/ui/design-system";
import { useHPGain, useSpellSelection, useLoadingState } from "@/hooks";
import { logger } from "@/utils/logger";
import { LEVEL_UP_CONSTANTS } from "@/constants/levelUp";
import { loadSpellsForClass } from "@/services/dataLoader";
import { isCustomClass, getCustomClass } from "@/utils/characterHelpers";
import CurrentStatusCard from "../../character/sheet/level-up/CurrentStatusCard";
import HPGainPreview from "../../character/sheet/level-up/HPGainPreview";
import LevelUpRequirements from "../../character/sheet/level-up/LevelUpRequirements";
import SpellSelectionSection from "../../character/sheet/level-up/SpellSelectionSection";
import ActionButtons from "../../character/sheet/level-up/ActionButtons";
import { SpellChecklistSelector } from "../../character/creation/SpellChecklistSelector";
import type { Character, Class, Spell } from "@/types/character";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  classes: Class[];
  onLevelUp?: (updatedCharacter: Character) => void;
}

export default function LevelUpModal({
  isOpen,
  onClose,
  character,
  classes,
  onLevelUp,
}: LevelUpModalProps) {
  const { loading: isProcessing, setLoading: setIsProcessing } =
    useLoadingState();
  const [customClassSpells, setCustomClassSpells] = useState<Spell[]>([]);
  const [availableSpellsForCustomClass, setAvailableSpellsForCustomClass] =
    useState<Spell[]>([]);
  const {
    loading: isLoadingCustomSpells,
    setLoading: setIsLoadingCustomSpells,
  } = useLoadingState();

  // Get the character's primary class for level up calculations
  const getPrimaryClass = () => {
    const primaryClassId = character.class[0];
    if (!primaryClassId) return null;

    // Try exact match first, then case-insensitive match for legacy data
    let primaryClass = classes.find((c) => c.id === primaryClassId);

    if (!primaryClass) {
      // Try case-insensitive match (for migrated data)
      primaryClass = classes.find(
        (c) =>
          c.id.toLowerCase() === primaryClassId.toLowerCase() ||
          c.name.toLowerCase() === primaryClassId.toLowerCase()
      );
    }

    return primaryClass;
  };

  const primaryClass = getPrimaryClass();
  const currentLevel = character.level;
  const nextLevel = currentLevel + 1;
  const requiredXP = primaryClass?.experienceTable[nextLevel];

  // For custom classes, always allow level up since we have no way of knowing when they "should" level up
  const primaryClassId = character.class[0];
  const isCustomClassCharacter = Boolean(
    primaryClassId && isCustomClass(primaryClassId) && character.customClasses
  );
  const hasRequiredXP: boolean =
    isCustomClassCharacter ||
    (requiredXP !== undefined && character.xp >= requiredXP);
  const customClass =
    isCustomClassCharacter && primaryClassId
      ? getCustomClass(character, primaryClassId)
      : null;

  // Load spells for custom classes that use magic
  useEffect(() => {
    const loadCustomClassSpells = async () => {
      if (!isCustomClassCharacter || !customClass?.usesSpells || !isOpen)
        return;

      setIsLoadingCustomSpells(true);
      try {
        const spells = await loadSpellsForClass("magic-user"); // Use magic-user spell list as default
        setAvailableSpellsForCustomClass(spells);
        // Initialize custom class spells with current character spells
        setCustomClassSpells(character.spells || []);
      } catch (error) {
        logger.error("Failed to load spells for custom class:", error);
        setAvailableSpellsForCustomClass([]);
      } finally {
        setIsLoadingCustomSpells(false);
      }
    };

    loadCustomClassSpells();
  }, [
    isCustomClassCharacter,
    customClass?.usesSpells,
    isOpen,
    character.spells,
    setIsLoadingCustomSpells,
  ]);

  // Use HP gain hook
  const {
    hpGainResult,
    error: hpError,
    clearError: clearHPError,
  } = useHPGain({
    character,
    primaryClass: primaryClass || null,
    hasRequiredXP,
    isOpen,
    nextLevel,
  });

  // Use spell selection hook
  const {
    spellGainInfo,
    organizedSpells,
    selectedSpells,
    selectedSpellCount,
    isLoadingSpells,
    error: spellError,
    allSpellsSelected,
    handleSpellSelection,
    getSelectedSpellObjects,
    clearError: clearSpellError,
  } = useSpellSelection({
    primaryClass: primaryClass || null,
    hasRequiredXP,
    currentLevel,
    nextLevel,
    character,
  });

  // Check if character can level up
  const canLevelUp = useMemo(() => {
    if (!hasRequiredXP || !hpGainResult) return false;

    // For custom classes, we don't require a primary class object since they don't have experience tables
    if (!isCustomClassCharacter && !primaryClass) return false;

    // For custom classes that use spells, we're always ready (no spell selection restrictions)
    if (isCustomClassCharacter && customClass?.usesSpells) return true;

    // For standard classes or custom classes without spells, check standard spell selection
    return spellGainInfo ? allSpellsSelected : true;
  }, [
    hasRequiredXP,
    isCustomClassCharacter,
    customClass?.usesSpells,
    primaryClass,
    hpGainResult,
    spellGainInfo,
    allSpellsSelected,
  ]);

  const handleLevelUp = async () => {
    if (!canLevelUp || !hpGainResult) return;

    setIsProcessing(true);

    try {
      // Simulate processing time
      await new Promise((resolve) =>
        setTimeout(resolve, LEVEL_UP_CONSTANTS.LEVEL_UP_PROCESSING_DELAY)
      );

      // Prepare new spells if any were selected
      let newSpells: Spell[] = [...(character.spells || [])];

      // Handle custom class spells differently
      if (isCustomClassCharacter && customClass?.usesSpells) {
        // For custom classes, use the spells selected in the SpellChecklistSelector
        newSpells = customClassSpells;
      } else if (spellGainInfo && selectedSpellCount > 0) {
        // For standard classes, add the newly selected spells
        const spellsToAdd = getSelectedSpellObjects();
        newSpells = [...newSpells, ...spellsToAdd];
      }

      // Create updated character with new level, HP, and spells
      const updatedCharacter: Character = {
        ...character,
        level: nextLevel,
        hp: {
          ...character.hp,
          max: character.hp.max + hpGainResult.total,
          current: character.hp.max + hpGainResult.total, // Heal to new max
        },
        ...(newSpells.length > (character.spells?.length || 0) && {
          spells: newSpells,
        }),
      };

      if (onLevelUp) {
        onLevelUp(updatedCharacter);
      }

      onClose();
    } catch (error) {
      logger.error("Level up failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  // Handle errors
  const hasError = hpError || spellError;
  const clearErrors = () => {
    clearHPError();
    clearSpellError();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Level Up ${character.name}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Current Status */}
        <CurrentStatusCard
          character={character}
          currentLevel={currentLevel}
          requiredXP={requiredXP}
          availableClasses={classes}
        />

        {/* Level Up Preview or Requirements */}
        {hasRequiredXP && hpGainResult ? (
          <HPGainPreview
            character={character}
            hpGainResult={hpGainResult}
            nextLevel={nextLevel}
            availableClasses={classes}
          />
        ) : (
          <LevelUpRequirements
            character={character}
            requiredXP={requiredXP}
            nextLevel={nextLevel}
          />
        )}

        {/* Spell Selection */}
        {hasRequiredXP && (
          <>
            {/* Custom class spell selection using SpellChecklistSelector */}
            {isCustomClassCharacter && customClass?.usesSpells && (
              <SpellChecklistSelector
                character={{ ...character, spells: customClassSpells }}
                availableSpells={availableSpellsForCustomClass}
                onSpellsChange={setCustomClassSpells}
                title="Spell Selection"
                description="Select any spells your custom class should know. You can add or remove spells as needed for your character."
                isLoading={isLoadingCustomSpells}
                headerTitle="Level Up Spells"
              />
            )}

            {/* Standard class spell selection */}
            {!isCustomClassCharacter && spellGainInfo && primaryClass && (
              <SpellSelectionSection
                spellGainInfo={spellGainInfo}
                organizedSpells={organizedSpells}
                selectedSpells={selectedSpells}
                selectedSpellCount={selectedSpellCount}
                isLoadingSpells={isLoadingSpells}
                error={spellError}
                nextLevel={nextLevel}
                onSpellSelection={handleSpellSelection}
                onClearError={clearSpellError}
              />
            )}
          </>
        )}

        {/* Error Display */}
        {hasError && (
          <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <Typography variant="body" color="secondary" className="mb-2">
              An error occurred:
            </Typography>
            <Typography variant="helper" color="secondary" className="mb-3">
              {hpError || spellError}
            </Typography>
            <button
              onClick={clearErrors}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <ActionButtons
          canLevelUp={canLevelUp}
          hasRequiredXP={hasRequiredXP}
          isProcessing={isProcessing}
          onClose={handleClose}
          onLevelUp={handleLevelUp}
        />
      </div>
    </Modal>
  );
}
