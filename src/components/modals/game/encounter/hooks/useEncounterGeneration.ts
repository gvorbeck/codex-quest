import { useState, useCallback } from "react";
import { useNotifications } from "@/hooks";
import {
  getRandomTableResult,
  rollForEncounter,
  delay,
  createCombatantFromEncounter,
  logger,
} from "@/utils";
import type { GameCombatant } from "@/types";
import { ENCOUNTER_CONSTANTS } from "@/constants";

interface UseEncounterGenerationProps {
  currentTable: readonly string[];
  onAddToCombat: ((combatant: GameCombatant) => void) | undefined;
  onOpenCombatTracker: (() => void) | undefined;
}

export function useEncounterGeneration({
  currentTable,
  onAddToCombat,
  onOpenCombatTracker,
}: UseEncounterGenerationProps) {
  const [currentEncounter, setCurrentEncounter] = useState<string | null>(null);
  const [encounterOccurs, setEncounterOccurs] = useState<boolean | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { showSuccess, showError, showInfo } = useNotifications();

  // Function to add encounter to combat tracker
  const handleAddToCombatTracker = useCallback(() => {
    if (!currentEncounter || !onAddToCombat) return;

    const combatant = createCombatantFromEncounter(currentEncounter);
    onAddToCombat(combatant);

    showSuccess(`${combatant.name} added to Combat Tracker`, {
      title: "Added to Combat",
      duration: 3000,
    });

    // Optionally open the combat tracker
    if (onOpenCombatTracker) {
      setTimeout(() => {
        onOpenCombatTracker();
      }, 500); // Small delay to let the user see the success notification
    }
  }, [currentEncounter, onAddToCombat, onOpenCombatTracker, showSuccess]);

  const generateEncounter = useCallback(async () => {
    if (!currentTable.length) {
      showError("No encounter table available for the selected type.", {
        title: "Generation Error",
      });
      return;
    }

    setIsGenerating(true);
    setCurrentEncounter(null);
    setEncounterOccurs(null);

    try {
      // Simulate rolling for encounter occurrence
      await delay(ENCOUNTER_CONSTANTS.GENERATION_DELAY);

      // Roll 1d6 for encounter check (1 = encounter occurs)
      const encounterHappens = rollForEncounter();

      setEncounterOccurs(encounterHappens);

      if (encounterHappens) {
        // Get a random encounter from the table
        const encounter = getRandomTableResult(currentTable);

        // Add a small delay for UX
        await delay(ENCOUNTER_CONSTANTS.RESULT_DELAY);
        if (encounter) {
          setCurrentEncounter(encounter);
          showSuccess(`Encounter generated: ${encounter}`, {
            title: "Encounter!",
            duration: 5000,
          });
        } else {
          showError("Failed to select encounter from table.", {
            title: "Generation Error",
          });
        }
      } else {
        showInfo("No encounter occurs this time.", {
          title: "Peaceful Travel",
          duration: 3000,
        });
      }
    } catch (error) {
      logger.error("Error generating encounter:", error);
      showError(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while generating the encounter.",
        {
          title: "Generation Failed",
          dismissible: true,
        }
      );
      // Reset states on error
      setEncounterOccurs(null);
      setCurrentEncounter(null);
    } finally {
      setIsGenerating(false);
    }
  }, [currentTable, showSuccess, showError, showInfo]);

  const resetEncounter = useCallback(() => {
    setCurrentEncounter(null);
    setEncounterOccurs(null);
  }, []);

  return {
    currentEncounter,
    encounterOccurs,
    isGenerating,
    generateEncounter,
    handleAddToCombatTracker,
    resetEncounter,
  };
}
