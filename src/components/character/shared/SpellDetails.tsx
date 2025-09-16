import { Badge, Card, Typography } from "@/components/ui/design-system";
import { TextHeader } from "@/components/ui/display";
import type { Spell, Cantrip } from "@/types";

interface SpellDetailsProps {
  spell: (Spell | Cantrip) & {
    spellLevel?: number;
    uniqueKey?: string;
  };
  showFullDescription?: boolean;
  showAccessibilityLabels?: boolean;
  className?: string;
}

export default function SpellDetails({
  spell,
  showFullDescription = true,
  showAccessibilityLabels = true,
  className = "",
}: SpellDetailsProps) {
  const spellLevel = spell.spellLevel ?? ("level" in spell ? 1 : 0);
  const uniqueKey =
    spell.uniqueKey ?? spell.name.toLowerCase().replace(/\s+/g, "-");
  const hasRangeAndDuration = "range" in spell && "duration" in spell;

  return (
    <div
      className={`space-y-4 ${className}`}
      role="article"
      aria-labelledby={
        showAccessibilityLabels ? `spell-${uniqueKey}-name` : undefined
      }
    >
      {/* Hidden spell name for screen readers */}
      {showAccessibilityLabels && (
        <Typography
          variant="h4"
          as="h4"
          id={`spell-${uniqueKey}-name`}
          className="sr-only"
        >
          {spell.name} -{" "}
          {spellLevel === 0 ? "Cantrip" : `Level ${spellLevel} Spell`}
        </Typography>
      )}

      {/* Spell Details */}
      <div
        className={`grid grid-cols-1 gap-3 ${
          hasRangeAndDuration ? "sm:grid-cols-3" : "sm:grid-cols-1"
        }`}
        role="group"
        aria-labelledby={
          showAccessibilityLabels ? `spell-${uniqueKey}-name` : undefined
        }
      >
        <Card variant="nested" className="p-3!">
          <TextHeader
            variant="h6"
            size="sm"
            underlined={false}
            className="text-zinc-300 mb-1"
            {...(showAccessibilityLabels && {
              id: `spell-${uniqueKey}-level-label`,
            })}
          >
            Level
          </TextHeader>
          <div className="flex items-center">
            <Badge
              variant="status"
              className="text-xs"
              role="text"
              aria-labelledby={
                showAccessibilityLabels
                  ? `spell-${uniqueKey}-level-label`
                  : undefined
              }
            >
              {spellLevel === 0 ? "Cantrip" : `Level ${spellLevel}`}
            </Badge>
          </div>
        </Card>

        {hasRangeAndDuration && (
          <>
            <Card variant="nested" className="p-3!">
              <TextHeader
                variant="h6"
                size="sm"
                underlined={false}
                className="text-zinc-300 mb-1"
                {...(showAccessibilityLabels && {
                  id: `spell-${uniqueKey}-range-label`,
                })}
              >
                Range
              </TextHeader>
              <Typography
                variant="caption"
                className="text-zinc-400"
                aria-labelledby={
                  showAccessibilityLabels
                    ? `spell-${uniqueKey}-range-label`
                    : undefined
                }
              >
                {"range" in spell ? String(spell.range) : ""}
              </Typography>
            </Card>

            <Card variant="nested" className="p-3!">
              <TextHeader
                variant="h6"
                size="sm"
                underlined={false}
                className="text-zinc-300 mb-1"
                {...(showAccessibilityLabels && {
                  id: `spell-${uniqueKey}-duration-label`,
                })}
              >
                Duration
              </TextHeader>
              <Typography
                variant="caption"
                className="text-zinc-400"
                aria-labelledby={
                  showAccessibilityLabels
                    ? `spell-${uniqueKey}-duration-label`
                    : undefined
                }
              >
                {"duration" in spell ? String(spell.duration) : ""}
              </Typography>
            </Card>
          </>
        )}
      </div>

      {/* Spell Description */}
      {showFullDescription && (
        <Card variant="nested" className="p-3">
          <Typography
            variant="subHeading"
            className="text-zinc-300 mb-2"
            id={
              showAccessibilityLabels
                ? `spell-${uniqueKey}-description-label`
                : undefined
            }
          >
            Description
          </Typography>
          <Typography
            variant="description"
            className="text-zinc-400"
            aria-labelledby={
              showAccessibilityLabels
                ? `spell-${uniqueKey}-description-label`
                : undefined
            }
            role="text"
          >
            {spell.description}
          </Typography>
        </Card>
      )}
    </div>
  );
}
