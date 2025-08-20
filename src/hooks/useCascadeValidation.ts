import { useCallback, useEffect } from "react";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";
import type { Character } from "@/types/character";
import { cascadeValidateCharacter } from "@/utils/characterValidation";

interface UseCascadeValidationProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
  includeSupplementalRace: boolean;
  includeSupplementalClass: boolean;
}

/**
 * Custom hook that handles cascade validation for character creation
 * Automatically clears invalid selections when prerequisites change
 */
export function useCascadeValidation({
  character,
  onCharacterChange,
  includeSupplementalRace,
  includeSupplementalClass,
}: UseCascadeValidationProps) {
  // Extract class array to string for dependency tracking
  const classArrayString = character.class.join(",");

  const validateAndUpdateCharacter = useCallback(() => {
    // Get the currently selected race
    const selectedRace = allRaces.find((race) => race.id === character.race);

    // Filter available classes based on supplemental content setting
    const availableClasses = allClasses.filter(
      (cls) => includeSupplementalClass || !cls.supplementalContent
    );

    // Run cascade validation
    const validatedCharacter = cascadeValidateCharacter(
      character,
      selectedRace,
      availableClasses
    );

    // Only update if the character has changed
    if (JSON.stringify(validatedCharacter) !== JSON.stringify(character)) {
      onCharacterChange(validatedCharacter);
    }
  }, [character, onCharacterChange, includeSupplementalClass]);

  // Run validation whenever character abilities, race, class, or supplemental settings change
  useEffect(() => {
    validateAndUpdateCharacter();
  }, [
    // Watch for ability score changes
    character.abilities.strength.value,
    character.abilities.dexterity.value,
    character.abilities.constitution.value,
    character.abilities.intelligence.value,
    character.abilities.wisdom.value,
    character.abilities.charisma.value,
    // Watch for race changes (to clear invalid class selections)
    character.race,
    // Watch for class changes (to clear invalid spells)
    classArrayString, // Watch the class array as string
    // Watch for supplemental content changes
    includeSupplementalRace,
    includeSupplementalClass,
    // Include the validation function
    validateAndUpdateCharacter,
  ]);

  // Return a function to manually trigger validation (useful when race changes)
  return {
    validateCharacter: validateAndUpdateCharacter,
  };
}
