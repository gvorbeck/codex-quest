import { useState, useMemo } from "react";
import { Modal } from "@/components/ui/feedback";
import { Typography } from "@/components/ui/design-system";
import { useHPGain, useSpellSelection } from "@/hooks";
import { logger } from "@/utils/logger";
import { LEVEL_UP_CONSTANTS } from "@/constants/levelUp";
import CurrentStatusCard from "./level-up/CurrentStatusCard";
import HPGainPreview from "./level-up/HPGainPreview";
import LevelUpRequirements from "./level-up/LevelUpRequirements";
import SpellSelectionSection from "./level-up/SpellSelectionSection";
import ActionButtons from "./level-up/ActionButtons";
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
  const [isProcessing, setIsProcessing] = useState(false);

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
  const hasRequiredXP = requiredXP !== undefined && character.xp >= requiredXP;

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
  });

  // Check if character can level up
  const canLevelUp = useMemo(() => {
    if (!hasRequiredXP || !primaryClass || !hpGainResult) return false;
    return spellGainInfo ? allSpellsSelected : true;
  }, [
    hasRequiredXP,
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
      if (spellGainInfo && selectedSpellCount > 0) {
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
          primaryClass={primaryClass || null}
          currentLevel={currentLevel}
          requiredXP={requiredXP}
        />

        {/* Level Up Preview or Requirements */}
        {hasRequiredXP && primaryClass && hpGainResult ? (
          <HPGainPreview
            character={character}
            primaryClass={primaryClass}
            hpGainResult={hpGainResult}
            nextLevel={nextLevel}
          />
        ) : (
          <LevelUpRequirements
            character={character}
            requiredXP={requiredXP}
            nextLevel={nextLevel}
          />
        )}

        {/* Spell Selection */}
        {spellGainInfo && hasRequiredXP && primaryClass && (
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
