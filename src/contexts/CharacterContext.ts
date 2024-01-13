import React from "react";
import { CharData } from "../data/definitions";

interface CharacterDataContextProps {
  character: CharData;
  setCharacter: (character: CharData | null) => void;
  userIsOwner: boolean;
  uid: string | undefined;
  id: string | undefined;
}

const defaultCharacter = {
  abilities: {
    scores: {
      strength: 0,
      intelligence: 0,
      wisdom: 0,
      dexterity: 0,
      constitution: 0,
      charisma: 0,
    },
    modifiers: {
      strength: 0,
      intelligence: 0,
      wisdom: 0,
      dexterity: 0,
      constitution: 0,
      charisma: 0,
    },
  },
  avatar: "",
  class: [],
  desc: "",
  equipment: [],
  gold: 0,
  hp: { dice: "", points: 0, max: 0, desc: "" },
  level: 0,
  name: "",
  race: "",
  restrictions: { race: [], class: [] },
  savingThrows: {
    deathRayOrPoison: 0,
    magicWands: 0,
    paralysisOrPetrify: 0,
    dragonBreath: 0,
    spells: 0,
  },
  specials: { race: [], class: [] },
  spells: [],
  weight: 0,
  wearing: { armor: "", shield: "" },
  xp: 0,
};

export const CharacterDataContext: React.Context<CharacterDataContextProps> =
  React.createContext<CharacterDataContextProps>({
    character: defaultCharacter,
    setCharacter: () => {},
    userIsOwner: false,
    uid: "",
    id: "",
  });
