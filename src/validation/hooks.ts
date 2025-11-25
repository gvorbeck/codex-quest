/**
 * Validation hooks
 * Unified validation hooks replacing useValidation and useCascadeValidation
 */

import { useMemo, useCallback, useEffect } from "react";
import type { ValidationResult, ValidationSchema } from "@/types/validation";
import { validate } from "./core";
import type { Character, Race, Class } from "@/types";
import { allRaces, allClasses } from "@/data";
import { cascadeValidateCharacter } from "@/utils";

/**
 * Enhanced validation hook with type safety and detailed feedback
 * Replaces the original useValidation hook
 */
export function useValidation<T>(
  value: T,
  schema: ValidationSchema<T>
): ValidationResult {
  return useMemo(() => validate(value, schema), [value, schema]);
}

interface UseCascadeValidationProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
  includeSupplementalRace: boolean;
  includeSupplementalClass: boolean;
  filteredRaces?: Race[];
  filteredClasses?: Class[];
}

/**
 * Cascade validation hook
 * Replaces the original useCascadeValidation hook
 */
export function useCascadeValidation({
  character,
  onCharacterChange,
  includeSupplementalRace,
  includeSupplementalClass,
  filteredRaces,
  filteredClasses,
}: UseCascadeValidationProps) {
  // Use stable reference for class to avoid unnecessary effects
  const classString = useMemo(
    () => character.class,
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

    // Only update if the character has actually changed
    const hasChanged =
      validatedCharacter.race !== character.race ||
      validatedCharacter.class !== character.class ||
      validatedCharacter.spells?.length !== character.spells?.length;

    if (hasChanged) {
      onCharacterChange(validatedCharacter);
    }
  }, [character, onCharacterChange, availableRaces, availableClasses]);

  // Run validation whenever character abilities, race, class, or supplemental settings change
  useEffect(() => {
    validateAndUpdateCharacter();
  }, [
    abilityScoresHash,
    character.race,
    classString,
    validateAndUpdateCharacter,
  ]);

  // Return a function to manually trigger validation
  return {
    validateCharacter: validateAndUpdateCharacter,
  };
}
