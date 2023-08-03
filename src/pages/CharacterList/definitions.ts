import { User } from "firebase/auth";
import { CharacterData } from "../../components/definitions";

export interface CharacterListProps {
  user: User | null;
  characters: CharacterData[];
  onCharacterDeleted: () => void;
  className?: string;
}
