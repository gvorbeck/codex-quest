import { useState, useCallback, useMemo } from "react";
import { DUNGEON_ENCOUNTERS } from "@/data/encounters/dungeonEncounters";
import { WILDERNESS_ENCOUNTERS } from "@/data/encounters/wildernessEncounters";
import { CITY_ENCOUNTERS } from "@/data/encounters/cityEncounters";
import type { EncounterType, DungeonLevel, WildernessType, CityType } from "@/types/encounters";

export function useEncounterData() {
  const [encounterType, setEncounterType] = useState<EncounterType>("dungeon");
  const [dungeonLevel, setDungeonLevel] = useState<DungeonLevel>("Level 1");
  const [wildernessType, setWildernessType] = useState<WildernessType>("Grassland");
  const [cityType, setCityType] = useState<CityType>("Day Encounter");

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

  const handleTypeChange = useCallback((type: EncounterType) => {
    setEncounterType(type);
  }, []);

  return {
    encounterType,
    dungeonLevel,
    wildernessType,
    cityType,
    currentTable,
    handleTypeChange,
    setDungeonLevel,
    setWildernessType,
    setCityType,
  };
}