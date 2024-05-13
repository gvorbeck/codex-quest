import { CharData } from "@/data/definitions";

export const openInNewTab = (url: string) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

export const emptyCharacter: CharData = {
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
      strength: "",
      intelligence: "",
      wisdom: "",
      dexterity: "",
      constitution: "",
      charisma: "",
    },
  },
  avatar: "",
  class: [],
  copper: 0,
  desc: [],
  electrum: 0,
  equipment: [],
  gold: 0,
  hp: {
    dice: "",
    points: 0,
    max: 0,
    desc: "",
  },
  level: 1,
  name: "",
  platinum: 0,
  race: "",
  silver: 0,
  spells: [],
  useCoinWeight: true,
  weight: 0,
  xp: 0,
};
