import { Select, Callout } from "@/components/ui";
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
    <section aria-labelledby={`${detailsId}-heading`}>
      <h6 id={`${detailsId}-heading`}>{title}</h6>
      <p>{description}</p>
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-stone-400"></div>
          <span className="ml-3 text-stone-400">Loading spells...</span>
        </div>
      ) : (
        <Select
          label="Choose your starting spell"
          value={selectedSpell}
          onValueChange={onSpellChange}
          options={spellOptions}
          placeholder="Choose a spell"
          required
          aria-describedby={selectedSpell ? `${detailsId}-details` : undefined}
        />
      )}

      {selectedSpell && character.spells && character.spells.length > 0 && (
        <Callout variant="info" id={`${detailsId}-details`}>
          {(() => {
            const spell = character.spells[0];
            if (!spell) return null;
            return (
              <div aria-labelledby={`${detailsId}-info-heading`}>
                <h6
                  id={`${detailsId}-info-heading`}
                  className="font-semibold mb-3 text-amber-400"
                >
                  {spell.name}
                </h6>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <dt className="font-semibold text-amber-300">Range:</dt>
                    <dd className="mb-0">{spell.range}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-amber-300">Duration:</dt>
                    <dd className="mb-0">{spell.duration}</dd>
                  </div>
                </dl>
                <div>
                  <dt className="font-semibold text-amber-300 mb-2">
                    Description:
                  </dt>
                  <dd className="mb-0">{spell.description}</dd>
                </div>
              </div>
            );
          })()}
        </Callout>
      )}
    </section>
  );
}

export const SpellSelector = memo(SpellSelectorComponent);
