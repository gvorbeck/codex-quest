import { useRoute } from "wouter";
import { useEffect, useState, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Breadcrumb } from "@/components/ui";
import type { Character } from "@/types/character";

export default function CharacterSheet() {
  const [, params] = useRoute("/u/:userId/c/:characterId");
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: character?.name || "Character", current: true },
    ],
    [character?.name]
  );

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

  console.log(character);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <h1 className="text-3xl font-bold text-primary-100">
          {character.name}
        </h1>
      </header>

      {/* This is a basic character sheet that will be expanded later */}
      <div className="bg-primary-800 rounded-lg p-6 border border-primary-700">
        <p className="text-primary-300">
          Character sheet for {character.name} will be displayed here.
        </p>
      </div>
    </div>
  );
}
