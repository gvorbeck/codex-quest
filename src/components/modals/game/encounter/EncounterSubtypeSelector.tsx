import { Button } from "@/components/ui/inputs";
import { SectionWrapper } from "@/components/ui/layout";
import type { EncounterType, DungeonLevel, WildernessType, CityType } from "@/types/encounters";

interface EncounterSubtypeSelectorProps {
  encounterType: EncounterType;
  dungeonLevel: DungeonLevel;
  wildernessType: WildernessType;
  cityType: CityType;
  onDungeonLevelChange: (level: DungeonLevel) => void;
  onWildernessTypeChange: (type: WildernessType) => void;
  onCityTypeChange: (type: CityType) => void;
}

// Move constants outside component for performance
const DUNGEON_LEVELS: readonly DungeonLevel[] = [
  "Level 1",
  "Level 2", 
  "Level 3",
  "Level 4-5",
  "Level 6-7",
  "Level 8+"
] as const;

const WILDERNESS_TYPES: readonly WildernessType[] = [
  "Desert or Barren",
  "Grassland",
  "Inhabited Territories",
  "Jungle",
  "Mountains or Hills",
  "Ocean",
  "River or Riverside",
  "Swamp",
  "Woods or Forest"
] as const;

const CITY_TYPES: readonly CityType[] = [
  "Day Encounter",
  "Night Encounter"
] as const;

export default function EncounterSubtypeSelector({
  encounterType,
  dungeonLevel,
  wildernessType,
  cityType,
  onDungeonLevelChange,
  onWildernessTypeChange,
  onCityTypeChange,
}: EncounterSubtypeSelectorProps) {
  if (encounterType === "dungeon") {
    return (
      <SectionWrapper title="Dungeon Level">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Select dungeon level"
          aria-describedby="dungeon-level-help"
        >
          {DUNGEON_LEVELS.map((level) => (
            <Button
              key={level}
              variant={dungeonLevel === level ? "primary" : "secondary"}
              size="sm"
              onClick={() => onDungeonLevelChange(level)}
              aria-pressed={dungeonLevel === level}
            >
              {level}
            </Button>
          ))}
        </div>
        <div id="dungeon-level-help" className="sr-only">
          Choose the dungeon level to determine encounter difficulty
        </div>
      </SectionWrapper>
    );
  }

  if (encounterType === "wilderness") {
    return (
      <SectionWrapper title="Terrain Type">
        <div
          className="grid grid-cols-2 gap-2"
          role="group"
          aria-label="Select terrain type"
          aria-describedby="terrain-type-help"
        >
          {WILDERNESS_TYPES.map((terrain) => (
            <Button
              key={terrain}
              variant={wildernessType === terrain ? "primary" : "secondary"}
              size="sm"
              onClick={() => onWildernessTypeChange(terrain)}
              className="text-xs"
              aria-pressed={wildernessType === terrain}
            >
              {terrain}
            </Button>
          ))}
        </div>
        <div id="terrain-type-help" className="sr-only">
          Select the wilderness terrain type for appropriate encounters
        </div>
      </SectionWrapper>
    );
  }

  if (encounterType === "city") {
    return (
      <SectionWrapper title="Time of Day">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Select time of day"
          aria-describedby="time-of-day-help"
        >
          {CITY_TYPES.map((time) => (
            <Button
              key={time}
              variant={cityType === time ? "primary" : "secondary"}
              size="sm"
              onClick={() => onCityTypeChange(time)}
              aria-pressed={cityType === time}
            >
              {time}
            </Button>
          ))}
        </div>
        <div id="time-of-day-help" className="sr-only">
          Select whether the encounter occurs during day or night
        </div>
      </SectionWrapper>
    );
  }

  return null;
}