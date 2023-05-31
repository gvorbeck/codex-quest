import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { CharacterData } from "../types";

export default function CharacterSheet() {
  const { uid, id } = useParams();
  const [character, setCharacter] = useState<CharacterData | null>(null);

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const characterDocRef = doc(db, `users/${uid}/characters/${id}`);
        const characterSnapshot = await getDoc(characterDocRef);

        if (characterSnapshot.exists()) {
          const characterData = characterSnapshot.data() as CharacterData;
          console.log(characterData);
          setCharacter(characterData);
        } else {
          console.log("Character not found");
        }
      } catch (error) {
        console.error("Error fetching character:", error);
      }
    }

    fetchCharacter();
  }, [uid, id]);

  return (
    <div>
      {character ? (
        <div>
          <h2>{character.name}</h2>
          {/* Render the rest of the character details */}
        </div>
      ) : (
        <div>Loading character...</div>
      )}
    </div>
  );
}
