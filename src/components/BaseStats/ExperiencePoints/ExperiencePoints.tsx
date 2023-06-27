import { Button, Input, Space } from "antd";
import { CharacterDetails } from "../../types";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams } from "react-router-dom";
import HelpTooltip from "../../HelpTooltip/HelpTooltip";

export default function ExperiencePoints({
  character,
  setCharacter,
  userIsOwner,
  showLevelUpModal,
}: CharacterDetails) {
  const [prevValue, setPrevValue] = useState(character.xp.toString());
  const levelRequirements = {
    Cleric: [
      0, 1500, 3000, 6000, 12000, 24000, 48000, 90000, 180000, 270000, 360000,
      450000, 540000, 630000, 720000, 810000, 900000, 990000, 1080000, 1170000,
    ],
    Fighter: [
      0, 2000, 4000, 8000, 16000, 32000, 64000, 120000, 240000, 360000, 480000,
      600000, 720000, 840000, 960000, 1080000, 1200000, 1320000, 1440000,
      1560000,
    ],
    "Magic-User": [
      0, 2500, 5000, 10000, 20000, 40000, 80000, 150000, 300000, 450000, 600000,
      750000, 900000, 1050000, 1200000, 1350000, 1500000, 1650000, 1800000,
      1950000,
    ],
    Thief: [
      0, 1250, 2500, 5000, 10000, 20000, 40000, 75000, 150000, 225000, 300000,
      375000, 450000, 525000, 600000, 675000, 750000, 825000, 900000, 975000,
    ],
  };

  const [inputValue, setInputValue] = useState(character.xp.toString());

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const { uid, id } = useParams();
  const updateXP = async () => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    if (character.xp.toString() !== prevValue) {
      const docRef = doc(db, "users", uid, "characters", id);

      try {
        await updateDoc(docRef, {
          xp: character.xp,
        });
        setPrevValue(character.xp.toString());
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  const handleInputBlur = () => {
    const newValue = inputValue;
    if (newValue.startsWith("+")) {
      const increment = parseInt(newValue.slice(1));
      if (!isNaN(increment)) {
        const updatedXP = character.xp + increment;
        if (setCharacter) {
          setCharacter({
            ...character,
            xp: updatedXP,
          });
        }
        setInputValue(updatedXP.toString());
      }
    } else if (newValue.startsWith("-")) {
      const decrement = parseInt(newValue.slice(1));
      if (!isNaN(decrement)) {
        const updatedXP = character.xp - decrement;
        if (setCharacter) {
          setCharacter({
            ...character,
            xp: updatedXP,
          });
        }
        setInputValue(updatedXP.toString());
      }
    } else {
      const value = parseInt(newValue);
      if (!isNaN(value)) {
        if (setCharacter) {
          setCharacter({
            ...character,
            xp: value,
          });
        }
        setInputValue(value.toString());
      }
    }
  };

  const classes = character.class.split(" ");
  const totalLevelRequirement = classes
    .map(
      (className) =>
        levelRequirements[className as keyof typeof levelRequirements][
          character.level
        ]
    )
    .reduce((a, b) => a + b, 0);

  useEffect(() => {
    updateXP();
  }, [character.xp]);

  return (
    <div>
      <Space.Compact>
        <Input
          value={inputValue}
          onFocus={(event) => event.target.select()}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleInputBlur();
            }
          }}
          suffix={character.level < 20 && `/ ${totalLevelRequirement} XP`}
          disabled={!userIsOwner}
          name="Experience Points"
        />
        {character.level < 20 && (
          <Button
            disabled={character.xp < totalLevelRequirement}
            type="primary"
            onClick={showLevelUpModal}
          >{`Level Up`}</Button>
        )}
      </Space.Compact>
      <HelpTooltip
        className="ml-4"
        text="You can add to your XP total by highlighting the current value and typing '+250' to add 250 XP to your total and hitting Enter."
      />
    </div>
  );
}
