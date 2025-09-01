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
      <Typography
        variant="sectionHeading"
        as="h4"
        id={`${detailsId}-heading`}
        color="zinc"
        className="mb-3"
      >
        {title}
      </Typography>
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
          <>
            <Select
              label="Choose your starting spell"
              value={selectedSpell}
              onValueChange={onSpellChange}
              options={spellOptions}
              placeholder="Choose a spell"
              required
              aria-describedby={
                selectedSpell
                  ? `${detailsId}-details ${detailsId}-spell-help`
                  : `${detailsId}-spell-help`
              }
              helperText="This spell will be available to cast once per day at 1st level"
            />

            {/* Hidden helper text for screen readers */}
            <div id={`${detailsId}-spell-help`} className="sr-only">
              Your starting spell depends on your class and intelligence
              modifier. This spell can be cast once per day and will be added to
              your spellbook.
            </div>
          </>
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
                      <Icon name="map-pin" size="sm" aria-hidden={true} />
                      Range
                    </Typography>
                    <Typography
                      variant="helper"
                      color="primary"
                      aria-label={`Spell range: ${spell.range}. This determines how far you can cast the spell from your location.`}
                    >
                      {spell.range}
                    </Typography>
                  </Card>
                  <Card variant="nested">
                    <Typography variant="subHeading">
                      <Icon name="clock" size="sm" aria-hidden={true} />
                      Duration
                    </Typography>
                    <Typography
                      variant="helper"
                      color="primary"
                      aria-label={`Spell duration: ${spell.duration}. This is how long the spell's effects last.`}
                    >
                      {spell.duration}
                    </Typography>
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
