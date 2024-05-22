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
}
export const GameDataContext: React.Context<GameDataContextProps> =
  React.createContext<GameDataContextProps>({
    addToTurnTracker: () => {},
    userIsOwner: false,
    userId: undefined,
    gameId: undefined,
    user: null,
  });
