import { useMemo, useCallback } from "react";
import type { CharacterListItem } from "@/services/characters";
import { allClasses } from "@/data/classes";
import { useNotificationContext } from "@/hooks/useNotificationContext";
import { isCustomClass, isCustomRace, getRaceById } from "@/utils/characterHelpers";

export function useCharacterCard(character: CharacterListItem) {
  const { showSuccess, showError } = useNotificationContext();

  // Memoized race name lookup for performance
  const raceName = useMemo(() => {
    if (!character.race) return null;

    // Handle custom races using new helper function
    if (isCustomRace(character.race)) {
      return character.race;
    }

    const race = getRaceById(character.race);
    return race?.name || character.race;
  }, [character.race]);

  // Memoized class names lookup for performance
  const classNames = useMemo(() => {
    if (!character.class) return [];
    const classes = Array.isArray(character.class)
      ? character.class
      : [character.class];
    return classes.map((classId) => {
      // Handle custom classes
      if (isCustomClass(classId)) {
        return {
          id: classId,
          name: classId || "Custom Class",
        };
      }

      const classData = allClasses.find((cls) => cls.id === classId);
      return { id: classId, name: classData?.name || classId };
    });
  }, [character.class]);

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
