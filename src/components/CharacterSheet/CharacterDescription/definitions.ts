import { ReactNode } from "react";
import { CharacterData } from "../../definitions";

export type CharacterDescriptionProps = {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  userIsOwner: boolean;
};

export type DescriptionFieldButtonProps = {
  handler: (event: React.MouseEvent<HTMLElement>) => void;
  icon: ReactNode;
};
