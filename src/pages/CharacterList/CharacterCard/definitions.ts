import { User } from "firebase/auth";
import { CharacterData } from "../../../components/definitions";

export type CharacterCardProps = {
  characterData: CharacterData;
  user: User | null;
  image: string;
  confirm: (characterId: string) => Promise<void>;
};
