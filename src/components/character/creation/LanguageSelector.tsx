import { useCallback, useMemo } from "react";
import { TextInput } from "@/components/ui/inputs";
import { Button } from "@/components/ui";
import { allRaces } from "@/data/races";
import {
  CARD_STYLES,
  TEXT_STYLES,
  ICON_STYLES,
  LAYOUT_STYLES,
} from "@/constants";
import type { Character } from "@/types/character";

interface LanguageSelectorProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

function LanguageSelector({
  character,
  onCharacterChange,
}: LanguageSelectorProps) {
  // Calculate how many bonus languages the character can learn based on Intelligence modifier
  const maxBonusLanguages = useMemo(() => {
    return Math.max(0, character.abilities.intelligence.modifier);
  }, [character.abilities.intelligence.modifier]);

  // Get the character's race data to determine automatic languages
  const raceData = useMemo(() => {
    return allRaces.find((race) => race.id === character.race);
  }, [character.race]);

  const automaticLanguages = useMemo(() => {
    return raceData?.languages || ["Common"];
  }, [raceData?.languages]);

  // Get current bonus languages (languages beyond the automatic ones)
  const bonusLanguages = useMemo(() => {
    const currentLanguages = character.languages || [];
    return currentLanguages.filter(
      (lang) => !automaticLanguages.includes(lang)
    );
  }, [character.languages, automaticLanguages]);

  // Calculate how many more languages can be added
  const remainingSlots = useMemo(() => {
    return maxBonusLanguages - bonusLanguages.length;
  }, [maxBonusLanguages, bonusLanguages.length]);

  const handleLanguageChange = useCallback(
    (index: number, newLanguage: string) => {
      const updatedBonusLanguages = [...bonusLanguages];
      updatedBonusLanguages[index] = newLanguage;

      // Filter out empty strings
      const filteredBonusLanguages = updatedBonusLanguages.filter(
        (lang) => lang.trim() !== ""
      );

      // Combine automatic and bonus languages
      const allLanguages = [...automaticLanguages, ...filteredBonusLanguages];

      onCharacterChange({
        ...character,
        languages: allLanguages,
      });
    },
    [character, onCharacterChange, automaticLanguages, bonusLanguages]
  );

  const handleAddLanguage = useCallback(() => {
    if (remainingSlots > 0) {
      const updatedBonusLanguages = [...bonusLanguages, ""];
      const allLanguages = [...automaticLanguages, ...updatedBonusLanguages];

      onCharacterChange({
        ...character,
        languages: allLanguages,
      });
    }
  }, [
    character,
    onCharacterChange,
    automaticLanguages,
    bonusLanguages,
    remainingSlots,
  ]);

  const handleRemoveLanguage = useCallback(
    (index: number) => {
      const updatedBonusLanguages = bonusLanguages.filter(
        (_, i) => i !== index
      );
      const allLanguages = [...automaticLanguages, ...updatedBonusLanguages];

      onCharacterChange({
        ...character,
        languages: allLanguages,
      });
    },
    [character, onCharacterChange, automaticLanguages, bonusLanguages]
  );

  return (
    <div className="space-y-6">
      <header>
        <h4 className={`${TEXT_STYLES.sectionHeading} flex items-center gap-2`}>
          <svg
            className="w-5 h-5 text-amber-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z"
              clipRule="evenodd"
            />
          </svg>
          Languages
        </h4>
        <div className={`${CARD_STYLES.infoCompact} mb-6`}>
          <p className={TEXT_STYLES.descriptionCompact}>
            All characters know their native language(s). Characters with
            Intelligence 13+ may learn additional languages equal to their
            Intelligence bonus (+1, +2, or +3).
          </p>
        </div>
      </header>

      {/* Automatic Languages */}
      <div className={CARD_STYLES.standard}>
        <h5
          className={`${TEXT_STYLES.baseSectionHeading} ${LAYOUT_STYLES.iconText}`}
        >
          <svg
            className={`${ICON_STYLES.sm} text-zinc-400`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Automatic Languages
        </h5>
        <div className="flex flex-wrap gap-2">
          {automaticLanguages.map((language, index) => (
            <div
              key={`auto-${index}`}
              className="flex items-center gap-2 bg-zinc-700 px-3 py-2 rounded-md border border-zinc-600"
            >
              <span className="text-zinc-100 font-medium">{language}</span>
              <span className="text-zinc-400 text-sm">(automatic)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bonus Languages */}
      {maxBonusLanguages > 0 && (
        <div className={CARD_STYLES.standard}>
          <div className={`${LAYOUT_STYLES.iconText} mb-4`}>
            <svg
              className={`${ICON_STYLES.sm} text-zinc-400`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <h5 className="text-base font-semibold text-zinc-100 m-0">
              Bonus Languages
            </h5>
            {maxBonusLanguages > 0 && (
              <span className={TEXT_STYLES.helper}>
                ({bonusLanguages.length}/{maxBonusLanguages} used)
              </span>
            )}
          </div>

          {bonusLanguages.length === 0 && maxBonusLanguages > 0 && (
            <p className="text-zinc-300 mb-4">
              Your Intelligence bonus allows you to learn {maxBonusLanguages}{" "}
              additional language{maxBonusLanguages > 1 ? "s" : ""}.
            </p>
          )}

          <div className="space-y-3">
            {bonusLanguages.map((language, index) => (
              <div key={`bonus-${index}`} className="flex items-center gap-3">
                <div className="flex-1">
                  <TextInput
                    value={language}
                    onChange={(value) => handleLanguageChange(index, value)}
                    placeholder="Enter language name"
                    maxLength={30}
                    aria-label={`Bonus language ${index + 1}`}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveLanguage(index)}
                  aria-label={`Remove language ${index + 1}`}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          {remainingSlots > 0 && (
            <div className="mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddLanguage}
                className="w-full sm:w-auto"
              >
                <span className="mr-1">+</span>
                Add Language ({remainingSlots} remaining)
              </Button>
            </div>
          )}
        </div>
      )}

      {maxBonusLanguages === 0 && (
        <div className={CARD_STYLES.info}>
          <div className={`${LAYOUT_STYLES.iconTextLarge} mb-2`}>
            <svg
              className={`${ICON_STYLES.md} text-amber-400`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h5 className="text-base font-semibold text-amber-100 m-0">
              No Bonus Languages Available
            </h5>
          </div>
          <p className="text-amber-100 text-sm m-0">
            Your Intelligence score ({character.abilities.intelligence.value})
            does not provide any bonus languages. You need Intelligence 13+ to
            learn additional languages.
          </p>
        </div>
      )}

      {/* Common bonus languages suggestion */}
      {maxBonusLanguages > 0 && (
        <div className={CARD_STYLES.info}>
          <div className={`${LAYOUT_STYLES.iconTextLarge} mb-2`}>
            <svg
              className={`${ICON_STYLES.md} text-amber-400`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <h5 className="text-base font-semibold text-amber-100 m-0">
              Common Languages to Consider
            </h5>
          </div>
          <p className="text-amber-100 text-sm m-0">
            Elvish, Dwarvish, Halfling, Gnomish, Orcish, Goblin, Kobold, Gnoll,
            Draconic, Giant, Alignment tongues (Lawful, Chaotic), or other
            regional languages as determined by your GM.
          </p>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
