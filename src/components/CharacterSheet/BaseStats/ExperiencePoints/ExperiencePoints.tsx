import { Button, Input, Space } from "antd";
import { CharacterDetails } from "../../../types";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useParams } from "react-router-dom";
import HelpTooltip from "../../../HelpTooltip/HelpTooltip";
import { levelRequirements } from "../../../../data/experience-points";

export default function ExperiencePoints({
  character,
  setCharacter,
  userIsOwner,
  showLevelUpModal,
  className,
}: CharacterDetails) {
  const [prevValue, setPrevValue] = useState(character.xp.toString());

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
        levelRequirements[className as keyof typeof levelRequirements]
          ? levelRequirements[className as keyof typeof levelRequirements][
              character.level
            ]
          : 0 // value if using a custom class
    )
    .reduce((a, b) => a + b, 0);

  useEffect(() => {
    updateXP();
  }, [character.xp]);

  return (
    <div className={`${className} flex`}>
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
            className="print:hidden"
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
