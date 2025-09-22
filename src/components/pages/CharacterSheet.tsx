import { useRoute } from "wouter";
import { useMemo, useCallback } from "react";
import { allClasses } from "@/data";
import { Breadcrumb, HorizontalRule } from "@/components/ui/composite";
import { PageWrapper } from "@/components/ui/core/layout";
import { LoadingState } from "@/components/ui/core/feedback";
import Callout from "@/components/ui/core/feedback/Callout";
import { Typography } from "@/components/ui/core/display";
import AttackBonuses from "@/components/features/character/sheet/AttackBonuses";
import HitPoints from "@/components/features/character/sheet/HitPoints";
import SavingThrows from "@/components/features/character/sheet/SavingThrows";
import ThiefSkills from "@/components/features/character/sheet/ClassSkills";
import CharacterDefense from "@/components/features/character/sheet/CharacterDefense";
import SpecialsRestrictions from "@/components/features/character/sheet/SpecialsRestrictions";
import CoinPurse from "@/components/features/character/sheet/CoinPurse";
import Weight from "@/components/features/character/sheet/Weight";
import Spells from "@/components/features/character/sheet/Spells";
import ExperiencePoints from "@/components/features/character/sheet/ExperiencePoints";
import AbilityScores from "@/components/features/character/sheet/AbilityScores";
import Hero from "@/components/features/character/sheet/Hero";
import Equipment from "@/components/features/character/sheet/Equipment";
import CharacterDescription from "@/components/features/character/sheet/CharacterDescription";
import ScrollCreation from "@/components/features/character/sheet/scroll-creation/ScrollCreation";
import { useEnhancedCharacterSheet } from "@/hooks/queries/useEnhancedQueries";
import { useCharacterMutations } from "@/hooks/mutations/useEnhancedMutations";
import { useDiceRoller } from "@/hooks/dice/useDiceRoller";
import type { Character, Equipment as EquipmentItem } from "@/types";
import {
  canCastSpells,
  hasCantrips,
  hasSpells,
  calculateModifier,
  getClassById,
  logger,
  cn,
} from "@/utils";

export default function CharacterSheet() {
  const [, params] = useRoute("/u/:userId/c/:characterId");

  // Use the enhanced character sheet hook and mutations
  const characterQuery = useEnhancedCharacterSheet(params?.userId || "", params?.characterId || "");
  const { saveCharacter, isSaving } = useCharacterMutations();

  const character = characterQuery.data?.character;
  const isOwner = characterQuery.data?.isOwner || false;
  const loading = characterQuery.isLoading;
  const error = characterQuery.error;

  // Use the dice roller hook
  const { DiceRollerFAB, DiceRollerModal } = useDiceRoller();

  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: character?.name || "Character", current: true },
    ],
    [character?.name]
  );

  // Check if character has any classes with skills
  const hasSkills = useMemo(() => {
    if (!character?.class) return false;

    return character.class.some((classId: string) => {
      const classData = getClassById(classId);
      return classData?.skills !== undefined;
    });
  }, [character?.class]);

  // Handle XP changes
  const handleXPChange = useCallback(
    (newXP: number) => {
      if (character && params?.userId && params?.characterId) {
        const updatedCharacter = { ...character, xp: newXP };
        saveCharacter({
          userId: params.userId,
          character: updatedCharacter,
          characterId: params.characterId,
        });
      }
    },
    [character, saveCharacter, params?.userId, params?.characterId]
  );

  // Handle character changes (for avatar, etc.)
  const handleCharacterChange = useCallback(
    (updatedCharacter: Character) => {
      if (params?.userId && params?.characterId) {
        saveCharacter({
          userId: params.userId,
          character: updatedCharacter,
          characterId: params.characterId,
        });
      }
    },
    [saveCharacter, params?.userId, params?.characterId]
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
            value,
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

  // Handle equipment updates
  const handleEquipmentChange = useCallback(
    (newEquipment: EquipmentItem[]) => {
      if (!character) return;

      const updatedCharacter = {
        ...character,
        equipment: newEquipment,
      };

      handleCharacterChange(updatedCharacter);
    },
    [character, handleCharacterChange]
  );

  // Handle HP notes change
  const handleHPNotesChange = useCallback(
    (desc: string) => {
      if (!character) return;

      const updatedCharacter = {
        ...character,
        hp: {
          ...character.hp,
          desc,
        },
      };

      handleCharacterChange(updatedCharacter);
    },
    [character, handleCharacterChange]
  );

  // Handle character description change
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
      <PageWrapper>
        <Callout variant="error" title="Error loading character">
          {error?.message || "An unexpected error occurred"}
        </Callout>
      </PageWrapper>
    );
  }

  if (!character) {
    return (
      <PageWrapper>
        <Callout variant="warning" title="Character not found">
          The character you're looking for doesn't exist or has been deleted.
        </Callout>
      </PageWrapper>
    );
  }

  const spellsEquipmentClassNames = cn(
    `grid grid-cols-1 gap-6 ${
      hasSpells(character) || hasCantrips(character) || canCastSpells(character)
        ? "lg:grid-cols-2"
        : "lg:grid-cols-1"
    }`
  );

  // Development-only character logging
  if (import.meta.env.DEV) {
    logger.info(JSON.stringify(character));
  }

  return (
    <>
      <PageWrapper>
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4 relative">
            <Breadcrumb items={breadcrumbItems} />
            {isSaving && (
              <LoadingState message="Saving..." variant="overlay" />
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
                {hasSkills && (
                  <div className="break-inside-avoid mb-6">
                    <ThiefSkills character={character} />
                  </div>
                )}
                <div className="break-inside-avoid mb-6">
                  <AttackBonuses character={character} />
                </div>{" "}
                <div className="break-inside-avoid mb-6">
                  <CharacterDefense character={character} />
                </div>
                <div className="break-inside-avoid mb-6">
                  <SpecialsRestrictions
                    character={character}
                    isOwner={isOwner}
                    onCharacterChange={handleCharacterChange}
                  />
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

          {/* Scroll Creation Section - only show for Spellcrafters */}
          {character.class.includes("spellcrafter") && (
            <ScrollCreation
              character={character}
              onCharacterChange={handleCharacterChange}
              isOwner={isOwner}
            />
          )}

          {/* Spells & Equipment Section - side-by-side on larger screens when both present */}
          <div className={spellsEquipmentClassNames}>
            {/* Spells & Cantrips Section - only show if character has spells/cantrips or is a custom class that uses magic */}
            {(hasSpells(character) ||
              hasCantrips(character) ||
              canCastSpells(character)) && (
              <div className="break-inside-avoid">
                <Spells
                  character={character}
                  onCharacterChange={handleCharacterChange}
                  isOwner={isOwner}
                />
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
