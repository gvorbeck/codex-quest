import { useCallback, useMemo, memo } from "react";
import { TextInput, StepWrapper } from "@/components/ui";
import { LanguageSelector, AvatarSelector } from "@/components/features";
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

function ReviewStepComponent({ character, onCharacterChange }: ReviewStepProps) {
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

  return (
    <StepWrapper
      title="Review & Finalize"
      description="Name your character and review all details before completing character creation."
    >
      {/* Character Name */}
      <section className="mb-8">
        <h4>Character Name</h4>
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
            className="text-red-600 text-sm mt-1"
          >
            {nameValidation.errors[0]}
          </div>
        )}
      </section>

      {/* Character Summary */}
      <section className="mb-8">
        <h4>Character Summary</h4>
        <div className="border border-zinc-600 rounded-lg p-6 bg-zinc-800">
          <div className="flex gap-6 mb-4">
            {/* Avatar */}
            {character.avatar && (
              <div className="flex-shrink-0">
                <img
                  src={character.avatar}
                  alt={`${character.name || "Character"} avatar`}
                  className="w-20 h-20 rounded-full border-2 border-zinc-600 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Character Info */}
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div>
                <strong>Name:</strong> {character.name || "Unnamed Character"}
              </div>
              <div>
                <strong>Race:</strong> {raceDisplayName}
              </div>
              <div>
                <strong>Class:</strong> {classDisplayNames}
              </div>
              <div>
                <strong>Hit Points:</strong> {character.hp?.current || 0}/
                {character.hp?.max || 0}
              </div>
            </div>
          </div>

          {/* Ability Scores */}
          <div className="mb-4">
            <h5 className="mb-2">Ability Scores</h5>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <strong>STR:</strong> {character.abilities.strength.value} (
                {character.abilities.strength.modifier >= 0 ? "+" : ""}
                {character.abilities.strength.modifier})
              </div>
              <div>
                <strong>DEX:</strong> {character.abilities.dexterity.value} (
                {character.abilities.dexterity.modifier >= 0 ? "+" : ""}
                {character.abilities.dexterity.modifier})
              </div>
              <div>
                <strong>CON:</strong> {character.abilities.constitution.value} (
                {character.abilities.constitution.modifier >= 0 ? "+" : ""}
                {character.abilities.constitution.modifier})
              </div>
              <div>
                <strong>INT:</strong> {character.abilities.intelligence.value} (
                {character.abilities.intelligence.modifier >= 0 ? "+" : ""}
                {character.abilities.intelligence.modifier})
              </div>
              <div>
                <strong>WIS:</strong> {character.abilities.wisdom.value} (
                {character.abilities.wisdom.modifier >= 0 ? "+" : ""}
                {character.abilities.wisdom.modifier})
              </div>
              <div>
                <strong>CHA:</strong> {character.abilities.charisma.value} (
                {character.abilities.charisma.modifier >= 0 ? "+" : ""}
                {character.abilities.charisma.modifier})
              </div>
            </div>
          </div>

          {/* Equipment Summary */}
          {character.equipment.length > 0 && (
            <div className="mb-4">
              <h5 className="mb-2">
                Equipment (
                {character.equipment.reduce(
                  (total, item) => total + item.amount,
                  0
                )}{" "}
                items)
              </h5>
              <div className="text-sm text-zinc-400">
                Total Weight:{" "}
                {character.equipment
                  .reduce((total, item) => total + item.weight * item.amount, 0)
                  .toFixed(1)}{" "}
                lbs
                {character.gold > 0 && (
                  <span className="ml-4">
                    Remaining Gold: {character.gold} gp
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Spells */}
          {character.spells && character.spells.length > 0 && (
            <div>
              <h5 className="mb-2">Spells</h5>
              <ul className="m-0 pl-4">
                {/* Show Read Magic automatically for Magic-Users */}
                {character.class.includes("magic-user") && (
                  <li className="text-sm italic">
                    <strong>Read Magic</strong> (automatically known)
                  </li>
                )}
                {character.spells.map((spell, index) => (
                  <li key={index} className="text-sm">
                    <strong>{spell.name}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Languages */}
      <section className="mb-8">
        <LanguageSelector
          character={character}
          onCharacterChange={onCharacterChange}
        />
      </section>

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
