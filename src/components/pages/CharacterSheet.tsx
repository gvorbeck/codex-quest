import { useRoute } from "wouter";
import { useMemo, useCallback } from "react";
import { allClasses } from "@/data/classes";
import { Breadcrumb, HorizontalRule } from "@/components/ui/display";
import { PageWrapper } from "@/components/ui/layout";
import { LoadingState } from "@/components/ui/feedback/LoadingState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Callout from "@/components/ui/feedback/Callout";
import { Typography } from "@/components/ui/design-system";
import {
  AttackBonuses,
  HitPoints,
  SavingThrows,
  ThiefSkills,
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
  ScrollCreation,
} from "@/components/character/sheet";
import { useFirebaseSheet } from "@/hooks/useFirebaseSheet";
import { useDiceRoller } from "@/hooks/useDiceRoller";
import { calculateModifier } from "@/utils/characterCalculations";
import { logger } from "@/utils/logger";
import type { Character } from "@/types/character";
import {
  canCastSpells,
  hasCantrips,
  hasSpells,
} from "@/utils/characterHelpers";
import { cn } from "@/constants";

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

  // Check if character has any classes with skills
  const hasSkills = useMemo(() => {
    if (!character?.class) return false;

    return character.class.some((classId) => {
      const classData = allClasses.find((cls) => cls.id === classId);
      return classData?.skills !== undefined;
    });
  }, [character?.class]);

  // Handle XP changes
  const handleXPChange = useCallback(
    (newXP: number) => {
      if (character) {
        const updatedCharacter = { ...character, xp: newXP };
        updateCharacter(updatedCharacter);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateCharacter]
  );

  // Handle character changes (for avatar, etc.)
  const handleCharacterChange = useCallback(
    async (updatedCharacter: Character) => {
      logger.debug("CharacterSheet: handleCharacterChange called with:", {
        oldLevel: character?.level,
        newLevel: updatedCharacter.level,
        oldMaxHp: character?.hp.max,
        newMaxHp: updatedCharacter.hp.max,
      });
      logger.debug("CharacterSheet: About to call updateCharacter...");
      await updateCharacter(updatedCharacter);
      logger.debug("CharacterSheet: updateCharacter completed");
    },
    [updateCharacter, character?.level, character?.hp.max]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleCharacterChange]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleCharacterChange]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleCharacterChange]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleCharacterChange]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleCharacterChange]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleCharacterChange]
  );

  // Data loading is now handled by useFirebaseSheet hook
  if (loading) {
    return <LoadingState message="Loading character..." />;
  }

  if (error) {
    return (
      <PageWrapper>
        <Callout variant="error" title="Error loading character">
          {error}
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
          <div className="flex items-center justify-between mb-4">
            <Breadcrumb items={breadcrumbItems} />
            {isUpdating && (
              <LoadingSpinner message="Saving..." size="sm" />
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
