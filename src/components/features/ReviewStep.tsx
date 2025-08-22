import { useCallback, useMemo, memo } from "react";
import { TextInput, StepWrapper, HorizontalRule } from "@/components/ui";
import { LanguageSelector, AvatarSelector } from "@/components/features";
import {
  CARD_STYLES,
  BADGE_STYLES,
  TEXT_STYLES,
  ICON_STYLES,
} from "@/constants";
import { useValidation } from "@/hooks";
import { characterNameSchema } from "@/utils/validationSchemas";
import { sanitizeCharacterName } from "@/utils/sanitization";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";
import type { Character } from "@/types/character";

interface ReviewStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

function ReviewStepComponent({
  character,
  onCharacterChange,
}: ReviewStepProps) {
  // Validate character name
  const nameValidation = useValidation(character.name, characterNameSchema);

  // Look up display names for race and classes
  const raceDisplayName = useMemo(() => {
    if (!character.race) return "None selected";
    const race = allRaces.find((r) => r.id === character.race);
    return race?.name || character.race;
  }, [character.race]);

  const classDisplayNames = useMemo(() => {
    if (character.class.length === 0) return "None selected";
    return character.class
      .map((classId) => {
        const classData = allClasses.find((c) => c.id === classId);
        return classData?.name || classId;
      })
      .join("/");
  }, [character.class]);

  const handleNameChange = useCallback(
    (name: string) => {
      // Sanitize the input to prevent potential XSS and ensure valid characters
      const sanitizedName = sanitizeCharacterName(name);
      onCharacterChange({
        ...character,
        name: sanitizedName,
      });
    },
    [character, onCharacterChange]
  );

  const getStatusMessage = () => {
    if (!character.name || character.name.trim() === "") {
      return "Character name required";
    }
    if (!nameValidation.isValid) {
      return "Please fix character name errors";
    }
    return `${character.name} - ${raceDisplayName} ${classDisplayNames}`;
  };

  return (
    <StepWrapper
      title="Review & Finalize"
      description="Name your character and review all details before completing character creation."
      statusMessage={getStatusMessage()}
    >
      {/* Character Name Section */}
      <section className="mb-8">
        <h4 className={TEXT_STYLES.sectionHeading}>Character Name</h4>

        <div className={CARD_STYLES.standard}>
          <TextInput
            value={character.name}
            onChange={handleNameChange}
            placeholder="Enter your character's name"
            maxLength={50}
            required
            aria-label="Character name"
            {...(nameValidation.errors.length > 0 && {
              "aria-describedby": "name-error",
            })}
            aria-invalid={!nameValidation.isValid}
          />
          {nameValidation.errors.length > 0 && (
            <div
              id="name-error"
              role="alert"
              aria-live="assertive"
              className="text-red-400 text-sm mt-2"
            >
              {nameValidation.errors[0]}
            </div>
          )}
        </div>
      </section>

      {/* Character Summary */}
      <section className="mb-8">
        <h4 className={TEXT_STYLES.sectionHeading}>Character Summary</h4>

        <div className={`${CARD_STYLES.success} p-0`}>
          <div className="p-6">
            {/* Header with Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              {/* Avatar */}
              {character.avatar && (
                <div className="flex-shrink-0 self-center sm:self-start">
                  <img
                    src={character.avatar}
                    alt={`${character.name || "Character"} avatar`}
                    className="w-24 h-24 rounded-full border-3 border-lime-400 object-cover shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Character Overview */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <svg
                    className="w-6 h-6 text-lime-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h5 className="text-xl font-semibold text-lime-100 m-0">
                    {character.name || "Unnamed Character"}
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 border border-lime-700/30 rounded-lg p-3">
                    <h6 className="font-semibold mb-1 text-lime-400 flex items-center gap-2">
                      <svg
                        className={ICON_STYLES.sm}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Race
                    </h6>
                    <p className="text-lime-50 font-medium m-0">
                      {raceDisplayName}
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 border border-lime-700/30 rounded-lg p-3">
                    <h6 className="font-semibold mb-1 text-lime-400 flex items-center gap-2">
                      <svg
                        className={ICON_STYLES.sm}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Class
                    </h6>
                    <p className="text-lime-50 font-medium m-0">
                      {classDisplayNames}
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 border border-lime-700/30 rounded-lg p-3">
                    <h6 className="font-semibold mb-1 text-lime-400 flex items-center gap-2">
                      <svg
                        className={ICON_STYLES.sm}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Hit Points
                    </h6>
                    <p className="text-lime-50 font-bold text-lg m-0">
                      {character.hp?.current || 0} / {character.hp?.max || 0} HP
                    </p>
                  </div>

                  {character.currency.gold > 0 && (
                    <div className="bg-zinc-800/50 border border-lime-700/30 rounded-lg p-3">
                      <h6 className="font-semibold mb-1 text-lime-400 flex items-center gap-2">
                        <svg
                          className={ICON_STYLES.sm}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Gold
                      </h6>
                      <p className="text-lime-50 font-medium m-0">
                        {character.currency.gold} gp
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ability Scores */}
            <div className="mb-6">
              <h6 className="font-semibold mb-4 text-lime-400 flex items-center gap-2">
                <svg
                  className={ICON_STYLES.sm}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                Ability Scores
              </h6>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(character.abilities).map(([ability, score]) => (
                  <div
                    key={ability}
                    className="bg-zinc-800/50 border border-lime-700/30 rounded-lg p-3 text-center"
                  >
                    <div className="text-xs text-lime-300 uppercase tracking-wider font-medium mb-1">
                      {ability.slice(0, 3)}
                    </div>
                    <div className="text-lg font-bold text-lime-100">
                      {score.value}
                    </div>
                    <div className="text-xs text-lime-300">
                      {score.modifier >= 0 ? "+" : ""}
                      {score.modifier}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Summary */}
            {character.equipment.length > 0 && (
              <div className="mb-6">
                <h6 className="font-semibold mb-4 text-lime-400 flex items-center gap-2">
                  <svg
                    className={ICON_STYLES.sm}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Equipment (
                  {character.equipment.reduce(
                    (total, item) => total + item.amount,
                    0
                  )}{" "}
                  items)
                </h6>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-zinc-800/50 border border-lime-700/30 rounded-lg p-3">
                    <div className="text-sm text-lime-300 mb-1">
                      Total Weight
                    </div>
                    <div className="text-lime-50 font-medium">
                      {character.equipment
                        .reduce(
                          (total, item) => total + item.weight * item.amount,
                          0
                        )
                        .toFixed(1)}{" "}
                      lbs
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 border border-lime-700/30 rounded-lg p-3">
                    <div className="text-sm text-lime-300 mb-1">
                      Equipment Value
                    </div>
                    <div className="text-lime-50 font-medium">
                      {character.equipment
                        .reduce((total, item) => {
                          let itemValueInGold = item.costValue * item.amount;
                          if (item.costCurrency === "sp") itemValueInGold /= 10;
                          else if (item.costCurrency === "cp")
                            itemValueInGold /= 100;
                          return total + itemValueInGold;
                        }, 0)
                        .toFixed(2)}{" "}
                      gp
                    </div>
                  </div>
                </div>

                <div className="max-h-32 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {character.equipment.map((item, index) => (
                      <div
                        key={index}
                        className="text-sm text-lime-200 flex justify-between"
                      >
                        <span>{item.name}</span>
                        {item.amount > 1 && (
                          <span className="text-lime-300">× {item.amount}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Spells */}
            {character.spells && character.spells.length > 0 && (
              <div>
                <h6 className="font-semibold mb-4 text-lime-400 flex items-center gap-2">
                  <svg
                    className={ICON_STYLES.sm}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Spells
                </h6>

                <div className="bg-zinc-800/50 border border-lime-700/30 rounded-lg p-3">
                  <div className="space-y-2">
                    {character.class.includes("magic-user") && (
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-600 text-zinc-900 text-xs font-medium px-2 py-1 rounded">
                          Auto
                        </span>
                        <span className="text-lime-200 font-medium">
                          Read Magic
                        </span>
                        <span className="text-lime-300 text-sm">
                          (automatically known)
                        </span>
                      </div>
                    )}
                    {character.spells.map((spell, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className={BADGE_STYLES.status}>L1</span>
                        <span className="text-lime-200 font-medium">
                          {spell.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <HorizontalRule />

      {/* Languages */}
      <section className="mb-8">
        <LanguageSelector
          character={character}
          onCharacterChange={onCharacterChange}
        />
      </section>

      <HorizontalRule />

      {/* Avatar */}
      <section className="mb-8">
        <AvatarSelector
          character={character}
          onCharacterChange={onCharacterChange}
        />
      </section>

    </StepWrapper>
  );
}

export const ReviewStep = memo(ReviewStepComponent);
