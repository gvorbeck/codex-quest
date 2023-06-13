import { Input, Space, Typography } from "antd";
import { CharacterDetails } from "../types";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useParams } from "react-router-dom";

export default function Money({
  character,
  setCharacter,
  userIsOwner,
}: CharacterDetails) {
  const { gp, sp, cp } = makeChange();
  const [goldValue, setGoldValue] = useState(gp.toString());
  const [silverValue, setSilverValue] = useState(sp.toString());
  const [copperValue, setCopperValue] = useState(cp.toString());

  const { uid, id } = useParams<{ uid: string; id: string }>();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFunc: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setFunc(event.target.value);
  };

  const handleInputBlur = async (
    newValue: string,
    originalValue: number,
    setFunc: React.Dispatch<React.SetStateAction<string>>,
    multiplier: number
  ) => {
    let valueToSet: number = NaN;

    if (newValue.startsWith("+")) {
      const increment = parseInt(newValue.slice(1));
      if (!isNaN(increment)) {
        valueToSet = originalValue + increment;
      }
    } else if (newValue.startsWith("-")) {
      const decrement = parseInt(newValue.slice(1));
      if (!isNaN(decrement)) {
        valueToSet =
          originalValue - decrement >= 0 ? originalValue - decrement : 0;
      }
    } else {
      const value = parseInt(newValue);
      if (!isNaN(value) && value >= 0) {
        valueToSet = value;
      }
    }

    if (!isNaN(valueToSet) && setCharacter) {
      setFunc(valueToSet.toString());
      setCharacter({
        ...character,
        gold: character.gold + (valueToSet - originalValue) / multiplier,
      });

      await updateMoney(
        character.gold + (valueToSet - originalValue) / multiplier
      );
    }
  };

  const updateMoney = async (gold: number) => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    const docRef = doc(db, "users", uid, "characters", id);

    try {
      await updateDoc(docRef, {
        gold,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  function makeChange() {
    let copper = character.gold * 100;
    let goldPieces = Math.floor(copper / 100);
    copper %= 100;
    let silverPieces = Math.floor(copper / 10);
    copper %= 10;
    let copperPieces = copper;

    return {
      gp: Math.round(goldPieces),
      sp: Math.round(silverPieces),
      cp: Math.round(copperPieces),
    };
  }

  return (
    <div>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Money
      </Typography.Title>
      <Space direction="vertical">
        {[
          ["gp", goldValue, setGoldValue, 1],
          ["sp", silverValue, setSilverValue, 10],
          ["cp", copperValue, setCopperValue, 100],
        ].map(([key, value, setFunc, multiplier]) => (
          <Input
            key={key as string}
            min={0}
            value={value as string}
            onFocus={(event) => event.target.select()}
            onChange={(event) =>
              handleInputChange(
                event,
                setFunc as React.Dispatch<React.SetStateAction<string>>
              )
            }
            onBlur={() =>
              handleInputBlur(
                value as string,
                (makeChange() as { [key: string]: number })[
                  key as "gp" | "sp" | "cp"
                ],
                setFunc as React.Dispatch<React.SetStateAction<string>>,
                multiplier as number
              )
            }
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleInputBlur(
                  value as string,
                  (makeChange() as { [key: string]: number })[
                    key as "gp" | "sp" | "cp"
                  ],
                  setFunc as React.Dispatch<React.SetStateAction<string>>,
                  multiplier as number
                );
              }
            }}
            addonAfter={key as string}
            disabled={!userIsOwner}
          />
        ))}
      </Space>
    </div>
  );
}
