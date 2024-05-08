import React from "react";
import { CharData } from "../data/definitions";
import { emptyCharacter } from "@/support/characterSupport";

interface CharacterDataContextProps {
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
  userIsOwner: boolean;
  uid: string | undefined;
  id: string | undefined;
}

const defaultCharacter: CharData = emptyCharacter;

export const CharacterDataContext: React.Context<CharacterDataContextProps> =
  React.createContext<CharacterDataContextProps>({
    character: defaultCharacter,
    setCharacter: () => {},
    userIsOwner: false,
    uid: "",
    id: "",
  });
