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
  const maxBonusLanguages = Math.max(
    0,
    character.abilities.intelligence.modifier
  );

  // Get the character's race data to determine automatic languages
  const raceData = useMemo(() => {
    return allRaces.find((race) => race.id === character.race);
  }, [character.race]);

  const automaticLanguages = useMemo(() => {
    return raceData?.languages || ["Common"];
  }, [raceData?.languages]);

  // Get current bonus languages (languages beyond the automatic ones)
  const currentLanguages = character.languages || [];
  const bonusLanguages = currentLanguages.filter(
    (lang) => !automaticLanguages.includes(lang)
  );

  // Calculate how many more languages can be added
  const remainingSlots = maxBonusLanguages - bonusLanguages.length;

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
    <div>
      <h4>Languages</h4>
      <p
        style={{ fontSize: "0.875rem", color: "#6c757d", marginBottom: "1rem" }}
      >
        All characters know their native language(s). Characters with
        Intelligence 13+ may learn additional languages equal to their
        Intelligence bonus (+1, +2, or +3).
      </p>

      {/* Automatic Languages */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h5 style={{ marginBottom: "0.5rem" }}>Automatic Languages</h5>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {automaticLanguages.map((language, index) => (
            <div
              key={`auto-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem",
                backgroundColor: "#f8f9fa",
                borderRadius: "0.25rem",
                border: "1px solid #dee2e6",
              }}
            >
              <span style={{ fontWeight: "500", color: "#495057" }}>
                {language}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "0.75rem",
                  color: "#6c757d",
                  fontStyle: "italic",
                }}
              >
                (automatic)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bonus Languages */}
      {maxBonusLanguages > 0 && (
        <div>
          <h5 style={{ marginBottom: "0.5rem" }}>
            Bonus Languages
            {maxBonusLanguages > 0 && (
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "normal",
                  color: "#6c757d",
                }}
              >
                ({bonusLanguages.length}/{maxBonusLanguages} used)
              </span>
            )}
          </h5>

          {bonusLanguages.length === 0 && maxBonusLanguages > 0 && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6c757d",
                fontStyle: "italic",
                marginBottom: "1rem",
              }}
            >
              Your Intelligence bonus allows you to learn {maxBonusLanguages}{" "}
              additional language{maxBonusLanguages > 1 ? "s" : ""}.
            </p>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            {bonusLanguages.map((language, index) => (
              <div
                key={`bonus-${index}`}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <TextInput
                  value={language}
                  onChange={(value) => handleLanguageChange(index, value)}
                  placeholder="Enter language name"
                  maxLength={30}
                  aria-label={`Bonus language ${index + 1}`}
                />
                <Button
                  onClick={() => handleRemoveLanguage(index)}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "0.25rem",
                    fontSize: "0.875rem",
                    minWidth: "auto",
                  }}
                  aria-label={`Remove language ${index + 1}`}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          {remainingSlots > 0 && (
            <Button
              onClick={handleAddLanguage}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "0.25rem",
                fontSize: "0.875rem",
              }}
            >
              <span style={{ fontSize: "1rem", fontWeight: "bold" }}>+</span>
              Add Language ({remainingSlots} remaining)
            </Button>
          )}
        </div>
      )}

      {maxBonusLanguages === 0 && (
        <div style={{ marginTop: "1rem" }}>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6c757d",
              fontStyle: "italic",
            }}
          >
            Your Intelligence score ({character.abilities.intelligence.value})
            does not provide any bonus languages. You need Intelligence 13+ to
            learn additional languages.
          </p>
        </div>
      )}

      {/* Common bonus languages suggestion */}
      {maxBonusLanguages > 0 && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            backgroundColor: "#e9ecef",
            borderRadius: "0.25rem",
          }}
        >
          <h6 style={{ margin: "0 0 0.5rem 0", color: "#495057" }}>
            Common Languages to Consider:
          </h6>
          <p style={{ fontSize: "0.75rem", color: "#6c757d", margin: 0 }}>
            Orcish, Goblin, Kobold, Gnoll, Draconic, Giant, Alignment tongues
            (Lawful, Chaotic), or other regional languages as determined by your
            GM.
          </p>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
