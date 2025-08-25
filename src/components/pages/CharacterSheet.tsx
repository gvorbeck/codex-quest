import { useRoute } from "wouter";
import { useEffect, useState, useMemo } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FIREBASE_COLLECTIONS } from "@/constants/firebase";
import { Breadcrumb, HorizontalRule } from "@/components/ui/display";
import { PageWrapper } from "@/components/ui/layout";
import {
  AttackBonuses,
  HitPoints,
  SavingThrows,
  CharacterDefense,
  SpecialsRestrictions,
  CoinPurse,
  Weight,
  Spells,
  ExperiencePoints,
  AbilityScores,
  Hero,
  Equipment,
  CharacterDescription,
} from "@/components/character/sheet";
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
        FIREBASE_COLLECTIONS.USERS,
        params.userId,
        FIREBASE_COLLECTIONS.CHARACTERS,
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
          modifier: calculateModifier(value),
        },
      },
    };

    handleCharacterChange(updatedCharacter);
  };

  // Handle HP changes
  const handleCurrentHPChange = (value: number) => {
    if (!character) return;

    const updatedCharacter = {
      ...character,
      hp: {
        ...character.hp,
        current: value,
      },
    };

    handleCharacterChange(updatedCharacter);
  };

  const handleHPNotesChange = (value: string) => {
    if (!character) return;

    const updatedCharacter = {
      ...character,
      hp: {
        ...character.hp,
        desc: value,
      },
    };

    handleCharacterChange(updatedCharacter);
  };

  // Handle currency changes
  const handleCurrencyChange = (updates: Partial<Character["currency"]>) => {
    if (!character) return;

    const updatedCharacter = {
      ...character,
      currency: {
        ...character.currency,
        ...updates,
      },
    };

    handleCharacterChange(updatedCharacter);
  };

  // Handle equipment changes
  const handleEquipmentChange = (equipment: Character["equipment"]) => {
    if (!character) return;

    const updatedCharacter = {
      ...character,
      equipment,
    };

    handleCharacterChange(updatedCharacter);
  };

  // Handle description changes
  const handleDescriptionChange = (desc: string) => {
    if (!character) return;

    const updatedCharacter = {
      ...character,
      desc,
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
          FIREBASE_COLLECTIONS.USERS,
          params.userId,
          FIREBASE_COLLECTIONS.CHARACTERS,
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
      <div className="status-message" role="status" aria-live="polite">
        <p className="text-zinc-400">Loading character...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-message" role="alert">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="status-message">
        <p className="text-zinc-400">Character not found</p>
      </div>
    );
  }

  console.log(`
⚔️  ═══════════════════════════════════════════════════════════════════════════════
🛡️   CHARACTER SHEET DEBUG | ${character.name?.toUpperCase() || 'UNNAMED HERO'}
⚔️  ═══════════════════════════════════════════════════════════════════════════════
`, character);

  return (
    <PageWrapper>
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
          <section
            className="lg:col-span-1"
            aria-labelledby="ability-scores-heading"
          >
            <AbilityScores
              character={character}
              editable={!!isOwner}
              onAbilityChange={handleAbilityChange}
            />
          </section>

          {/* Experience and Combat Stats */}
          <section
            className="lg:col-span-3"
            aria-labelledby="character-stats-heading"
          >
            <h2 id="character-stats-heading" className="sr-only">
              Character Statistics
            </h2>

            {/* Masonry-style layout for cards */}
            <div className="columns-1 md:columns-2 gap-6 space-y-6 md:space-y-0">
              <div className="break-inside-avoid mb-6">
                <ExperiencePoints
                  character={character}
                  classes={allClasses}
                  editable={!!isOwner}
                  onChange={handleXPChange}
                />
              </div>

              <div className="break-inside-avoid mb-6">
                <HitPoints
                  character={character}
                  editable={!!isOwner}
                  onCurrentHPChange={handleCurrentHPChange}
                  onHPNotesChange={handleHPNotesChange}
                />
              </div>

              <div className="break-inside-avoid mb-6">
                <SavingThrows character={character} />
              </div>

              <div className="break-inside-avoid mb-6">
                <AttackBonuses character={character} />
              </div>

              <div className="break-inside-avoid mb-6">
                <CharacterDefense character={character} />
              </div>

              <div className="break-inside-avoid mb-6">
                <SpecialsRestrictions character={character} />
              </div>
            </div>
          </section>
        </div>

        {/* Horizontal Rule */}
        <HorizontalRule />

        {/* Additional Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="break-inside-avoid">
            <CoinPurse
              character={character}
              editable={!!isOwner}
              onCurrencyChange={handleCurrencyChange}
            />
          </div>
          <div className="break-inside-avoid">
            <Weight character={character} />
          </div>
        </div>

        {/* Spells & Cantrips Section */}
        <Spells character={character} />

        {/* Equipment Section */}
        <Equipment 
          character={character}
          editable={!!isOwner}
          onEquipmentChange={handleEquipmentChange}
        />

        {/* Character Description Section */}
        <CharacterDescription
          character={character}
          editable={!!isOwner}
          onDescriptionChange={handleDescriptionChange}
          size="lg"
        />
      </div>
    </PageWrapper>
  );
}
