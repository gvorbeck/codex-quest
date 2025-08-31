import { Typography, Badge } from "@/components/ui";
import { BaseCard } from "@/components/ui/display";
import type { CharacterListItem } from "@/services/characters";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";
import { useMemo } from "react";
import { useNotificationContext } from "@/hooks/useNotificationContext";

interface CharacterCardProps {
  character: CharacterListItem;
  user: { uid: string } | null;
  onDelete: (characterId: string, characterName: string) => void;
  isDeleting?: boolean;
}

export function CharacterCard({
  character,
  user,
  onDelete,
  isDeleting,
}: CharacterCardProps) {
  const { showSuccess, showError } = useNotificationContext();

  // Memoized race name lookup for performance
  const raceName = useMemo(() => {
    if (!character.race) return null;
    const race = allRaces.find((r) => r.id === character.race);
    return race?.name || character.race;
  }, [character.race]);

  // Memoized class names lookup for performance
  const classNames = useMemo(() => {
    if (!character.class) return [];
    const classes = Array.isArray(character.class)
      ? character.class
      : [character.class];
    return classes.map((classId) => {
      const classData = allClasses.find((cls) => cls.id === classId);
      return { id: classId, name: classData?.name || classId };
    });
  }, [character.class]);

  const href = `/u/${user?.uid}/c/${character.id}`;

  const handleCopyUrl = async (url: string, characterName: string) => {
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
  };

  return (
    <BaseCard
      id={character.id}
      name={character.name}
      user={user}
      href={href}
      onDelete={onDelete}
      onCopy={handleCopyUrl}
      isDeleting={isDeleting || false}
    >
      {/* Character Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <Typography
            variant="h4"
            className="text-zinc-100 group-hover:text-amber-300 transition-colors duration-300 truncate font-bold tracking-wide"
          >
            {character.name}
          </Typography>
          {character.level && (
            <Typography
              variant="caption"
              className="text-amber-400 font-medium mt-1"
            >
              Level {character.level}
            </Typography>
          )}
        </div>
      </div>

      {/* Character Race/Class Info */}
      {raceName && classNames.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <Typography
              variant="helper"
              className="text-zinc-400 uppercase tracking-wider font-medium text-xs"
            >
              Race & Class
            </Typography>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="primary"
              size="md"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-900 font-semibold shadow-lg"
            >
              {raceName}
            </Badge>
            {classNames.map((classItem) => (
              <Badge
                key={classItem.id}
                variant="secondary"
                size="md"
                className="bg-zinc-700 text-zinc-200 border border-zinc-600 font-medium hover:bg-zinc-600 transition-colors"
              >
                {classItem.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Character Stats/Info (if available) */}
      {(character.hp || character.xp !== undefined) && (
        <div className="grid grid-cols-2 gap-3 pt-2">
          {character.hp && (
            <div className="text-center p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <Typography
                variant="caption"
                className="text-zinc-400 uppercase tracking-wide text-xs"
              >
                Health
              </Typography>
              <Typography variant="body" className="text-zinc-200 font-bold">
                {typeof character.hp === "object" && character.hp.max
                  ? `${character.hp.current || 0}/${character.hp.max}`
                  : String(character.hp)}
              </Typography>
            </div>
          )}
          {character.xp !== undefined && (
            <div className="text-center p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <Typography
                variant="caption"
                className="text-zinc-400 uppercase tracking-wide text-xs"
              >
                Experience
              </Typography>
              <Typography variant="body" className="text-zinc-200 font-bold">
                {character.xp.toLocaleString()}
              </Typography>
            </div>
          )}
        </div>
      )}
    </BaseCard>
  );
}
