import { Typography, Badge } from "@/components/ui";
import { BaseCard } from "@/components/ui/display";
import type { CharacterListItem } from "@/services/characters";
import { memo } from "react";
import { useCharacterCard } from "@/hooks/useCharacterCard";

interface CharacterCardProps {
  character: CharacterListItem;
  user: { uid: string } | null;
  onDelete: (characterId: string, characterName: string) => void;
  isDeleting?: boolean;
}

const CharacterCard = memo(function CharacterCard({
  character,
  user,
  onDelete,
  isDeleting,
}: CharacterCardProps) {
  const { raceName, classNames, handleCopyUrl } = useCharacterCard(character);
  const href = `/u/${user?.uid}/c/${character.id}`;

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
            className="text-zinc-100 group-hover:text-amber-300 transition-colors duration-300 truncate font-bold tracking-wide text-lg sm:text-xl"
          >
            {character.name}
          </Typography>
          {character.level && (
            <Typography
              variant="caption"
              className="text-amber-400 font-medium mt-1 text-sm"
            >
              Level {character.level}
            </Typography>
          )}
        </div>
      </div>

      {/* Character Race/Class Info */}
      {raceName && classNames.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
            <Typography
              variant="helper"
              className="text-zinc-400 uppercase tracking-wider font-medium text-xs"
            >
              Race & Class
            </Typography>
          </div>
          <div className="space-y-1.5 sm:space-y-0 sm:flex sm:items-center sm:gap-2 sm:flex-wrap">
            <Badge
              variant="primary"
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-900 font-semibold shadow-lg text-xs sm:text-sm w-fit"
            >
              {raceName}
            </Badge>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {classNames.map((classItem) => (
                <Badge
                  key={classItem.id}
                  variant="secondary"
                  size="sm"
                  className="bg-zinc-700 text-zinc-200 border border-zinc-600 font-medium hover:bg-zinc-600 transition-colors text-xs sm:text-sm w-fit"
                >
                  {classItem.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Character Stats/Info (if available) */}
      {(character.hp || character.xp !== undefined) && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
          {character.hp && (
            <div className="text-center p-2 sm:p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 min-w-0">
              <Typography
                variant="caption"
                className="text-zinc-400 uppercase tracking-wide text-xs block"
              >
                Health
              </Typography>
              <Typography
                variant="body"
                className="text-zinc-200 font-bold text-sm sm:text-base truncate"
              >
                {typeof character.hp === "object" && character.hp.max
                  ? `${character.hp.current || 0}/${character.hp.max}`
                  : String(character.hp)}
              </Typography>
            </div>
          )}
          {character.xp !== undefined && (
            <div className="text-center p-2 sm:p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 min-w-0">
              <Typography
                variant="caption"
                className="text-zinc-400 uppercase tracking-wide text-xs block"
              >
                XP
              </Typography>
              <Typography
                variant="body"
                className="text-zinc-200 font-bold text-sm sm:text-base truncate"
              >
                {character.xp.toLocaleString()}
              </Typography>
            </div>
          )}
        </div>
      )}
    </BaseCard>
  );
});

export { CharacterCard };
