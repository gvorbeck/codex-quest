import { Select } from "@/components/ui/inputs";
import {
  CARD_STYLES,
  TEXT_STYLES,
  ICON_STYLES,
  LAYOUT_STYLES,
  BADGE_STYLES,
} from "@/constants";
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

      <div className={`${CARD_STYLES.standard} mb-6`}>
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
      </div>

      {selectedSpell && character.spells && character.spells.length > 0 && (
        <div className={CARD_STYLES.info} id={`${detailsId}-details`}>
          {(() => {
            const spell = character.spells[0];
            if (!spell) return null;
            return (
              <div aria-labelledby={`${detailsId}-info-heading`}>
                <div className={`${LAYOUT_STYLES.iconTextLarge} mb-6`}>
                  <svg
                    className={`${ICON_STYLES.lg} flex-shrink-0 text-amber-400`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <h5
                    id={`${detailsId}-info-heading`}
                    className={TEXT_STYLES.infoHeading}
                  >
                    {spell.name}
                  </h5>
                  <span className={BADGE_STYLES.status}>Level 1</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className={CARD_STYLES.nested}>
                    <h6 className={TEXT_STYLES.subHeading}>
                      <svg
                        className={ICON_STYLES.sm}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Range
                    </h6>
                    <p className="text-amber-50 text-sm m-0">{spell.range}</p>
                  </div>
                  <div className={CARD_STYLES.nested}>
                    <h6 className={TEXT_STYLES.subHeading}>
                      <svg
                        className={ICON_STYLES.sm}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Duration
                    </h6>
                    <p className="text-amber-50 text-sm m-0">
                      {spell.duration}
                    </p>
                  </div>
                </div>

                <div className={CARD_STYLES.nested}>
                  <h6 className={TEXT_STYLES.subHeadingSpaced}>
                    <svg
                      className={ICON_STYLES.sm}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Description
                  </h6>
                  <p className={TEXT_STYLES.description}>{spell.description}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
}

export const SpellSelector = memo(SpellSelectorComponent);
