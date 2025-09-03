import { useState, useCallback, useMemo } from "react";
import Modal from "../base/Modal";
import { Button } from "@/components/ui/inputs";
import { Typography } from "@/components/ui/design-system";
import { Icon } from "@/components/ui/display";
import { SectionWrapper } from "@/components/ui/layout";
import { LoadingState } from "@/components/ui/feedback";
import { roller } from "@/utils/dice";

interface EncounterGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
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

// Encounter Tables from BFRPG Rules
const DUNGEON_ENCOUNTERS = {
  "Level 1": [
    "Bee, Giant", "Goblin", "Jelly, Green*", "Kobold", "NPC Party: Adventurer",
    "NPC Party: Bandit", "Orc", "Stirge", "Skeleton", "Snake, Cobra",
    "Spider, Giant Crab", "Wolf"
  ],
  "Level 2": [
    "Beetle, Giant Bombardier", "Fly, Giant", "Ghoul", "Gnoll", "Jelly, Gray",
    "Hobgoblin", "Lizard Man", "NPC Party: Adventurer", "Snake, Pit Viper", "Spider, Giant Black Widow",
    "Lizard Man, Subterranean", "Zombie"
  ],
  "Level 3": [
    "Ant, Giant", "Ape, Carnivorous", "Beetle, Giant Tiger", "Bugbear", "Doppleganger",
    "Gargoyle*", "Jelly, Glass", "Lycanthrope, Wererat*", "Ogre", "Shadow*",
    "Tentacle Worm", "Wight*"
  ],
  "Level 4-5": [
    "Bear, Cave", "Caecilia, Giant", "Cockatrice", "Doppleganger", "Jelly, Gray",
    "Hellhound", "Rust Monster*", "Lycanthrope, Werewolf*", "Minotaur", "Jelly, Ochre*",
    "Owlbear", "Wraith*"
  ],
  "Level 6-7": [
    "Basilisk", "Jelly, Black", "Caecilia, Giant", "Deceiver", "Hydra",
    "Rust Monster*", "Lycanthrope, Weretiger*", "Mummy*", "Owlbear", "Scorpion, Giant",
    "Spectre*", "Troll"
  ],
  "Level 8+": [
    "Basilisk, Greater*", "Chimera", "Deceiver, Greater", "Giant, Hill", "Giant, Stone",
    "Hydra", "Jelly, Black", "Lycanthrope, Wereboar*", "Purple Worm", "Salamander, Flame*",
    "Salamander, Frost*", "Vampire*"
  ]
} as const;

const WILDERNESS_ENCOUNTERS = {
  "Desert or Barren": [
    "Dragon, Desert", "Hellhound", "Giant, Fire", "Purple Worm", "Fly, Giant",
    "Scorpion, Giant", "Camel", "Spider, Giant Tarantula", "NPC Party: Merchant", "Hawk",
    "NPC Party: Bandit", "Ogre", "Griffon", "Gnoll", "Dragon, Mountain"
  ],
  "Grassland": [
    "Dragon, Plains", "Troll", "Fly, Giant", "Scorpion, Giant", "NPC Party: Bandit",
    "Lion", "Boar, Wild", "NPC Party: Merchant", "Wolf", "Bee, Giant",
    "Gnoll", "Goblin", "Flicker Beast", "Wolf, Dire", "Giant, Hill"
  ],
  "Inhabited Territories": [
    "Dragon, Cloud", "Ghoul", "Bugbear", "Goblin", "Centaur",
    "NPC Party: Bandit", "NPC Party: Merchant", "NPC Party: Pilgrim", "NPC Party: Noble", "Dog",
    "Gargoyle*", "Gnoll", "Ogre", "Minotaur", "Vampire*"
  ],
  "Jungle": [
    "Dragon, Forest", "NPC Party: Bandit", "Goblin", "Hobgoblin", "Centipede, Giant",
    "Snake, Giant Python", "Elephant", "Antelope", "Jaguar", "Stirge",
    "Beetle, Giant Tiger", "Caecilia, Giant", "Shadow*", "NPC Party: Merchant", "Lycanthrope, Weretiger*"
  ],
  "Mountains or Hills": [
    "Dragon, Ice", "Roc (1d6: 1-3 Large, 4-5 Huge, 6 Giant)", "Deceiver", "Lycanthrope, Werewolf*", "Mountain Lion",
    "Wolf", "Spider, Giant Crab", "Hawk", "Orc", "Bat, Giant",
    "Hawk, Giant", "Giant, Hill", "Chimera", "Wolf, Dire", "Dragon, Mountain"
  ],
  "Ocean": [
    "Dragon, Sea", "Hydra", "Whale, Sperm", "Crocodile, Giant", "Crab, Giant",
    "Whale, Killer", "Octopus, Giant", "Shark, Mako", "NPC Party: Merchant", "Shark, Bull",
    "Roc (1d8: 1-5 Huge, 6-8 Giant)", "Shark, Great White", "Mermaid", "Sea Serpent"
  ],
  "River or Riverside": [
    "Dragon, Swamp", "Dragon, Swamp", "Fish, Giant Piranha", "Stirge", "Fish, Giant Bass",
    "NPC Party: Merchant", "Lizard Man", "Crocodile", "Frog, Giant", "Fish, Giant Catfish",
    "NPC Party: Buccaneer", "Troll", "Jaguar", "Nixie", "Water Termite, Giant",
    "Dragon, Forest"
  ],
  "Swamp": [
    "Dragon, Swamp", "Shadow*", "Troll", "Lizard, Giant Draco", "Centipede, Giant",
    "Leech, Giant", "Lizard Man", "Crocodile", "Stirge", "Orc",
    "Toad, Giant (see Frog, Giant)", "Lizard Man, Subterranean", "Blood Rose", "Hangman Tree",
    "Basilisk"
  ],
  "Woods or Forest": [
    "Dragon, Forest", "Alicorn (see Unicorn)", "Treant", "Orc", "Boar, Wild",
    "Bear, Black", "Hawk, Giant", "Antelope", "Wolf", "Ogre",
    "Bear, Grizzly", "Wolf, Dire", "Giant, Hill", "Owlbear", "Unicorn"
  ]
} as const;

const CITY_ENCOUNTERS = {
  "Day Encounter": [
    "Doppleganger", "Noble", "Thief", "Bully", "City Watch",
    "Merchant", "Beggar", "Priest", "Mercenary", "Wizard",
    "Lycanthrope, Wererat*"
  ],
  "Night Encounter": [
    "Doppleganger", "Shadow*", "Press Gang", "Beggar", "Thief",
    "Bully", "Merchant", "Giant Rat", "City Watch", "Wizard",
    "Lycanthrope, Wererat*"
  ]
} as const;

type EncounterType = "dungeon" | "wilderness" | "city";
type DungeonLevel = keyof typeof DUNGEON_ENCOUNTERS;
type WildernessType = keyof typeof WILDERNESS_ENCOUNTERS;
type CityType = keyof typeof CITY_ENCOUNTERS;

export default function EncounterGeneratorModal({
  isOpen,
  onClose,
}: EncounterGeneratorModalProps) {
  const [encounterType, setEncounterType] = useState<EncounterType>("dungeon");
  const [dungeonLevel, setDungeonLevel] = useState<DungeonLevel>("Level 1");
  const [wildernessType, setWildernessType] = useState<WildernessType>("Grassland");
  const [cityType, setCityType] = useState<CityType>("Day Encounter");
  const [currentEncounter, setCurrentEncounter] = useState<string | null>(null);
  const [encounterOccurs, setEncounterOccurs] = useState<boolean | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateEncounter = useCallback(async () => {
    if (!currentTable.length) return;

    setIsGenerating(true);
    setCurrentEncounter(null);
    setEncounterOccurs(null);

    try {
      // Simulate rolling for encounter occurrence
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Roll 1d6 for encounter check (1 = encounter occurs)
      const encounterCheck = roller("1d6");
      const encounterHappens = encounterCheck.total === 1;
      
      setEncounterOccurs(encounterHappens);

      if (encounterHappens) {
        // Roll 1d12 for encounter table (most tables have 12 entries)
        const roll = roller("1d12");
        const encounterIndex = Math.min(roll.total - 1, currentTable.length - 1);
        const encounter = currentTable[encounterIndex];
        
        // Add a small delay for UX
        await new Promise(resolve => setTimeout(resolve, 300));
        if (encounter) {
          setCurrentEncounter(encounter);
        }
      }
    } catch (error) {
      console.error("Error generating encounter:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [currentTable]);

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
          <div className="flex flex-wrap gap-2">
            {(["dungeon", "wilderness", "city"] as const).map((type) => (
              <Button
                key={type}
                variant={encounterType === type ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleTypeChange(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </SectionWrapper>

        {/* Encounter Subtype Selection */}
        {encounterType === "dungeon" && (
          <SectionWrapper title="Dungeon Level">
            <div className="flex flex-wrap gap-2">
              {Object.keys(DUNGEON_ENCOUNTERS).map((level) => (
                <Button
                  key={level}
                  variant={dungeonLevel === level ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setDungeonLevel(level as DungeonLevel)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </SectionWrapper>
        )}

        {encounterType === "wilderness" && (
          <SectionWrapper title="Terrain Type">
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(WILDERNESS_ENCOUNTERS).map((terrain) => (
                <Button
                  key={terrain}
                  variant={wildernessType === terrain ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setWildernessType(terrain as WildernessType)}
                  className="text-xs"
                >
                  {terrain}
                </Button>
              ))}
            </div>
          </SectionWrapper>
        )}

        {encounterType === "city" && (
          <SectionWrapper title="Time of Day">
            <div className="flex flex-wrap gap-2">
              {Object.keys(CITY_ENCOUNTERS).map((time) => (
                <Button
                  key={time}
                  variant={cityType === time ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setCityType(time as CityType)}
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
              <strong>Encounter Check:</strong> Roll 1d6, encounter occurs on a roll of 1
            </Typography>
            {encounterType === "dungeon" && (
              <Typography variant="bodySmall" color="muted">
                <strong>Dungeon:</strong> Check every 3 turns or when circumstances warrant
              </Typography>
            )}
            {encounterType === "wilderness" && (
              <Typography variant="bodySmall" color="muted">
                <strong>Wilderness:</strong> Check every 4 hours (3 night checks, 3 day checks)
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
            disabled={isGenerating}
            className="w-14 h-14 p-0"
            aria-label="Generate random encounter"
            title="Generate random encounter"
          >
            <Icon
              name="dice"
              size="md"
              className={isGenerating ? "animate-spin" : ""}
            />
          </Button>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="flex justify-center">
            <LoadingState
              variant="inline"
              message="Rolling for encounter..."
            />
          </div>
        )}

        {/* Results */}
        {!isGenerating && encounterOccurs !== null && (
          <SectionWrapper title="Encounter Result">
            <div className="bg-zinc-800/50 rounded-lg p-4 text-center space-y-3">
              {encounterOccurs ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Icon name="exclamation-triangle" size="md" className="text-amber-400" />
                    <Typography variant="h6" color="primary" weight="bold">
                      Encounter Occurs!
                    </Typography>
                  </div>
                  {currentEncounter && (
                    <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-4">
                      <Typography variant="h5" color="primary" weight="bold" className="text-amber-300">
                        {currentEncounter}
                      </Typography>
                      <Typography variant="bodySmall" color="muted" className="mt-2">
                        * indicates a creature with special abilities or immunities
                      </Typography>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Icon name="check-circle" size="md" className="text-lime-400" />
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
          <div className="bg-zinc-800/30 rounded-lg p-4 space-y-2">
            <Typography variant="bodySmall" color="muted">
              1. Select the type of encounter (Dungeon, Wilderness, or City)
            </Typography>
            <Typography variant="bodySmall" color="muted">
              2. Choose the specific subtype (level, terrain, or time)
            </Typography>
            <Typography variant="bodySmall" color="muted">
              3. Click the dice to roll for an encounter
            </Typography>
            <Typography variant="bodySmall" color="muted">
              4. The system first checks if an encounter occurs (1 in 6 chance)
            </Typography>
            <Typography variant="bodySmall" color="muted">
              5. If an encounter occurs, a creature is randomly selected from the appropriate table
            </Typography>
          </div>
        </SectionWrapper>
      </div>
    </Modal>
  );
}
