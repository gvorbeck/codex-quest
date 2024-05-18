import React from "react";
import { CharData, UpdateCharAction } from "../data/definitions";
import { emptyCharacter } from "@/support/characterSupport";

interface CharacterDataContextProps {
  character: CharData;
  characterDispatch: React.Dispatch<UpdateCharAction>;
  userIsOwner: boolean;
  uid: string | undefined;
  id: string | undefined;
}

const defaultCharacter: CharData = emptyCharacter;

export const CharacterDataContext: React.Context<CharacterDataContextProps> =
  React.createContext<CharacterDataContextProps>({
    character: defaultCharacter,
    characterDispatch: () => {},
    userIsOwner: false,
    uid: "",
    id: "",
  });
