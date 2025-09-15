import { Select } from "@/components/ui/inputs";
import { Card, Typography, Badge } from "@/components/ui/design-system";
import { Icon } from "@/components/ui";
import { MarkdownText } from "@/components/ui/display";
import { LoadingState } from "@/components/ui/feedback";
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

  const renderSpellDetails = (spell: Spell) => (
    <div aria-labelledby={`${detailsId}-info-heading`}>
      <Typography
        variant="infoHeading"
        className={`${LAYOUT_STYLES.iconText} mb-6`}
        id={`${detailsId}-info-heading`}
      >
        <Icon
          name="star"
          size="md"
          className="flex-shrink-0 text-amber-400"
          aria-hidden={true}
        />
        {spell.name}
        <Badge variant="status">Level 1</Badge>
      </Typography>

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
      <MarkdownText
        content={description}
        variant="caption"
        className="text-sm text-zinc-400 mb-6"
      />

      <Card variant="standard" className="mb-6">
        {isLoading ? (
          <LoadingState variant="inline" message="Loading spells..." className="py-4" />
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
          {character.spells[0] && renderSpellDetails(character.spells[0])}
        </Card>
      )}
    </section>
  );
}

export const SpellSelector = memo(SpellSelectorComponent);
