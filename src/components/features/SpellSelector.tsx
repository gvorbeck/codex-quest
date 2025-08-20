import { Select } from "@/components/ui";
import type { Character, Spell } from "@/types/character";
import { memo } from "react";

interface SpellSelectorProps {
  character: Character;
  availableSpells: Spell[];
  onSpellChange: (spellName: string) => void;
  title: string;
  description: string;
  detailsId: string;
}

function SpellSelectorComponent({
  character,
  availableSpells,
  onSpellChange,
  title,
  description,
  detailsId,
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
    <section aria-labelledby={`${detailsId}-heading`}>
      <h6 id={`${detailsId}-heading`}>{title}</h6>
      <p>{description}</p>
      <Select
        label="Choose your starting spell"
        value={selectedSpell}
        onValueChange={onSpellChange}
        options={spellOptions}
        placeholder="Choose a spell"
        required
        aria-describedby={selectedSpell ? `${detailsId}-details` : undefined}
      />

      {selectedSpell && character.spells && character.spells.length > 0 && (
        <div id={`${detailsId}-details`}>
          {(() => {
            const spell = character.spells[0];
            if (!spell) return null;
            return (
              <section aria-labelledby={`${detailsId}-info-heading`}>
                <h6 id={`${detailsId}-info-heading`}>{spell.name}</h6>
                <dl>
                  <dt>Range:</dt>
                  <dd>{spell.range}</dd>
                  <dt>Duration:</dt>
                  <dd>{spell.duration}</dd>
                </dl>
                <p>{spell.description}</p>
              </section>
            );
          })()}
        </div>
      )}
    </section>
  );
}

export const SpellSelector = memo(SpellSelectorComponent);
