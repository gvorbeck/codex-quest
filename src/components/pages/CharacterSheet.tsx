import { useRoute } from "wouter";
import { useEffect, useState, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Breadcrumb, Hero, ExperienceTracker } from "@/components/ui";
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
      <Hero character={character} className="mb-8" />

      {/* Character Sheet Content */}
      <div className="space-y-6">
        {/* Basic Character Info */}
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">
            Character Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-1">Level</h3>
              <p className="text-lg font-semibold text-zinc-100">
                {character.level}
              </p>
            </div> */}
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-1">
                Experience Points
              </h3>
              {isOwner ? (
                <ExperienceTracker
                  character={character}
                  classes={allClasses}
                  onChange={handleXPChange}
                />
              ) : (
                <p className="text-lg font-semibold text-zinc-100">
                  {character.xp} XP
                </p>
              )}
            </div>
            {/* <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-1">Hit Points</h3>
              <p className="text-lg font-semibold text-zinc-100">
                {character.hp.current} / {character.hp.max} HP
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-1">Gold</h3>
              <p className="text-lg font-semibold text-zinc-100">{character.currency.gold} gp</p>
            </div> */}
          </div>
        </div>

        {/* Ability Scores */}
        {/* <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">
            Ability Scores
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(character.abilities).map(([ability, score]) => (
              <div key={ability} className="text-center">
                <h3 className="text-sm font-medium text-zinc-400 mb-1 capitalize">
                  {ability}
                </h3>
                <div className="bg-zinc-700 rounded-lg p-3">
                  <p className="text-xl font-bold text-zinc-100">
                    {score.value}
                  </p>
                  <p className="text-sm text-zinc-300">
                    {score.modifier >= 0 ? "+" : ""}
                    {score.modifier}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

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
