import { Select } from "@/components/ui/inputs";
import { Card, Typography, Badge } from "@/components/ui/design-system";
import { Icon } from "@/components/ui";
import { LAYOUT_STYLES } from "@/constants";
import type { Character, Spell } from "@/types/character";
import { memo } from "react";

interface SpellSelectorProps {
  character: Character;
  availableSpells: Spell[];
  onSpellChange: (spellName: string) => void;
  title: string;
  description: string;
  detailsId: string;
  isLoading?: boolean;
}

function SpellSelectorComponent({
  character,
  availableSpells,
  onSpellChange,
  title,
  description,
  detailsId,
  isLoading = false,
}: SpellSelectorProps) {
  const spellOptions = availableSpells.map((spell) => ({
    value: spell.name,
    label: spell.name,
  }));

  const selectedSpell =
    character.spells && character.spells.length > 0
      ? character.spells[0]?.name || ""
      : "";

  return (
    <section aria-labelledby={`${detailsId}-heading`} className="mb-8">
      <h4
        id={`${detailsId}-heading`}
        className="text-lg font-semibold text-zinc-100 mb-3"
      >
        {title}
      </h4>
      <div
        className="text-sm text-zinc-400 mb-6"
        dangerouslySetInnerHTML={{ __html: description }}
      />

      <Card variant="standard" className="mb-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lime-400"></div>
            <span className="ml-3 text-zinc-400">Loading spells...</span>
          </div>
        ) : (
          <Select
            label="Choose your starting spell"
            value={selectedSpell}
            onValueChange={onSpellChange}
            options={spellOptions}
            placeholder="Choose a spell"
            required
            aria-describedby={
              selectedSpell ? `${detailsId}-details` : undefined
            }
          />
        )}
      </Card>

      {selectedSpell && character.spells && character.spells.length > 0 && (
        <Card variant="info" id={`${detailsId}-details`}>
          {(() => {
            const spell = character.spells[0];
            if (!spell) return null;
            return (
              <div aria-labelledby={`${detailsId}-info-heading`}>
                <div className={`${LAYOUT_STYLES.iconTextLarge} mb-6`}>
                  <Icon
                    name="star"
                    size="lg"
                    className="flex-shrink-0 text-amber-400"
                    aria-hidden={true}
                  />
                  <Typography
                    variant="infoHeading"
                    id={`${detailsId}-info-heading`}
                  >
                    {spell.name}
                  </Typography>
                  <Badge variant="status">Level 1</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Card variant="nested">
                    <Typography variant="subHeading">
                      <Icon name="map-pin" size="sm" />
                      Range
                    </Typography>
                    <p className="text-amber-50 text-sm m-0">{spell.range}</p>
                  </Card>
                  <Card variant="nested">
                    <Typography variant="subHeading">
                      <Icon name="clock" size="sm" />
                      Duration
                    </Typography>
                    <p className="text-amber-50 text-sm m-0">
                      {spell.duration}
                    </p>
                  </Card>
                </div>

                <Card variant="nested">
                  <Typography variant="subHeadingSpaced">
                    <Icon name="info" size="sm" aria-hidden={true} />
                    Description
                  </Typography>
                  <Typography variant="description">
                    {spell.description}
                  </Typography>
                </Card>
              </div>
            );
          })()}
        </Card>
      )}
    </section>
  );
}

export const SpellSelector = memo(SpellSelectorComponent);
