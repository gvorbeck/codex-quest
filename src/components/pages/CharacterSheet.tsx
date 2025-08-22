import { useRoute } from "wouter";
import { useEffect, useState, useMemo } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Breadcrumb,
  Hero,
  ExperiencePoints,
  AbilityScores,
} from "@/components/ui";
import AttackBonuses from "@/components/features/AttackBonuses";
import { useAuth } from "@/hooks/useAuth";
import { allClasses } from "@/data/classes";
import { calculateModifier } from "@/utils/gameUtils";
import type { Character } from "@/types/character";

export default function CharacterSheet() {
  const [, params] = useRoute("/u/:userId/c/:characterId");
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: character?.name || "Character", current: true },
    ],
    [character?.name]
  );

  // Check if the current user owns this character
  const isOwner = useMemo(() => {
    return user && params?.userId === user.uid;
  }, [user, params?.userId]);

  // Handle XP changes
  const handleXPChange = (newXP: number) => {
    if (character) {
      setCharacter({ ...character, xp: newXP });
    }
  };

  // Handle character changes (for avatar, etc.)
  const handleCharacterChange = async (updatedCharacter: Character) => {
    if (!params?.userId || !params?.characterId || !isOwner) {
      return;
    }

    try {
      // Update local state immediately for responsiveness
      setCharacter(updatedCharacter);

      // Update Firebase
      const characterRef = doc(
        db,
        "users",
        params.userId,
        "characters",
        params.characterId
      );

      // Create a clean object without the id field for Firebase
      const characterData = { ...updatedCharacter };
      if ("id" in characterData) {
        delete characterData.id;
      }
      await updateDoc(characterRef, characterData);
    } catch (err) {
      console.error("Error updating character:", err);
      // Revert local state on error
      setCharacter(character);
    }
  };

  // Handle ability score changes
  const handleAbilityChange = (abilityKey: string, value: number) => {
    if (!character) return;

    const updatedCharacter = {
      ...character,
      abilities: {
        ...character.abilities,
        [abilityKey]: {
          value: value,
          modifier: calculateModifier(value)
        }
      }
    };

    handleCharacterChange(updatedCharacter);
  };

  useEffect(() => {
    const loadCharacter = async () => {
      if (!params?.userId || !params?.characterId) {
        setError("Invalid character URL");
        setLoading(false);
        return;
      }

      try {
        const characterRef = doc(
          db,
          "users",
          params.userId,
          "characters",
          params.characterId
        );
        const characterSnap = await getDoc(characterRef);

        if (characterSnap.exists()) {
          const characterData = {
            id: characterSnap.id,
            ...characterSnap.data(),
          } as Character & { id: string };
          setCharacter(characterData);
        } else {
          setError("Character not found");
        }
      } catch (err) {
        console.error("Error loading character:", err);
        setError("Failed to load character");
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [params?.userId, params?.characterId]);

  if (loading) {
    return (
      <div className="text-center py-8" role="status" aria-live="polite">
        <p className="text-zinc-400">Loading character...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8" role="alert">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400">Character not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
      </header>

      {/* Hero section with character avatar and basic info */}
      <Hero
        character={character}
        className="mb-8"
        editable={!!isOwner}
        onCharacterChange={handleCharacterChange}
      />

      {/* Character Sheet Content */}
      <div className="space-y-6">
        {/* Main Character Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Ability Scores */}
          <section className="lg:col-span-1" aria-labelledby="ability-scores-heading">
            <AbilityScores 
              character={character} 
              editable={!!isOwner}
              onAbilityChange={handleAbilityChange}
            />
          </section>

          {/* Experience and Combat Stats */}
          <section className="lg:col-span-3 space-y-6" aria-labelledby="character-stats-heading">
            <h2 id="character-stats-heading" className="sr-only">Character Statistics</h2>
            
            <ExperiencePoints
              character={character}
              classes={allClasses}
              editable={!!isOwner}
              onChange={handleXPChange}
            />

            <AttackBonuses character={character} />
          </section>
        </div>

        {/* Equipment */}
        {/* {character.equipment.length > 0 && (
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
              Equipment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {character.equipment.map((item, index) => (
                <div key={index} className="bg-zinc-700 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-zinc-100">{item.name}</h3>
                    {item.amount > 1 && (
                      <span className="text-sm text-zinc-400">
                        × {item.amount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400">
                    {item.costValue} {item.costCurrency} • {item.weight} lbs
                  </p>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
