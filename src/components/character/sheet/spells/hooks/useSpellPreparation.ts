import { useCallback, useMemo } from "react";
import type { Character, Spell } from "@/types";

interface UseSpellPreparationProps {
  character: Character | undefined;
  onCharacterChange: ((character: Character) => void) | undefined;
  availableSpells: Record<number, Spell[]>;
}

interface UseSpellPreparationResult {
  preparedSpells: Spell[];
  handleSpellPreparation: (
    slotLevel: number,
    slotIndex: number,
    spellName: string
  ) => void;
  clearSpellPreparation: (slotLevel: number, slotIndex: number) => void;
  getPreparedSpellForSlot: (
    slotLevel: number,
    slotIndex: number
  ) => Spell | null;
}

export function useSpellPreparation({
  character,
  onCharacterChange,
  availableSpells,
}: UseSpellPreparationProps): UseSpellPreparationResult {
  // Get prepared spells (those with preparation metadata)
  const preparedSpells = useMemo(() => {
    if (!character?.spells) return [];
    return character.spells.filter((spell) => spell.preparation);
  }, [character?.spells]);

  const handleSpellPreparation = useCallback(
    (slotLevel: number, slotIndex: number, spellName: string) => {
      if (!character || !onCharacterChange) return;

      const selectedSpell = availableSpells[slotLevel]?.find(
        (spell) => spell.name === spellName
      );
      if (!selectedSpell) return;

      const currentSpells = character.spells || [];

      // Remove any existing spell prepared in this slot
      const filteredSpells = currentSpells.filter(
        (spell) =>
          !(
            spell.preparation?.slotLevel === slotLevel &&
            spell.preparation?.slotIndex === slotIndex
          )
      );

      // Add the new prepared spell
      const newPreparedSpell: Spell = {
        ...selectedSpell,
        preparation: {
          slotLevel,
          slotIndex,
        },
      };

      onCharacterChange({
        ...character,
        spells: [...filteredSpells, newPreparedSpell],
      });
    },
    [character, onCharacterChange, availableSpells]
  );

  const clearSpellPreparation = useCallback(
    (slotLevel: number, slotIndex: number) => {
      if (!character || !onCharacterChange) return;

      const currentSpells = character.spells || [];
      const filteredSpells = currentSpells.filter(
        (spell) =>
          !(
            spell.preparation?.slotLevel === slotLevel &&
            spell.preparation?.slotIndex === slotIndex
          )
      );

      onCharacterChange({
        ...character,
        spells: filteredSpells,
      });
    },
    [character, onCharacterChange]
  );

  const getPreparedSpellForSlot = useCallback(
    (slotLevel: number, slotIndex: number): Spell | null => {
      return (
        preparedSpells.find(
          (spell) =>
            spell.preparation?.slotLevel === slotLevel &&
            spell.preparation?.slotIndex === slotIndex
        ) || null
      );
    },
    [preparedSpells]
  );

  return {
    preparedSpells,
    handleSpellPreparation,
    clearSpellPreparation,
    getPreparedSpellForSlot,
  };
}
