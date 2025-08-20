import { useCallback, useMemo } from "react";
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

function ReviewStep({ character, onCharacterChange }: ReviewStepProps) {
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
      <section style={{ marginBottom: "2rem" }}>
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
            style={{
              color: "#dc3545",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            {nameValidation.errors[0]}
          </div>
        )}
      </section>

      {/* Character Summary */}
      <section style={{ marginBottom: "2rem" }}>
        <h4>Character Summary</h4>
        <div
          style={{
            border: "1px solid #dee2e6",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            {/* Avatar */}
            {character.avatar && (
              <div style={{ flexShrink: 0 }}>
                <img
                  src={character.avatar}
                  alt={`${character.name || 'Character'} avatar`}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: "2px solid #dee2e6",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}
            
            {/* Character Info */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                flex: 1,
              }}
            >
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
          <div style={{ marginBottom: "1rem" }}>
            <h5 style={{ marginBottom: "0.5rem" }}>Ability Scores</h5>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.5rem",
              }}
            >
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
            <div style={{ marginBottom: "1rem" }}>
              <h5 style={{ marginBottom: "0.5rem" }}>
                Equipment (
                {character.equipment.reduce(
                  (total, item) => total + item.amount,
                  0
                )}{" "}
                items)
              </h5>
              <div style={{ fontSize: "0.875rem", color: "#6c757d" }}>
                Total Weight:{" "}
                {character.equipment
                  .reduce((total, item) => total + item.weight * item.amount, 0)
                  .toFixed(1)}{" "}
                lbs
                {character.gold > 0 && (
                  <span style={{ marginLeft: "1rem" }}>
                    Remaining Gold: {character.gold} gp
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Spells */}
          {character.spells && character.spells.length > 0 && (
            <div>
              <h5 style={{ marginBottom: "0.5rem" }}>Spells</h5>
              <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                {/* Show Read Magic automatically for Magic-Users */}
                {character.class.includes("magic-user") && (
                  <li style={{ fontSize: "0.875rem", fontStyle: "italic" }}>
                    <strong>Read Magic</strong> (automatically known)
                  </li>
                )}
                {character.spells.map((spell, index) => (
                  <li key={index} style={{ fontSize: "0.875rem" }}>
                    <strong>{spell.name}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Languages */}
      <section style={{ marginBottom: "2rem" }}>
        <LanguageSelector
          character={character}
          onCharacterChange={onCharacterChange}
        />
      </section>

      {/* Avatar */}
      <section style={{ marginBottom: "2rem" }}>
        <AvatarSelector
          character={character}
          onCharacterChange={onCharacterChange}
        />
      </section>
    </StepWrapper>
  );
}

export default ReviewStep;
