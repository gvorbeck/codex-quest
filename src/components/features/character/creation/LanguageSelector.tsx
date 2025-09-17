import { useCallback, useMemo } from "react";
import { TextInput } from "@/components/ui/core/primitives";
import { Button, Icon } from "@/components/ui";
import { Card, Typography, Badge } from "@/components/ui/core/display";
import { allRaces } from "@/data";
import { LAYOUT_STYLES } from "@/constants";
import { cn, findById } from "@/utils";
import type { Character } from "@/types";

interface LanguageSelectorProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

interface LanguageInputProps {
  language: string;
  index: number;
  onChange: (index: number, value: string) => void;
  onBlur: (index: number, language: string) => void;
  onRemove: (index: number) => void;
  labelPrefix: string;
}

// Hoist styling constants
const REMOVE_BUTTON_CLASSES = cn(
  "text-red-400 hover:text-red-300 hover:bg-red-900/20"
);

const SECTION_HEADING_WITH_MARGIN_CLASSES = cn(LAYOUT_STYLES.iconText, "mb-4");
const INFO_SECTION_CLASSES = cn(LAYOUT_STYLES.iconText, "mb-2");

const LanguageInput = ({
  language,
  index,
  onChange,
  onBlur,
  onRemove,
  labelPrefix,
}: LanguageInputProps) => (
  <div className="flex items-center gap-3">
    <div className="flex-1">
      <TextInput
        value={language}
        onChange={(value) => onChange(index, value)}
        onBlur={() => onBlur(index, language)}
        placeholder="Enter language name"
        maxLength={30}
        aria-label={`${labelPrefix} language ${index + 1}`}
      />
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onRemove(index)}
      aria-label={`Remove language ${index + 1}`}
      className={REMOVE_BUTTON_CLASSES}
    >
      <Icon name="close" size="xs" />
    </Button>
  </div>
);

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
    return findById(character.race, allRaces);
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

      // Don't filter during typing - just update the array
      // Combine automatic and bonus languages
      const allLanguages = [...automaticLanguages, ...updatedBonusLanguages];

      onCharacterChange({
        ...character,
        languages: allLanguages,
      });
    },
    [character, onCharacterChange, automaticLanguages, bonusLanguages]
  );

  const handleLanguageBlur = useCallback(
    (index: number, language: string) => {
      // Clean up empty/whitespace-only languages when user moves away from field
      const trimmedLanguage = language.trim();
      if (trimmedLanguage === "") {
        // Remove empty language
        const updatedBonusLanguages = bonusLanguages.filter(
          (_, i) => i !== index
        );
        const allLanguages = [...automaticLanguages, ...updatedBonusLanguages];
        onCharacterChange({
          ...character,
          languages: allLanguages,
        });
      } else if (trimmedLanguage !== language) {
        // Trim whitespace from language
        const updatedBonusLanguages = [...bonusLanguages];
        updatedBonusLanguages[index] = trimmedLanguage;
        const allLanguages = [...automaticLanguages, ...updatedBonusLanguages];
        onCharacterChange({
          ...character,
          languages: allLanguages,
        });
      }
    },
    [character, onCharacterChange, automaticLanguages, bonusLanguages]
  );

  const handleAddLanguage = useCallback(() => {
    const updatedBonusLanguages = [...bonusLanguages, ""];
    const allLanguages = [...automaticLanguages, ...updatedBonusLanguages];

    onCharacterChange({
      ...character,
      languages: allLanguages,
    });
  }, [character, onCharacterChange, automaticLanguages, bonusLanguages]);

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
        <Typography
          variant="sectionHeading"
          className="flex items-center gap-2"
        >
          <Icon name="language" size="md" className="text-amber-400" />
          Languages
        </Typography>
        <Card variant="info" size="compact" className="mb-6">
          <Typography variant="descriptionCompact">
            All characters know their native language(s). Characters with
            Intelligence 13+ may learn additional languages equal to their
            Intelligence bonus (+1, +2, or +3).
          </Typography>
        </Card>
      </header>

      {/* Automatic Languages */}
      <Card variant="standard">
        <Typography
          variant="baseSectionHeading"
          className={LAYOUT_STYLES.iconText}
        >
          <Icon name="check-circle" size="sm" className="text-zinc-400" />
          Automatic Languages
        </Typography>
        <div className="flex flex-wrap gap-2">
          {automaticLanguages.map((language, index) => (
            <Badge
              key={`auto-${index}`}
              variant="secondary"
              size="md"
              className="gap-2"
            >
              {language}
              <span className="text-zinc-400 text-sm">(automatic)</span>
            </Badge>
          ))}
        </div>
      </Card>

      {/* Bonus Languages */}
      {maxBonusLanguages > 0 && (
        <Card variant="standard">
          <Typography
            variant="baseSectionHeading"
            className={SECTION_HEADING_WITH_MARGIN_CLASSES}
            color="zinc"
          >
            <Icon
              name="plus"
              size="sm"
              className="text-zinc-400"
              aria-hidden={true}
            />
            Bonus Languages
            {maxBonusLanguages > 0 && (
              <Typography variant="helper" className="ml-2">
                ({bonusLanguages.length}/{maxBonusLanguages} used)
              </Typography>
            )}
          </Typography>

          {bonusLanguages.length === 0 && maxBonusLanguages > 0 && (
            <Typography variant="body" color="secondary" className="mb-4">
              Your Intelligence bonus allows you to learn {maxBonusLanguages}{" "}
              additional language{maxBonusLanguages > 1 ? "s" : ""}.
            </Typography>
          )}

          <div className="space-y-3">
            {bonusLanguages.map((language, index) => (
              <LanguageInput
                key={`bonus-${index}`}
                language={language}
                index={index}
                onChange={handleLanguageChange}
                onBlur={handleLanguageBlur}
                onRemove={handleRemoveLanguage}
                labelPrefix="Bonus"
              />
            ))}
          </div>

          <div className="mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddLanguage}
              className="w-full sm:w-auto"
            >
              <span className="mr-1">+</span>
              Add Language
              {remainingSlots > 0 ? ` (${remainingSlots} remaining)` : ""}
            </Button>
            {remainingSlots <= 0 && maxBonusLanguages > 0 && (
              <Typography variant="helper" color="amber" className="mt-2">
                <Icon
                  name="exclamation-triangle"
                  size="xs"
                  className="inline mr-1"
                />
                Adding beyond Intelligence limit - GM discretion required
              </Typography>
            )}
          </div>
        </Card>
      )}

      {maxBonusLanguages === 0 && (
        <Card variant="standard">
          <Typography
            variant="baseSectionHeading"
            className={SECTION_HEADING_WITH_MARGIN_CLASSES}
            color="zinc"
          >
            <Icon
              name="plus"
              size="sm"
              className="text-zinc-400"
              aria-hidden={true}
            />
            Additional Languages
            <Typography variant="helper" className="ml-2">
              ({bonusLanguages.length}/0 used)
            </Typography>
          </Typography>

          <Typography variant="body" color="secondary" className="mb-4">
            Your Intelligence score ({character.abilities.intelligence.value})
            doesn't normally allow bonus languages, but your GM may permit
            additional languages.
          </Typography>

          <div className="space-y-3">
            {bonusLanguages.map((language, index) => (
              <LanguageInput
                key={`bonus-${index}`}
                language={language}
                index={index}
                onChange={handleLanguageChange}
                onBlur={handleLanguageBlur}
                onRemove={handleRemoveLanguage}
                labelPrefix="Additional"
              />
            ))}
          </div>

          <div className="mt-4 flex gap-4 items-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddLanguage}
              className="w-full sm:w-auto"
            >
              <span className="mr-1">+</span>
              Add Language
            </Button>
            <Typography variant="helper" color="amber" className="mt-2">
              <Icon
                name="exclamation-triangle"
                size="xs"
                className="inline mr-1"
              />
              Beyond Intelligence limit - GM discretion required
            </Typography>
          </div>
        </Card>
      )}

      {/* Common bonus languages suggestion */}
      {maxBonusLanguages > 0 && (
        <Card variant="info">
          <Typography
            variant="baseSectionHeading"
            className={INFO_SECTION_CLASSES}
            color="amber"
          >
            <Icon name="info" size="sm" className="text-amber-400" />
            Common Languages to Consider
          </Typography>
          <Typography variant="helper" color="amber">
            Elvish, Dwarvish, Halfling, Gnomish, Orcish, Goblin, Kobold, Gnoll,
            Draconic, Giant, Alignment tongues (Lawful, Chaotic), or other
            regional languages as determined by your GM.
          </Typography>
        </Card>
      )}
    </div>
  );
}

export default LanguageSelector;
