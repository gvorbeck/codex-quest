import React, { useMemo } from "react";
import { SimpleRoller, Button } from "@/components/ui";
import { allClasses } from "@/data/classes";
import type { Character } from "@/types/character";

interface HitPointsStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

const HitPointsStep: React.FC<HitPointsStepProps> = ({
  character,
  onCharacterChange,
}) => {
  // Find the hit die for the character's class(es)
  const hitDie = useMemo(() => {
    if (character.class.length === 0) return null;

    // For combination classes, use the first class's hit die
    const primaryClassId = character.class[0];
    const primaryClass = allClasses.find((cls) => cls.id === primaryClassId);

    return primaryClass?.hitDie || null;
  }, [character.class]);

  // Calculate maximum possible HP for the hit die
  const maxPossibleHP = useMemo(() => {
    if (!hitDie) return 0;

    try {
      // Extract the die size from the formula (e.g., "1d8" -> 8)
      const match = hitDie.match(/\d*d(\d+)/);
      if (match && match[1]) {
        const dieSize = parseInt(match[1], 10);
        return dieSize + (character.abilities.constitution.modifier || 0);
      }
    } catch (error) {
      console.error("Failed to parse hit die:", error);
    }

    return 0;
  }, [hitDie, character.abilities.constitution.modifier]);

  // Calculate minimum possible HP (always at least 1)
  const minPossibleHP = useMemo(() => {
    const constitutionBonus = character.abilities.constitution.modifier || 0;
    return Math.max(1, 1 + constitutionBonus);
  }, [character.abilities.constitution.modifier]);

  const handleHPChange = (hp: number | undefined) => {
    if (hp === undefined) return;

    // Ensure minimum HP is always 1
    const finalHP = Math.max(1, hp);

    onCharacterChange({
      ...character,
      hp: {
        current: finalHP,
        max: finalHP,
      },
    });
  };

  const handleMaxHP = () => {
    const maxHP = Math.max(1, maxPossibleHP);
    onCharacterChange({
      ...character,
      hp: {
        current: maxHP,
        max: maxHP,
      },
    });
  };

  if (!hitDie) {
    return (
      <div className="hit-points-step">
        <h3>Hit Points</h3>
        <p>Please select a class first to determine your hit points.</p>
      </div>
    );
  }

  const constitutionBonus = character.abilities.constitution.modifier || 0;
  const constitutionText =
    constitutionBonus > 0
      ? ` + ${constitutionBonus} (Constitution bonus)`
      : constitutionBonus < 0
      ? ` ${constitutionBonus} (Constitution penalty)`
      : "";

  return (
    <div className="hit-points-step">
      <h3>Hit Points</h3>
      <p>
        Roll your starting hit points using your class's hit die:{" "}
        <strong>{hitDie}</strong>
        {constitutionText && <span>{constitutionText}</span>}
      </p>

      <div
        className="hp-controls"
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <SimpleRoller
          formula={`${hitDie}${
            constitutionBonus >= 0 ? "+" : ""
          }${constitutionBonus}`}
          label="Hit Points"
          {...(character.hp.max > 0 && { initialValue: character.hp.max })}
          minValue={minPossibleHP}
          maxValue={maxPossibleHP}
          onChange={handleHPChange}
          containerProps={{
            style: { flexGrow: 1 },
          }}
        />

        <Button
          type="button"
          onClick={handleMaxHP}
          style={{ whiteSpace: "nowrap" }}
        >
          Use Max HP ({maxPossibleHP})
        </Button>
      </div>

      {character.hp.max > 0 && (
        <div
          className="hp-summary"
          style={{
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "0.25rem",
            border: "1px solid #ddd",
          }}
        >
          <h4>Current Hit Points</h4>
          <p>
            <strong>{character.hp.current}</strong> /{" "}
            <strong>{character.hp.max}</strong> HP
          </p>
          {constitutionBonus !== 0 && (
            <p style={{ fontSize: "0.875rem", color: "#666" }}>
              Base roll: {character.hp.max - constitutionBonus}, Constitution
              modifier: {constitutionBonus >= 0 ? "+" : ""}
              {constitutionBonus}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HitPointsStep;
