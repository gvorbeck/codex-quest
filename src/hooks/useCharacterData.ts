import React from "react";
import { useParams } from "react-router-dom";
import { fetchDocument, updateDocument } from "../support/accountSupport";
import { CharData } from "../data/definitions";
import { User } from "firebase/auth";

export function useCharacterData(user: User | null) {
  const { uid, id } = useParams();
  const [character, setCharacter] = React.useState<CharData | null>(null);
  const userIsOwner = user?.uid === uid;

  React.useEffect(() => {
    let unsubscribe: () => void;
    if (uid && id) {
      unsubscribe = fetchDocument(uid, id, setCharacter, "characters");
    }
    return () => unsubscribe && unsubscribe();
  }, [uid, id]);

  React.useEffect(() => {
    if (uid && id && character) {
      updateDocument({
        collection: "users",
        docId: uid,
        subCollection: "characters",
        subDocId: id,
        data: { ...character },
      });
    }
  }, [uid, id, character]);

  return { character, setCharacter, userIsOwner, uid, id };
}
