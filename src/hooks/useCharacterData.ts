import React from "react";
import { useParams } from "react-router-dom";
import { fetchDocument, updateDocument } from "../support/accountSupport";
import { User } from "firebase/auth";
import { existingCharacterReducer } from "@/support/characterSupport";

export function useCharacterData(user: User | null) {
  const { uid, id } = useParams();
  const [character, characterDispatch] = React.useReducer(
    existingCharacterReducer,
    null,
  );
  const userIsOwner = user?.uid === uid;

  React.useEffect(() => {
    let unsubscribe: () => void;
    if (uid && id) {
      unsubscribe = fetchDocument(uid, id, characterDispatch, "characters");
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

  return { character, characterDispatch, userIsOwner, uid, id };
}
