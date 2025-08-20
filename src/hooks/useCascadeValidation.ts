import { useCallback, useEffect, useMemo } from "react";
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
  // Use stable string for class array to avoid unnecessary effects
  const classArrayString = useMemo(
    () => character.class.join(","),
    [character.class]
  );

  // Memoize ability scores hash to reduce unnecessary validations
  const abilityScoresHash = useMemo(() => {
    const abilities = character.abilities;
    return `${abilities.strength.value}-${abilities.dexterity.value}-${abilities.constitution.value}-${abilities.intelligence.value}-${abilities.wisdom.value}-${abilities.charisma.value}`;
  }, [character.abilities]);

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

    // Only update if the character has actually changed (more efficient comparison)
    const hasChanged =
      validatedCharacter.race !== character.race ||
      validatedCharacter.class.join(",") !== character.class.join(",") ||
      validatedCharacter.spells?.length !== character.spells?.length;

    if (hasChanged) {
      onCharacterChange(validatedCharacter);
    }
  }, [character, onCharacterChange, includeSupplementalClass]);

  // Run validation whenever character abilities, race, class, or supplemental settings change
  useEffect(() => {
    validateAndUpdateCharacter();
  }, [
    // Use computed hashes instead of individual ability scores
    abilityScoresHash,
    // Watch for race changes (to clear invalid class selections)
    character.race,
    // Watch for class changes (to clear invalid spells)
    classArrayString,
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
