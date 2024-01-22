import HelpTooltip from "@/components/HelpTooltip/HelpTooltip";
import ModalLevelUp from "@/components/ModalLevelUp/ModalLevelUp";
import { classes } from "@/data/classes";
import { CharData, ClassNames } from "@/data/definitions";
import { Button, Flex, Input, Space } from "antd";
import React from "react";

interface ExperiencePointsProps {
  classArr: string[];
  character: CharData;
  setCharacter: (character: CharData) => void;
  setModalIsOpen: (modalIsOpen: boolean) => void;
  uid: string | undefined;
  id: string | undefined;
  setModalTitle: (modalTitle: string) => void;
  setModalContent: (modalContent: React.ReactNode) => void;
  userIsOwner: boolean;
}

const ExperiencePoints: React.FC<
  ExperiencePointsProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  classArr,
  setModalIsOpen,
  character,
  setCharacter,
  setModalTitle,
  uid,
  id,
  setModalContent,
  userIsOwner,
}) => {
  const [inputValue, setInputValue] = React.useState<string>(`${character.xp}`);
  const showLevelUpModal = () => {
    setModalIsOpen(true);
    setModalTitle("Level Up");
    setModalContent(
      <ModalLevelUp
        character={character}
        setCharacter={setCharacter}
        setModalIsOpen={setModalIsOpen}
      />,
    );
  };
  const handleInputBlur = () => {
    if (!uid || !id) {
      return;
    }

    // Check if inputValue matches the expected format (optional '-' or '+', followed by numeric characters)
    if (!/^[+-]?\d+$/.test(inputValue)) {
      console.error("Invalid input");
      return;
    }

    // Determine the XP change
    let xpChange = 0;
    if (inputValue.startsWith("+")) {
      xpChange = parseInt(inputValue.slice(1));
    } else if (inputValue.startsWith("-")) {
      xpChange = -parseInt(inputValue.slice(1));
    } else {
      xpChange = parseInt(inputValue) - character.xp; // Difference between new and old XP
    }

    // Apply the XP change
    if (!isNaN(xpChange)) {
      const updatedXP = character.xp + xpChange;
      setCharacter({
        ...character,
        xp: updatedXP,
      });
      setInputValue(updatedXP.toString());
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const totalLevelRequirement = classArr
    .map((className) => {
      const classRequirements =
        classes[className as ClassNames]?.experiencePoints;
      return classRequirements ? classRequirements[character.level] : 0; // value if using a custom class
    })
    .reduce((a, b) => a + b, 0);
  return (
    <Flex gap={8} className={className}>
      <Space.Compact size="middle">
        <Input
          value={inputValue}
          onFocus={(e) => {
            setTimeout(() => {
              e.target.select();
            }, 50);
          }}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleInputBlur();
            }
          }}
          name="Experience Points"
          id="experience-points"
          suffix={character.level < 20 && `/ ${totalLevelRequirement} XP`}
          disabled={!userIsOwner}
        />
        <label htmlFor="experience-points" className="hidden">
          Experience Points
        </label>
        {character.level < 20 && (
          <Button
            disabled={character.xp < totalLevelRequirement || !userIsOwner}
            type="primary"
            onClick={showLevelUpModal}
            className="print:hidden shadow-none"
          >{`Level Up`}</Button>
        )}
      </Space.Compact>
      <HelpTooltip text="You can add to your XP total by highlighting the current value and typing a number starting with + or - (ex: +250) and hitting Enter" />
    </Flex>
  );
};

export default ExperiencePoints;
