import { useRoute } from "wouter";
import { useMemo, useCallback } from "react";
import { Breadcrumb, HorizontalRule } from "@/components/ui/display";
import { PageWrapper } from "@/components/ui/layout";
import { LoadingState } from "@/components/ui/feedback/LoadingState";
import { Typography } from "@/components/ui/design-system";
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
import { useFirebaseSheet } from "@/hooks/useFirebaseSheet";
import { useDiceRoller } from "@/hooks/useDiceRoller";
import { allClasses } from "@/data/classes";
import { calculateModifier } from "@/utils/gameUtils";
import type { Character } from "@/types/character";

export default function CharacterSheet() {
  const [, params] = useRoute("/u/:userId/c/:characterId");

  // Use the generic Firebase sheet hook
  const {
    data: character,
    loading,
    error,
    isOwner,
    isUpdating,
    updateEntity: updateCharacter,
  } = useFirebaseSheet<Character>({
    userId: params?.userId,
    entityId: params?.characterId,
    collection: "CHARACTERS",
  });

  // Use the dice roller hook
  const { DiceRollerFAB, DiceRollerModal } = useDiceRoller();

  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: character?.name || "Character", current: true },
    ],
    [character?.name]
  );

  // Handle XP changes
  const handleXPChange = useCallback(
    (newXP: number) => {
      if (character) {
        const updatedCharacter = { ...character, xp: newXP };
        updateCharacter(updatedCharacter);
      }
    },
    [character, updateCharacter]
  );

  // Handle character changes (for avatar, etc.)
  const handleCharacterChange = useCallback(
    async (updatedCharacter: Character) => {
      console.log("CharacterSheet: handleCharacterChange called with:", {
        oldLevel: character?.level,
        newLevel: updatedCharacter.level,
        oldMaxHp: character?.hp.max,
        newMaxHp: updatedCharacter.hp.max,
      });
      console.log("CharacterSheet: About to call updateCharacter...");
      await updateCharacter(updatedCharacter);
      console.log("CharacterSheet: updateCharacter completed");
    },
    [updateCharacter, character]
  );

  // Handle ability score changes
  const handleAbilityChange = useCallback(
    (abilityKey: string, value: number) => {
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
    },
    [character, handleCharacterChange]
  );

  // Handle HP changes
  const handleCurrentHPChange = useCallback(
    (value: number) => {
      if (!character) return;

      const updatedCharacter = {
        ...character,
        hp: {
          ...character.hp,
          current: value,
        },
      };

      handleCharacterChange(updatedCharacter);
    },
    [character, handleCharacterChange]
  );

  // Handle currency changes
  const handleCurrencyChange = useCallback(
    (updates: Partial<Character["currency"]>) => {
      if (!character) return;

      const updatedCharacter = {
        ...character,
        currency: {
          ...character.currency,
          ...updates,
        },
      };

      handleCharacterChange(updatedCharacter);
    },
    [character, handleCharacterChange]
  );

  // Handle equipment changes
  const handleEquipmentChange = useCallback(
    (equipment: Character["equipment"]) => {
      if (!character) return;

      const updatedCharacter = {
        ...character,
        equipment,
      };

      handleCharacterChange(updatedCharacter);
    },
    [character, handleCharacterChange]
  );

  // Handle HP notes changes
  const handleHPNotesChange = useCallback(
    (value: string) => {
      if (!character) return;

      const updatedCharacter = {
        ...character,
        hp: {
          ...character.hp,
          desc: value,
        },
      };

      handleCharacterChange(updatedCharacter);
    },
    [character, handleCharacterChange]
  );

  // Handle description changes
  const handleDescriptionChange = useCallback(
    (desc: string) => {
      if (!character) return;

      const updatedCharacter = {
        ...character,
        desc,
      };

      handleCharacterChange(updatedCharacter);
    },
    [character, handleCharacterChange]
  );

  // Data loading is now handled by useFirebaseSheet hook

  if (loading) {
    return <LoadingState message="Loading character..." />;
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

  console.log(
    `
⚔️  ═══════════════════════════════════════════════════════════════════════════════
🛡️   CHARACTER SHEET DEBUG | ${character.name?.toUpperCase() || "UNNAMED HERO"}
⚔️  ═══════════════════════════════════════════════════════════════════════════════
`,
    character
  );

  return (
    <>
      <PageWrapper>
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Breadcrumb items={breadcrumbItems} />
            {isUpdating && (
              <div className="flex items-center gap-2 text-sm text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                <span>Saving...</span>
              </div>
            )}
          </div>
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
              <Typography
                variant="h2"
                as="h2"
                id="character-stats-heading"
                className="sr-only"
              >
                Character Statistics
              </Typography>

              {/* Masonry-style layout for cards */}
              <div className="columns-1 md:columns-2 gap-6 space-y-6 md:space-y-0">
                <div className="break-inside-avoid mb-6">
                  <ExperiencePoints
                    character={character}
                    classes={allClasses}
                    editable={!!isOwner}
                    onChange={handleXPChange}
                    onCharacterChange={handleCharacterChange}
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
                </div>{" "}
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

          {/* Spells & Equipment Section - side-by-side on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spells & Cantrips Section - only show if character has spells or cantrips */}
            {(character.spells?.length || character.cantrips?.length) && (
              <div className="break-inside-avoid">
                <Spells character={character} />
              </div>
            )}

            {/* Equipment Section */}
            <div className="break-inside-avoid">
              <Equipment
                character={character}
                editable={!!isOwner}
                onEquipmentChange={handleEquipmentChange}
              />
            </div>
          </div>

          {/* Horizontal Rule */}
          <HorizontalRule />

          {/* Character Description Section */}
          <CharacterDescription
            character={character}
            editable={!!isOwner}
            onDescriptionChange={handleDescriptionChange}
            size="lg"
          />
        </div>

        {/* Dice Roller Modal */}
        <DiceRollerModal />
      </PageWrapper>

      {/* Dice Roller FAB */}
      <DiceRollerFAB />
    </>
  );
}
