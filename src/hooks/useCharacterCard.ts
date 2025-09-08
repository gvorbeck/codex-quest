import { useMemo, useCallback } from "react";
import type { CharacterListItem } from "@/services/characters";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";
import { useNotificationContext } from "@/hooks/useNotificationContext";

export function useCharacterCard(character: CharacterListItem) {
  const { showSuccess, showError } = useNotificationContext();

  // Memoized race name lookup for performance
  const raceName = useMemo(() => {
    if (!character.race) return null;

    // Handle custom races
    if (character.race === "custom") {
      return character.customRace?.name || "Custom Race";
    }

    const race = allRaces.find((r) => r.id === character.race);
    return race?.name || character.race;
  }, [character.race, character.customRace]);

  // Memoized class names lookup for performance
  const classNames = useMemo(() => {
    if (!character.class) return [];
    const classes = Array.isArray(character.class)
      ? character.class
      : [character.class];
    return classes.map((classId) => {
      // Handle custom classes
      if (classId.startsWith("custom-") && character.customClasses) {
        const customClass = character.customClasses[classId];
        return { id: classId, name: customClass?.name || "Custom Class" };
      }

      const classData = allClasses.find((cls) => cls.id === classId);
      return { id: classId, name: classData?.name || classId };
    });
  }, [character.class, character.customClasses]);

  const handleCopyUrl = useCallback(
    async (url: string, characterName: string) => {
      try {
        await navigator.clipboard.writeText(url);
        showSuccess(`Character sheet URL copied for ${characterName}`, {
          duration: 3000,
        });
      } catch {
        showError("Failed to copy URL to clipboard", {
          duration: 5000,
        });
      }
    },
    [showSuccess, showError]
  );

  return {
    raceName,
    classNames,
    handleCopyUrl,
  };
}