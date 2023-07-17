import { Input, Typography } from "antd";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams } from "react-router-dom";
import { HitPointsProps } from "./definitions";
import DOMPurify from "dompurify";

export default function HitPoints({
  characterData,
  setCharacterData,
  className,
  userIsOwner,
}: HitPointsProps) {
  const [prevValue, setPrevValue] = useState(
    characterData.hp.points.toString()
  );
  const [inputValue, setInputValue] = useState(
    characterData.hp.points.toString()
  );
  const [descValue, setDescValue] = useState(characterData.hp.desc || "");

  const { uid, id } = useParams();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedInput = DOMPurify.sanitize(event.target.value);
    setDescValue(sanitizedInput);
  };

  const handleInputBlur = () => {
    const newValue = inputValue;
    if (newValue.startsWith("+")) {
      const increment = parseInt(newValue.slice(1));
      if (!isNaN(increment)) {
        let updatedHP = characterData.hp.points + increment;
        // Ensure that the updated HP does not exceed the maximum HP
        updatedHP = Math.min(updatedHP, characterData.hp.max);
        setCharacterData({
          ...characterData,
          hp: {
            ...characterData.hp,
            points: updatedHP,
          },
        });
        setInputValue(updatedHP.toString());
      }
    } else if (newValue.startsWith("-")) {
      const decrement = parseInt(newValue.slice(1));
      if (!isNaN(decrement)) {
        let updatedHP = characterData.hp.points - decrement;
        // Ensure that the updated HP does not go below 0
        updatedHP = Math.max(updatedHP, 0);
        setCharacterData({
          ...characterData,
          hp: {
            ...characterData.hp,
            points: updatedHP,
          },
        });
        setInputValue(updatedHP.toString());
      }
    } else {
      let value = parseInt(newValue);
      if (!isNaN(value)) {
        // Ensure that the value does not exceed the maximum HP or go below 0
        value = Math.min(Math.max(value, 0), characterData.hp.max);
        setCharacterData({
          ...characterData,
          hp: {
            ...characterData.hp,
            points: value,
          },
        });
        setInputValue(value.toString());
      }
    }
  };

  const updateHP = async () => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    if (characterData.hp.points.toString() !== prevValue) {
      const docRef = doc(db, "users", uid, "characters", id);

      try {
        await updateDoc(docRef, {
          "hp.points": characterData.hp.points,
        });
        setPrevValue(characterData.hp.points.toString());
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  const handleDescBlur = async () => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    if (descValue !== characterData.hp.desc) {
      const docRef = doc(db, "users", uid, "characters", id);

      try {
        await updateDoc(docRef, {
          "hp.desc": descValue,
        });
        setCharacterData({
          ...characterData,
          hp: {
            ...characterData.hp,
            desc: descValue,
          },
        });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  useEffect(() => {
    updateHP();
  }, [characterData.hp.points]);

  return (
    <div className={className}>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Hit Points
      </Typography.Title>
      <Input
        value={inputValue}
        min={0}
        max={characterData.hp.max}
        addonAfter={`Max: ${characterData.hp.max}`}
        disabled={!userIsOwner}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleInputBlur();
          }
        }}
        onFocus={(event) => event.target.select()}
        name="Hit Points"
      />
      <Input.TextArea
        value={descValue}
        rows={4}
        maxLength={500}
        placeholder="Wounds and Conditions"
        className="mt-4"
        disabled={!userIsOwner}
        onChange={handleDescChange}
        onBlur={handleDescBlur}
        name="Wounds and Conditions"
      />
      <Typography.Text type="secondary" className="text-xs">
        Character count: {descValue.length}/500
      </Typography.Text>
    </div>
  );
}
