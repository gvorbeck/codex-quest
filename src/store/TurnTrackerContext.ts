import { CharData, CombatantType, CombatantTypes } from "@/data/definitions";
import React from "react";

interface TurnTrackerDataContextProps {
  addToTurnTracker: (
    data: CombatantType | CharData,
    type: CombatantTypes,
  ) => void;
}
export const TurnTrackerDataContext: React.Context<TurnTrackerDataContextProps> =
  React.createContext<TurnTrackerDataContextProps>({
    addToTurnTracker: () => {},
  });
