import { CharacterDetails } from "../types";
import { Input, Typography } from "antd";
import { useEffect, useState, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useParams } from "react-router-dom";

export default function Description({
  character,
  setCharacter,
  userIsOwner,
}: CharacterDetails) {
  const [inputValue, setInputValue] = useState(character.desc || "");
  const { uid, id } = useParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const updateDescription = async () => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    if (character.desc !== inputValue) {
      const docRef = doc(db, "users", uid, "characters", id);
      try {
        await updateDoc(docRef, {
          desc: inputValue,
        });
        console.log(`${character.name}'s description updated`);
        if (setCharacter) {
          setCharacter({
            ...character,
            desc: inputValue,
          });
        }
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(updateDescription, 5000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue]);

  return (
    <div>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Bio & Notes
      </Typography.Title>
      <Input.TextArea
        value={inputValue}
        rows={4}
        placeholder={`Write anything and everything about ${character.name}`}
        onChange={handleInputChange}
        onBlur={updateDescription}
        disabled={!userIsOwner}
      />
    </div>
  );
}
