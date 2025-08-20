import { useCallback, useMemo } from "react";
import { TextInput, Button } from "@/components/ui";
import { allRaces } from "@/data/races";
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
        <h4 className="text-lg font-semibold text-primary-100 mb-2">
          Languages
        </h4>
        <p className="text-primary-300">
          All characters know their native language(s). Characters with
          Intelligence 13+ may learn additional languages equal to their
          Intelligence bonus (+1, +2, or +3).
        </p>
      </header>

      {/* Automatic Languages */}
      <div className="bg-primary-800 rounded-lg p-4 border border-primary-700">
        <h5 className="text-base font-medium text-primary-200 mb-3">
          Automatic Languages
        </h5>
        <div className="flex flex-wrap gap-2">
          {automaticLanguages.map((language, index) => (
            <div
              key={`auto-${index}`}
              className="flex items-center gap-2 bg-primary-700 px-3 py-2 rounded-md border border-primary-600"
            >
              <span className="text-primary-100 font-medium">{language}</span>
              <span className="text-primary-400 text-sm">(automatic)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bonus Languages */}
      {maxBonusLanguages > 0 && (
        <div className="bg-primary-800 rounded-lg p-4 border border-primary-700">
          <h5 className="text-base font-medium text-primary-200 mb-3">
            Bonus Languages
            {maxBonusLanguages > 0 && (
              <span className="text-primary-400 font-normal">
                {" "}
                ({bonusLanguages.length}/{maxBonusLanguages} used)
              </span>
            )}
          </h5>

          {bonusLanguages.length === 0 && maxBonusLanguages > 0 && (
            <p className="text-primary-300 mb-4">
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
        <div className="bg-primary-800 rounded-lg p-4 border border-primary-700">
          <p className="text-primary-300">
            Your Intelligence score ({character.abilities.intelligence.value})
            does not provide any bonus languages. You need Intelligence 13+ to
            learn additional languages.
          </p>
        </div>
      )}

      {/* Common bonus languages suggestion */}
      {maxBonusLanguages > 0 && (
        <div className="bg-primary-800/50 rounded-lg p-4 border border-primary-700/50">
          <h6 className="text-base font-medium text-primary-200 mb-2">
            Common Languages to Consider:
          </h6>
          <p className="text-primary-300 text-sm">
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
