import { memo } from "react";
import { Card, Typography, Badge } from "@/components/ui/design-system";
import { StatCard } from "@/components/ui/display";
import type { Spell } from "@/types/character";

interface SpellItemProps {
  spell: Spell;
}

export const SpellItem = memo(({ spell }: SpellItemProps) => {
  const uniqueKey = `spell-${spell.name.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div
      className="space-y-4"
      role="article"
      aria-labelledby={`${uniqueKey}-name`}
    >
      {/* Spell name */}
      <Typography
        variant="h4"
        as="h4"
        id={`${uniqueKey}-name`}
        className="text-zinc-100 text-lg font-semibold border-b border-zinc-700 pb-2 mb-4"
      >
        {spell.name}
      </Typography>

      {/* Spell Properties */}
      <Card variant="nested" className="p-3">
        <Typography
          variant="subHeading"
          className="text-zinc-300 mb-3"
        >
          Spell Properties
        </Typography>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            label="Range"
            value={spell.range}
            size="sm"
          />

          <StatCard
            label="Duration"
            value={spell.duration}
            size="sm"
          />

          <div className="text-center">
            <Typography
              variant="caption"
              className="text-zinc-400 mb-2 block"
              id={`${uniqueKey}-classes-label`}
            >
              Classes & Levels
            </Typography>
            <div className="flex flex-wrap gap-1 justify-center">
              {Object.entries(spell.level).map(([classId, level]) => 
                level !== null ? (
                  <Badge 
                    key={classId} 
                    variant="status"
                    size="sm"
                    className="text-xs"
                  >
                    {classId.replace('-', ' ')}: {level}
                  </Badge>
                ) : null
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Spell Description */}
      <Card variant="nested" className="p-3">
        <Typography
          variant="subHeading"
          className="text-zinc-300 mb-2"
          id={`${uniqueKey}-description-label`}
        >
          Description
        </Typography>
        <Typography
          variant="description"
          className="text-zinc-400 leading-relaxed"
          aria-labelledby={`${uniqueKey}-description-label`}
          role="text"
        >
          {spell.description}
        </Typography>
      </Card>
    </div>
  );
});

SpellItem.displayName = "SpellItem";