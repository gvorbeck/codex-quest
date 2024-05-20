import HelpTooltip from "@/components/HelpTooltip/HelpTooltip";
import ModalLevelUp from "@/components/ModalLevelUp/ModalLevelUp";
import { classes } from "@/data/classes";
import { ClassNames, ModalDisplay } from "@/data/definitions";
import { CharacterDataContext } from "@/store/CharacterContext";
import { Button, Flex, Input, Space } from "antd";
import React from "react";

interface ExperiencePointsProps {
  setModalDisplay: React.Dispatch<React.SetStateAction<ModalDisplay>>;
}

const ExperiencePoints: React.FC<
  ExperiencePointsProps & React.ComponentPropsWithRef<"div">
> = ({ className, setModalDisplay }) => {
  const { character, characterDispatch, userIsOwner, uid, id } =
    React.useContext(CharacterDataContext);
  const [inputValue, setInputValue] = React.useState<string>(`${character.xp}`);

  function showLevelUpModal() {
    setModalDisplay({
      isOpen: true,
      title: "Level Up",
      content: <ModalLevelUp setModalDisplay={setModalDisplay} />,
    });
  }

  function handleInputBlur() {
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
      const xp = character.xp + xpChange;
      characterDispatch({
        type: "UPDATE",
        payload: {
          xp,
        },
      });
      setInputValue(xp.toString());
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  function handleInputFocus(event: React.FocusEvent<HTMLInputElement>) {
    setTimeout(() => {
      event.target.select();
    }, 50);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleInputBlur();
    }
  }

  const totalLevelRequirement = character.class
    .map((className) => {
      const classRequirements =
        classes[className as ClassNames]?.experiencePoints;
      return classRequirements ? classRequirements[character.level] : 0; // value if using a custom class
    })
    .reduce((a, b) => a + b, 0);

  const levelUpButtonDisabled =
    character.xp < totalLevelRequirement || !userIsOwner;

  const levelUpButton =
    character.level < 20 ? (
      <Button
        disabled={levelUpButtonDisabled}
        type="primary"
        onClick={showLevelUpModal}
        className="print:hidden shadow-none"
      >
        Level Up
      </Button>
    ) : null;

  const suffix = character.level < 20 ? `/ ${totalLevelRequirement} XP` : null;

  return (
    <Flex gap={8} className={className}>
      <Space.Compact size="middle">
        <Input
          value={inputValue}
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          name="Experience Points"
          id="experience-points"
          suffix={suffix}
          disabled={!userIsOwner}
        />
        <label htmlFor="experience-points" className="hidden">
          Experience Points
        </label>
        {levelUpButton}
      </Space.Compact>
      <HelpTooltip text="You can add to your XP total by highlighting the current value and typing a number starting with + or - (ex: +250) and hitting Enter" />
    </Flex>
  );
};

export default ExperiencePoints;
