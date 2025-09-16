import { useState, useCallback, useMemo } from "react";
import {
  DUNGEON_ENCOUNTERS,
  WILDERNESS_ENCOUNTERS,
  CITY_ENCOUNTERS,
} from "@/constants";
import type {
  EncounterType,
  DungeonLevel,
  WildernessType,
  CityType,
} from "@/types";

export function useEncounterData() {
  const [encounterType, setEncounterType] = useState<EncounterType>("dungeon");
  const [dungeonLevel, setDungeonLevel] = useState<DungeonLevel>("Level 1");
  const [wildernessType, setWildernessType] =
    useState<WildernessType>("Grassland");
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
