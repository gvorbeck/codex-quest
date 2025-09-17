import { useCallback } from "react";
import { Modal } from "@/components/modals";
import EncounterTypeSelector from "../encounters/EncounterTypeSelector";
import EncounterSubtypeSelector from "../encounters/EncounterSubtypeSelector";
import EncounterRules from "../encounters/EncounterRules";
import EncounterGeneratorButton from "../encounters/EncounterGeneratorButton";
import EncounterResults from "../encounters/EncounterResults";
import EncounterInstructions from "../encounters/EncounterInstructions";
import { useEncounterData } from "../encounters/hooks/useEncounterData";
import { useEncounterGeneration } from "../encounters/hooks/useEncounterGeneration";
import type { GameCombatant } from "@/types";

interface EncounterGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCombat?: (combatant: GameCombatant) => void;
  onOpenCombatTracker?: () => void;
}

/**
 * EncounterGeneratorModal - Generate random encounters based on BFRPG rules
 *
 * Features:
 * - Dungeon encounters (levels 1-8+)
 * - Wilderness encounters (Desert/Barren, Grassland, Inhabited Territories, Jungle, Mountains/Hills, Ocean, River/Riverside, Swamp, Woods/Forest)
 * - City/Town/Village encounters (Day and Night)
 * - Proper encounter frequency rules (1 in 6 for dungeons, 1 in 6 for wilderness)
 */

export default function EncounterGeneratorModal({
  isOpen,
  onClose,
  onAddToCombat,
  onOpenCombatTracker,
}: EncounterGeneratorModalProps) {
  // Use custom hooks for data management and generation logic
  const {
    encounterType,
    dungeonLevel,
    wildernessType,
    cityType,
    currentTable,
    handleTypeChange,
    setDungeonLevel,
    setWildernessType,
    setCityType,
  } = useEncounterData();

  const {
    currentEncounter,
    encounterOccurs,
    isGenerating,
    generateEncounter,
    handleAddToCombatTracker,
    resetEncounter,
  } = useEncounterGeneration({
    currentTable,
    onAddToCombat: onAddToCombat || undefined,
    onOpenCombatTracker: onOpenCombatTracker || undefined,
  });

  // Reset encounter when type changes
  const handleTypeChangeWithReset = useCallback(
    (type: typeof encounterType) => {
      handleTypeChange(type);
      resetEncounter();
    },
    [handleTypeChange, resetEncounter]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Random Encounter Generator"
      size="md"
    >
      <div className="space-y-6 p-2">
        {/* Encounter Type Selection */}
        <EncounterTypeSelector
          selectedType={encounterType}
          onTypeChange={handleTypeChangeWithReset}
        />

        {/* Encounter Subtype Selection */}
        <EncounterSubtypeSelector
          encounterType={encounterType}
          dungeonLevel={dungeonLevel}
          wildernessType={wildernessType}
          cityType={cityType}
          onDungeonLevelChange={setDungeonLevel}
          onWildernessTypeChange={setWildernessType}
          onCityTypeChange={setCityType}
        />

        {/* Encounter Rules */}
        <EncounterRules encounterType={encounterType} />

        {/* Generate Button */}
        <EncounterGeneratorButton
          encounterType={encounterType}
          isGenerating={isGenerating}
          hasTable={currentTable.length > 0}
          onGenerate={generateEncounter}
        />

        {/* Results */}
        <EncounterResults
          encounterOccurs={encounterOccurs}
          currentEncounter={currentEncounter}
          onAddToCombat={onAddToCombat ? handleAddToCombatTracker : undefined}
          isGenerating={isGenerating}
        />

        {/* Instructions */}
        <EncounterInstructions />
      </div>
    </Modal>
  );
}
