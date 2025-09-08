import { useState, useCallback, useMemo } from "react";
import Modal from "../base/Modal";
import { Button } from "@/components/ui/inputs";
import { Typography } from "@/components/ui/design-system";
import { Icon, List, StepListItem } from "@/components/ui/display";
import { SectionWrapper } from "@/components/ui/layout";
import { LoadingState } from "@/components/ui/feedback";
import { useNotifications } from "@/hooks/useNotifications";
import { parseCreatureName, generateDefaultAC, getRandomTableResult, rollForEncounter, delay, SPELL_CONSTANTS } from "@/utils/spellSystem";
import type { GameCombatant } from "@/types/game";

interface EncounterGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCombat?: (combatant: GameCombatant) => void;
  onOpenCombatTracker?: () => void;
}

/**
 * EncounterGeneratorModal - Generate random encounters based on BFRPG rules
 *
 * Features:
 * - Dungeon encounters (levels 1-8+)
 * - Wilderness encounters (Desert/Barren, Grassland, Inhabited Territories, Jungle, Mountains/Hills, Ocean, River/Riverside, Swamp, Woods/Forest)
 * - City/Town/Village encounters (Day and Night)
 * - Proper encounter frequency rules (1 in 6 for dungeons, 1 in 6 for wilderness)
 */

// Local constants for encounter generation (extending shared ones)
const ENCOUNTER_CONSTANTS = {
  ...SPELL_CONSTANTS, // Use shared constants
  // Add any encounter-specific constants here if needed
} as const;

// Encounter Tables from BFRPG Rules
const DUNGEON_ENCOUNTERS = {
  "Level 1": [
    "Bee, Giant",
    "Goblin",
    "Jelly, Green*",
    "Kobold",
    "NPC Party: Adventurer",
    "NPC Party: Bandit",
    "Orc",
    "Stirge",
    "Skeleton",
    "Snake, Cobra",
    "Spider, Giant Crab",
    "Wolf",
  ],
  "Level 2": [
    "Beetle, Giant Bombardier",
    "Fly, Giant",
    "Ghoul",
    "Gnoll",
    "Jelly, Gray",
    "Hobgoblin",
    "Lizard Man",
    "NPC Party: Adventurer",
    "Snake, Pit Viper",
    "Spider, Giant Black Widow",
    "Lizard Man, Subterranean",
    "Zombie",
  ],
  "Level 3": [
    "Ant, Giant",
    "Ape, Carnivorous",
    "Beetle, Giant Tiger",
    "Bugbear",
    "Doppleganger",
    "Gargoyle*",
    "Jelly, Glass",
    "Lycanthrope, Wererat*",
    "Ogre",
    "Shadow*",
    "Tentacle Worm",
    "Wight*",
  ],
  "Level 4-5": [
    "Bear, Cave",
    "Caecilia, Giant",
    "Cockatrice",
    "Doppleganger",
    "Jelly, Gray",
    "Hellhound",
    "Rust Monster*",
    "Lycanthrope, Werewolf*",
    "Minotaur",
    "Jelly, Ochre*",
    "Owlbear",
    "Wraith*",
  ],
  "Level 6-7": [
    "Basilisk",
    "Jelly, Black",
    "Caecilia, Giant",
    "Deceiver",
    "Hydra",
    "Rust Monster*",
    "Lycanthrope, Weretiger*",
    "Mummy*",
    "Owlbear",
    "Scorpion, Giant",
    "Spectre*",
    "Troll",
  ],
  "Level 8+": [
    "Basilisk, Greater*",
    "Chimera",
    "Deceiver, Greater",
    "Giant, Hill",
    "Giant, Stone",
    "Hydra",
    "Jelly, Black",
    "Lycanthrope, Wereboar*",
    "Purple Worm",
    "Salamander, Flame*",
    "Salamander, Frost*",
    "Vampire*",
  ],
} as const;

const WILDERNESS_ENCOUNTERS = {
  "Desert or Barren": [
    "Dragon, Desert",
    "Hellhound",
    "Giant, Fire",
    "Purple Worm",
    "Fly, Giant",
    "Scorpion, Giant",
    "Camel",
    "Spider, Giant Tarantula",
    "NPC Party: Merchant",
    "Hawk",
    "NPC Party: Bandit",
    "Ogre",
    "Griffon",
    "Gnoll",
    "Dragon, Mountain",
  ],
  Grassland: [
    "Dragon, Plains",
    "Troll",
    "Fly, Giant",
    "Scorpion, Giant",
    "NPC Party: Bandit",
    "Lion",
    "Boar, Wild",
    "NPC Party: Merchant",
    "Wolf",
    "Bee, Giant",
    "Gnoll",
    "Goblin",
    "Flicker Beast",
    "Wolf, Dire",
    "Giant, Hill",
  ],
  "Inhabited Territories": [
    "Dragon, Cloud",
    "Ghoul",
    "Bugbear",
    "Goblin",
    "Centaur",
    "NPC Party: Bandit",
    "NPC Party: Merchant",
    "NPC Party: Pilgrim",
    "NPC Party: Noble",
    "Dog",
    "Gargoyle*",
    "Gnoll",
    "Ogre",
    "Minotaur",
    "Vampire*",
  ],
  Jungle: [
    "Dragon, Forest",
    "NPC Party: Bandit",
    "Goblin",
    "Hobgoblin",
    "Centipede, Giant",
    "Snake, Giant Python",
    "Elephant",
    "Antelope",
    "Jaguar",
    "Stirge",
    "Beetle, Giant Tiger",
    "Caecilia, Giant",
    "Shadow*",
    "NPC Party: Merchant",
    "Lycanthrope, Weretiger*",
  ],
  "Mountains or Hills": [
    "Dragon, Ice",
    "Roc (1d6: 1-3 Large, 4-5 Huge, 6 Giant)",
    "Deceiver",
    "Lycanthrope, Werewolf*",
    "Mountain Lion",
    "Wolf",
    "Spider, Giant Crab",
    "Hawk",
    "Orc",
    "Bat, Giant",
    "Hawk, Giant",
    "Giant, Hill",
    "Chimera",
    "Wolf, Dire",
    "Dragon, Mountain",
  ],
  Ocean: [
    "Dragon, Sea",
    "Hydra",
    "Whale, Sperm",
    "Crocodile, Giant",
    "Crab, Giant",
    "Whale, Killer",
    "Octopus, Giant",
    "Shark, Mako",
    "NPC Party: Merchant",
    "Shark, Bull",
    "Roc (1d8: 1-5 Huge, 6-8 Giant)",
    "Shark, Great White",
    "Mermaid",
    "Sea Serpent",
  ],
  "River or Riverside": [
    "Dragon, Swamp",
    "Dragon, Swamp",
    "Fish, Giant Piranha",
    "Stirge",
    "Fish, Giant Bass",
    "NPC Party: Merchant",
    "Lizard Man",
    "Crocodile",
    "Frog, Giant",
    "Fish, Giant Catfish",
    "NPC Party: Buccaneer",
    "Troll",
    "Jaguar",
    "Nixie",
    "Water Termite, Giant",
    "Dragon, Forest",
  ],
  Swamp: [
    "Dragon, Swamp",
    "Shadow*",
    "Troll",
    "Lizard, Giant Draco",
    "Centipede, Giant",
    "Leech, Giant",
    "Lizard Man",
    "Crocodile",
    "Stirge",
    "Orc",
    "Toad, Giant (see Frog, Giant)",
    "Lizard Man, Subterranean",
    "Blood Rose",
    "Hangman Tree",
    "Basilisk",
  ],
  "Woods or Forest": [
    "Dragon, Forest",
    "Alicorn (see Unicorn)",
    "Treant",
    "Orc",
    "Boar, Wild",
    "Bear, Black",
    "Hawk, Giant",
    "Antelope",
    "Wolf",
    "Ogre",
    "Bear, Grizzly",
    "Wolf, Dire",
    "Giant, Hill",
    "Owlbear",
    "Unicorn",
  ],
} as const;

const CITY_ENCOUNTERS = {
  "Day Encounter": [
    "Doppleganger",
    "Noble",
    "Thief",
    "Bully",
    "City Watch",
    "Merchant",
    "Beggar",
    "Priest",
    "Mercenary",
    "Wizard",
    "Lycanthrope, Wererat*",
  ],
  "Night Encounter": [
    "Doppleganger",
    "Shadow*",
    "Press Gang",
    "Beggar",
    "Thief",
    "Bully",
    "Merchant",
    "Giant Rat",
    "City Watch",
    "Wizard",
    "Lycanthrope, Wererat*",
  ],
} as const;

type EncounterType = "dungeon" | "wilderness" | "city";
type DungeonLevel = keyof typeof DUNGEON_ENCOUNTERS;
type WildernessType = keyof typeof WILDERNESS_ENCOUNTERS;
type CityType = keyof typeof CITY_ENCOUNTERS;

export default function EncounterGeneratorModal({
  isOpen,
  onClose,
  onAddToCombat,
  onOpenCombatTracker,
}: EncounterGeneratorModalProps) {
  const [encounterType, setEncounterType] = useState<EncounterType>("dungeon");
  const [dungeonLevel, setDungeonLevel] = useState<DungeonLevel>("Level 1");
  const [wildernessType, setWildernessType] =
    useState<WildernessType>("Grassland");
  const [cityType, setCityType] = useState<CityType>("Day Encounter");
  const [currentEncounter, setCurrentEncounter] = useState<string | null>(null);
  const [encounterOccurs, setEncounterOccurs] = useState<boolean | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Memoized hook for notifications
  const { showSuccess, showError, showInfo } = useNotifications();

  // Memoized key arrays for better performance
  const dungeonLevels = useMemo(
    () => Object.keys(DUNGEON_ENCOUNTERS) as DungeonLevel[],
    []
  );
  const wildernessTypes = useMemo(
    () => Object.keys(WILDERNESS_ENCOUNTERS) as WildernessType[],
    []
  );
  const cityTypes = useMemo(
    () => Object.keys(CITY_ENCOUNTERS) as CityType[],
    []
  );

  // Get current encounter table
  const currentTable = useMemo(() => {
    switch (encounterType) {
      case "dungeon":
        return DUNGEON_ENCOUNTERS[dungeonLevel];
      case "wilderness":
        return WILDERNESS_ENCOUNTERS[wildernessType];
      case "city":
        return CITY_ENCOUNTERS[cityType];
      default:
        return [];
    }
  }, [encounterType, dungeonLevel, wildernessType, cityType]);

  // Function to create a combatant from encounter result
  const createCombatantFromEncounter = useCallback(
    (encounterName: string): GameCombatant => {
      return {
        name: parseCreatureName(encounterName),
        ac: generateDefaultAC(),
        initiative: 0, // Will be rolled during combat
        isPlayer: false,
      };
    },
    []
  );

  // Function to add encounter to combat tracker
  const handleAddToCombatTracker = useCallback(() => {
    if (!currentEncounter || !onAddToCombat) return;

    const combatant = createCombatantFromEncounter(currentEncounter);
    onAddToCombat(combatant);

    showSuccess(`${combatant.name} added to Combat Tracker`, {
      title: "Added to Combat",
      duration: 3000,
    });

    // Optionally open the combat tracker
    if (onOpenCombatTracker) {
      setTimeout(() => {
        onOpenCombatTracker();
      }, 500); // Small delay to let the user see the success notification
    }
  }, [
    currentEncounter,
    onAddToCombat,
    onOpenCombatTracker,
    createCombatantFromEncounter,
    showSuccess,
  ]);

  const handleGenerateEncounter = useCallback(async () => {
    if (!currentTable.length) {
      showError("No encounter table available for the selected type.", {
        title: "Generation Error",
      });
      return;
    }

    setIsGenerating(true);
    setCurrentEncounter(null);
    setEncounterOccurs(null);

    try {
      // Simulate rolling for encounter occurrence
      await delay(ENCOUNTER_CONSTANTS.GENERATION_DELAY);

      // Roll 1d6 for encounter check (1 = encounter occurs)
      const encounterHappens = rollForEncounter();

      setEncounterOccurs(encounterHappens);

      if (encounterHappens) {
        // Get a random encounter from the table
        const encounter = getRandomTableResult(currentTable);

        // Add a small delay for UX
        await delay(ENCOUNTER_CONSTANTS.RESULT_DELAY);
        if (encounter) {
          setCurrentEncounter(encounter);
          showSuccess(`Encounter generated: ${encounter}`, {
            title: "Encounter!",
            duration: 5000,
          });
        } else {
          showError("Failed to select encounter from table.", {
            title: "Generation Error",
          });
        }
      } else {
        showInfo("No encounter occurs this time.", {
          title: "Peaceful Travel",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error generating encounter:", error);
      showError(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while generating the encounter.",
        {
          title: "Generation Failed",
          dismissible: true,
        }
      );
      // Reset states on error
      setEncounterOccurs(null);
      setCurrentEncounter(null);
    } finally {
      setIsGenerating(false);
    }
  }, [currentTable, showSuccess, showError, showInfo]);

  const handleTypeChange = useCallback((type: EncounterType) => {
    setEncounterType(type);
    setCurrentEncounter(null);
    setEncounterOccurs(null);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Random Encounter Generator"
      size="md"
    >
      <div className="space-y-6 p-2">
        {/* Encounter Type Selection */}
        <SectionWrapper title="Encounter Type">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Choose encounter type"
          >
            {(["dungeon", "wilderness", "city"] as const).map((type) => (
              <Button
                key={type}
                variant={encounterType === type ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleTypeChange(type)}
                className="capitalize"
                aria-pressed={encounterType === type}
              >
                {type}
              </Button>
            ))}
          </div>
        </SectionWrapper>

        {/* Encounter Subtype Selection */}
        {encounterType === "dungeon" && (
          <SectionWrapper title="Dungeon Level">
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Select dungeon level"
            >
              {dungeonLevels.map((level) => (
                <Button
                  key={level}
                  variant={dungeonLevel === level ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setDungeonLevel(level)}
                  aria-pressed={dungeonLevel === level}
                >
                  {level}
                </Button>
              ))}
            </div>
          </SectionWrapper>
        )}

        {encounterType === "wilderness" && (
          <SectionWrapper title="Terrain Type">
            <div
              className="grid grid-cols-2 gap-2"
              role="group"
              aria-label="Select terrain type"
            >
              {wildernessTypes.map((terrain) => (
                <Button
                  key={terrain}
                  variant={wildernessType === terrain ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setWildernessType(terrain)}
                  className="text-xs"
                  aria-pressed={wildernessType === terrain}
                >
                  {terrain}
                </Button>
              ))}
            </div>
          </SectionWrapper>
        )}

        {encounterType === "city" && (
          <SectionWrapper title="Time of Day">
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Select time of day"
            >
              {cityTypes.map((time) => (
                <Button
                  key={time}
                  variant={cityType === time ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setCityType(time)}
                  aria-pressed={cityType === time}
                >
                  {time}
                </Button>
              ))}
            </div>
          </SectionWrapper>
        )}

        {/* Encounter Rules */}
        <SectionWrapper title="Encounter Rules">
          <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
            <Typography variant="bodySmall" color="secondary">
              <strong>Encounter Check:</strong> Roll 1d6, encounter occurs on a
              roll of 1
            </Typography>
            {encounterType === "dungeon" && (
              <Typography variant="bodySmall" color="muted">
                <strong>Dungeon:</strong> Check every 3 turns or when
                circumstances warrant
              </Typography>
            )}
            {encounterType === "wilderness" && (
              <Typography variant="bodySmall" color="muted">
                <strong>Wilderness:</strong> Check every 4 hours (3 night
                checks, 3 day checks)
              </Typography>
            )}
            {encounterType === "city" && (
              <Typography variant="bodySmall" color="muted">
                <strong>City:</strong> Check as needed based on area and time
              </Typography>
            )}
          </div>
        </SectionWrapper>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerateEncounter}
            disabled={isGenerating || !currentTable.length}
            className="w-14 h-14 p-0"
            aria-label={`Generate random ${encounterType} encounter${
              currentTable.length ? "" : " (no encounters available)"
            }`}
            title={`Generate random ${encounterType} encounter`}
            role="button"
          >
            <Icon
              name="dice"
              size="md"
              className={isGenerating ? "animate-spin" : ""}
              aria-hidden={true}
            />
          </Button>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="flex justify-center" role="status" aria-live="polite">
            <LoadingState variant="inline" message="Rolling for encounter..." />
          </div>
        )}

        {/* Results */}
        {!isGenerating && encounterOccurs !== null && (
          <SectionWrapper title="Encounter Result">
            <div
              className="bg-zinc-800/50 rounded-lg p-4 text-center space-y-3"
              role="region"
              aria-live="polite"
              aria-label="Encounter generation result"
            >
              {encounterOccurs ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Icon
                      name="exclamation-triangle"
                      size="md"
                      className="text-amber-400"
                      aria-hidden={true}
                    />
                    <Typography variant="h6" color="primary" weight="bold">
                      Encounter Occurs!
                    </Typography>
                  </div>
                  {currentEncounter && (
                    <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-4">
                      <Typography
                        variant="h5"
                        color="primary"
                        weight="bold"
                        className="text-amber-300"
                        role="heading"
                        aria-level={3}
                      >
                        {currentEncounter}
                      </Typography>
                      <Typography
                        variant="bodySmall"
                        color="muted"
                        className="mt-2"
                      >
                        * indicates a creature with special abilities or
                        immunities
                      </Typography>
                      {onAddToCombat && (
                        <Button
                          onClick={handleAddToCombatTracker}
                          variant="primary"
                          size="md"
                          className="mt-3 w-full bg-red-600 hover:bg-red-700"
                          aria-label={`Add ${currentEncounter} to combat tracker`}
                        >
                          Add to Combat Tracker
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Icon
                    name="check-circle"
                    size="md"
                    className="text-lime-400"
                    aria-hidden={true}
                  />
                  <Typography variant="h6" color="secondary">
                    No Encounter
                  </Typography>
                </div>
              )}
            </div>
          </SectionWrapper>
        )}

        {/* Instructions */}
        <SectionWrapper title="Usage Instructions">
          <div
            className="bg-zinc-800/30 rounded-lg p-4 space-y-2"
            role="complementary"
            aria-label="How to use the encounter generator"
          >
            <List variant="steps" spacing="tight">
              <StepListItem>
                <Typography
                  variant="bodySmall"
                  color="muted"
                  className="inline"
                >
                  Select the type of encounter (Dungeon, Wilderness, or City)
                </Typography>
              </StepListItem>
              <StepListItem>
                <Typography
                  variant="bodySmall"
                  color="muted"
                  className="inline"
                >
                  Choose the specific subtype (level, terrain, or time)
                </Typography>
              </StepListItem>
              <StepListItem>
                <Typography
                  variant="bodySmall"
                  color="muted"
                  className="inline"
                >
                  Click the dice button to roll for an encounter
                </Typography>
              </StepListItem>
              <StepListItem>
                <Typography
                  variant="bodySmall"
                  color="muted"
                  className="inline"
                >
                  The system first checks if an encounter occurs (1 in 6 chance)
                </Typography>
              </StepListItem>
              <StepListItem>
                <Typography
                  variant="bodySmall"
                  color="muted"
                  className="inline"
                >
                  If an encounter occurs, a creature is randomly selected from
                  the appropriate table
                </Typography>
              </StepListItem>
            </List>
          </div>
        </SectionWrapper>
      </div>
    </Modal>
  );
}
