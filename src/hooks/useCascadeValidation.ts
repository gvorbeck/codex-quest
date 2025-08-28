import { useCallback, useEffect, useMemo } from "react";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";
import type { Character, Race, Class } from "@/types/character";
import { cascadeValidateCharacter } from "@/utils/characterValidation";

interface UseCascadeValidationProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
  includeSupplementalRace: boolean;
  includeSupplementalClass: boolean;
  filteredRaces?: Race[];
  filteredClasses?: Class[];
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
  filteredRaces,
  filteredClasses,
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

  // Use provided filtered data or fall back to filtering all data
  const availableRaces = useMemo(
    () =>
      filteredRaces ||
      allRaces.filter(
        (race) => includeSupplementalRace || !race.supplementalContent
      ),
    [filteredRaces, includeSupplementalRace]
  );

  const availableClasses = useMemo(
    () =>
      filteredClasses ||
      allClasses.filter(
        (cls) => includeSupplementalClass || !cls.supplementalContent
      ),
    [filteredClasses, includeSupplementalClass]
  );

  const validateAndUpdateCharacter = useCallback(() => {
    // Get the currently selected race
    const selectedRace = availableRaces.find(
      (race) => race.id === character.race
    );

    // Run cascade validation with available classes
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
  }, [character, onCharacterChange, availableRaces, availableClasses]);

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
    // Include the validation function
    validateAndUpdateCharacter,
  ]);

  // Return a function to manually trigger validation (useful when race changes)
  return {
    validateCharacter: validateAndUpdateCharacter,
  };
}
