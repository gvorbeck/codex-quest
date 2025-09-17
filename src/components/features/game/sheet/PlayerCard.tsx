import { memo, useMemo } from "react";
import type { GamePlayer } from "@/types";
import { GAME_SHEET_STYLES } from "@/constants";
import { Icon } from "@/components/ui/core/display";
import { Typography, Card, Badge } from "@/components/ui/core/display";
import { Button } from "@/components/ui/core/primitives";
import { allRaces } from "@/data";
import { getClassById, getImportantAbilities } from "@/utils";
import { ABILITY_BADGE_VARIANTS } from "@/constants";
import { truncateText } from "@/utils";
import type { SpecialAbility } from "@/types";

interface PlayerCardProps {
  player: GamePlayer;
  getResolvedData: (
    userId: string,
    characterId: string
  ) =>
    | {
        characterName?: string | undefined;
        avatar?: string | undefined;
        race?: string | undefined;
        class?: string[] | undefined;
        level?: number | undefined;
      }
    | undefined;
  onDelete?: (player: GamePlayer) => void;
}

export const PlayerCard = memo(
  ({ player, getResolvedData, onDelete }: PlayerCardProps) => {
    // Generate initials for avatar fallback
    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    // Get resolved data from the resolver hook
    const resolved = getResolvedData(player.user, player.character);

    // Use resolved names if available, fallback to IDs
    const characterName = resolved?.characterName || player.character;
    const avatar = resolved?.avatar;
    const characterRace = resolved?.race;
    const characterLevel = resolved?.level;

    // Character sheet URL
    const characterSheetUrl = `/u/${player.user}/c/${player.character}`;

    // Get special abilities from race and classes
    const specialAbilities = useMemo(() => {
      const abilities: Array<{
        name: string;
        source: "race" | "class";
        effects?: SpecialAbility["effects"];
      }> = [];

      const currentClasses = resolved?.class || [];

      // Add race abilities
      if (characterRace) {
        const race = allRaces.find((r) => r.id === characterRace);
        if (race) {
          race.specialAbilities.forEach((ability) => {
            abilities.push({
              name: ability.name,
              source: "race",
              effects: ability.effects,
            });
          });
        }
      }

      // Add class abilities
      currentClasses.forEach((classId) => {
        const characterClass = getClassById(classId);
        if (characterClass) {
          characterClass.specialAbilities.forEach((ability) => {
            abilities.push({
              name: ability.name,
              source: "class",
              effects: ability.effects,
            });
          });
        }
      });

      return abilities;
    }, [characterRace, resolved?.class]);

    // Filter for key abilities to display as badges
    const importantAbilities = useMemo(() => {
      return getImportantAbilities(specialAbilities);
    }, [specialAbilities]);

    return (
      <Card
        variant="standard"
        size="compact"
        className="relative h-full flex flex-col"
      >
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                className="w-12 h-12 rounded-full object-cover border-2 border-zinc-600 flex-shrink-0"
                loading="lazy"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full bg-zinc-700 border-2 border-zinc-600 flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <span className="text-zinc-300 font-bold text-sm">
                  {getInitials(characterName)}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <Typography
                variant="bodySmall"
                weight="medium"
                as="h3"
                className={`${GAME_SHEET_STYLES.colors.text.primary} truncate mb-1`}
              >
                {characterName}
              </Typography>

              {/* Character Level and Race/Class info */}
              {(characterLevel || characterRace || resolved?.class?.length) && (
                <div className="text-xs text-zinc-400 mb-2">
                  {characterLevel && `Level ${characterLevel} `}
                  {characterRace && (
                    <span className="capitalize">{characterRace}</span>
                  )}
                  {resolved?.class && resolved.class.length > 0 && (
                    <span className="capitalize">
                      {characterRace ? " " : ""}
                      {resolved.class.join("/")}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Special Abilities Badges */}
          {importantAbilities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {importantAbilities.map((ability, index) => {
                let variant:
                  | "status"
                  | "supplemental"
                  | "primary"
                  | "secondary"
                  | "warning"
                  | "danger"
                  | "success" = "secondary";
                let displayText = ability.name;

                // Special formatting for darkvision with range
                if (ability.effects?.darkvision) {
                  displayText = `DV ${ability.effects.darkvision.range}'`;
                  variant = "primary";
                } else {
                  const abilityName = ability.name.toLowerCase();

                  // Use mapping for common abilities, fall back to source-based variants
                  const mappedVariant = Object.entries(
                    ABILITY_BADGE_VARIANTS
                  ).find(([key]) => abilityName.includes(key))?.[1];

                  if (mappedVariant) {
                    variant = mappedVariant;
                  } else if (ability.source === "race") {
                    variant = "supplemental";
                  } else if (ability.source === "class") {
                    variant = "status";
                  }

                  // Truncate long ability names
                  displayText = truncateText(displayText, 12);
                }

                return (
                  <Badge
                    key={`${ability.name}-${index}`}
                    variant={variant}
                    size="sm"
                    title={`${ability.name} (${ability.source})`}
                  >
                    {displayText}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons - Always at bottom */}
        <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-zinc-700/50">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-700/50 transition-colors duration-200"
            title={`View ${characterName}'s character sheet`}
            aria-label={`View ${characterName}'s character sheet`}
            onClick={() => window.open(characterSheetUrl, "_blank")}
          >
            <Icon name="eye" size="sm" aria-hidden={true} />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-700/50 transition-colors duration-200"
              title={`Remove ${characterName} from game`}
              aria-label={`Remove ${characterName} from game`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(player);
              }}
            >
              <Icon name="trash" size="sm" aria-hidden={true} />
            </Button>
          )}
        </div>
      </Card>
    );
  }
);

PlayerCard.displayName = "PlayerCard";
