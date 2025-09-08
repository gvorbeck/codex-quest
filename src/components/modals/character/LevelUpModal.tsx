import { useMemo } from "react";
import { Modal } from "../base";
import { Typography } from "@/components/ui/design-system";
import { useHPGain, useLoadingState } from "@/hooks";
import { logger } from "@/utils/logger";
import { LEVEL_UP_CONSTANTS } from "@/constants/levelUp";
import { isCustomClass } from "@/utils/characterHelpers";
import CurrentStatusCard from "../../character/sheet/level-up/CurrentStatusCard";
import HPGainPreview from "../../character/sheet/level-up/HPGainPreview";
import LevelUpRequirements from "../../character/sheet/level-up/LevelUpRequirements";
import ActionButtons from "../../character/sheet/level-up/ActionButtons";
import type { Character, Class } from "@/types/character";

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

  // Check if character can level up
  const canLevelUp = useMemo(() => {
    if (!hasRequiredXP || !hpGainResult) return false;

    // For custom classes, we don't require a primary class object since they don't have experience tables
    if (!isCustomClassCharacter && !primaryClass) return false;

    return true;
  }, [
    hasRequiredXP,
    isCustomClassCharacter,
    primaryClass,
    hpGainResult,
  ]);

  const handleLevelUp = async () => {
    if (!canLevelUp || !hpGainResult) return;

    setIsProcessing(true);

    try {
      // Simulate processing time
      await new Promise((resolve) =>
        setTimeout(resolve, LEVEL_UP_CONSTANTS.LEVEL_UP_PROCESSING_DELAY)
      );

      // Create updated character with new level and HP (no spell changes)
      const updatedCharacter: Character = {
        ...character,
        level: nextLevel,
        hp: {
          ...character.hp,
          max: character.hp.max + hpGainResult.total,
          current: character.hp.max + hpGainResult.total, // Heal to new max
        },
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
  const hasError = hpError;
  const clearErrors = () => {
    clearHPError();
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


        {/* Error Display */}
        {hasError && (
          <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <Typography variant="body" color="secondary" className="mb-2">
              An error occurred:
            </Typography>
            <Typography variant="helper" color="secondary" className="mb-3">
              {hpError}
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
