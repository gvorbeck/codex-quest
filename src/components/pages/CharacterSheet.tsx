import { useRoute } from "wouter";
import { useEffect, useState, useMemo } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Breadcrumb,
  Hero,
  ExperienceTracker,
  Details,
  AbilityScores,
  Tooltip,
} from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { allClasses } from "@/data/classes";
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
    
    const calculateModifier = (score: number): number => {
      return Math.floor((score - 10) / 2);
    };

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
      <div className="text-center py-8">
        <p className="text-primary-400">Loading character...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="text-center py-8">
        <p className="text-primary-400">Character not found</p>
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
        {/* Character Details and Experience */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Character Details */}
          <Details
            layout="horizontal"
            items={[
              {
                label: "Race",
                children: <span className="capitalize">{character.race}</span>,
              },
              {
                label: "Class",
                children: (
                  <span className="capitalize">
                    {Array.isArray(character.class)
                      ? character.class.join(" / ")
                      : character.class}
                  </span>
                ),
              },
              {
                label: "Level",
                children: character.level,
              },
            ]}
          />

          {/* Experience Points */}
          <div className="bg-zinc-800 border-2 border-zinc-600 rounded-lg shadow-[0_3px_0_0_#3f3f46] transition-all duration-150 p-4">
            <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
              Experience Points
              <Tooltip content="Try: +100, -50, or enter a number directly">
                <svg
                  className="w-4 h-4 text-zinc-500 hover:text-zinc-300 cursor-help"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Tooltip>
            </h3>
            {isOwner ? (
              <ExperienceTracker
                character={character}
                classes={allClasses}
                onChange={handleXPChange}
              />
            ) : (
              <p className="text-base font-semibold text-zinc-100">
                {character.xp} XP
              </p>
            )}
          </div>
        </div>

        {/* Ability Scores */}
        <AbilityScores 
          character={character} 
          className="mb-6" 
          editable={!!isOwner}
          onAbilityChange={handleAbilityChange}
        />

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
