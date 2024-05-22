import { CharData, CombatantType, CombatantTypes } from "@/data/definitions";
import { User } from "firebase/auth";
import React from "react";

interface GameDataContextProps {
  addToTurnTracker: (
    data: CombatantType | CharData,
    type: CombatantTypes,
  ) => void;
  userIsOwner: boolean;
  userId: string | undefined;
  gameId: string | undefined;
  user: User | null;
  combatants: CombatantType[];
  setCombatants: (combatants: CombatantType[]) => void;
}
export const GameDataContext: React.Context<GameDataContextProps> =
  React.createContext<GameDataContextProps>({
    addToTurnTracker: () => {},
    combatants: [],
    gameId: undefined,
    setCombatants: () => {},
    user: null,
    userId: undefined,
    userIsOwner: false,
  });
