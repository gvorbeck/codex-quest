import React from "react";
import {
  EditOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { avatarClassNames } from "@/support/cssSupport";
import {
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbProps,
  Button,
  Descriptions,
  DescriptionsProps,
  Divider,
  Flex,
  Input,
  Space,
  Typography,
} from "antd";
import { getAvatar } from "@/support/characterSupport";
import { ClassNames } from "@/data/definitions";
import { classes } from "@/data/classes";
import HelpTooltip from "@/components/HelpTooltip/HelpTooltip";
import BreadcrumbHomeLink from "@/components/BreadcrumbHomeLink/BreadcrumbHomeLink";
import classNames from "classnames";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import { CharacterDataContext } from "@/contexts/CharacterContext";
import ModalLevelUp from "@/components/ModalLevelUp/ModalLevelUp";
import { classSplit } from "@/support/classSupport";

interface HeroProps {
  setModalIsOpen: (modalIsOpen: boolean) => void;
  setModalTitle: (modalTitle: string) => void;
  setModalContent: (modalContent: React.ReactNode) => void;
  isMobile: boolean;
}

const Hero: React.FC<HeroProps & React.ComponentPropsWithRef<"div">> = ({
  className,
  setModalIsOpen,
  setModalTitle,
  setModalContent,
  isMobile,
}) => {
  const { character, setCharacter, userIsOwner, uid, id } =
    React.useContext(CharacterDataContext);
  const [inputValue, setInputValue] = React.useState<string>(`${character.xp}`);
  const heroClassNames = classNames("w-full", className);

  const classArr = classSplit(character.class);

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

  const showAvatarModal = () => {
    setModalIsOpen(true);
    setModalTitle("Change Avatar");
    setModalContent(
      <AvatarPicker character={character} setCharacter={setCharacter} />,
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
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

  const totalLevelRequirement = classArr
    .map((className) => {
      const classRequirements =
        classes[className as ClassNames]?.experiencePoints;
      return classRequirements ? classRequirements[character.level] : 0; // value if using a custom class
    })
    .reduce((a, b) => a + b, 0);

  const breadcrumbItems: BreadcrumbProps["items"] = [
    {
      title: <BreadcrumbHomeLink />,
    },
    {
      title: (
        <div>
          <SolutionOutlined className="mr-2" />
          <span>{character.name}</span>
        </div>
      ),
    },
  ];

  const descriptionsItems: DescriptionsProps["items"] = [
    { key: "1", label: "Level", children: character.level },
    { key: "2", label: "Race", children: character.race },
    { key: "3", label: "Class", children: classArr.join(", ") },
  ];

  return (
    <>
      <Flex className={heroClassNames} gap={16} vertical>
        <Breadcrumb items={breadcrumbItems} />
        {/* Avatar */}
        <div
          className="[&>span:hover>span:last-child]:opacity-100 mx-auto cursor-pointer"
          onClick={
            userIsOwner
              ? showAvatarModal
              : () => {
                  console.error(
                    "You are not logged in as the owner of this character",
                  );
                }
          }
        >
          <Badge count={<EditOutlined className="opacity-25" />}>
            <Avatar
              src={character.avatar ? getAvatar(character.avatar) : undefined}
              icon={!character.avatar ? <UserOutlined /> : undefined}
              size={64}
              className={avatarClassNames}
            />
          </Badge>
        </div>
        {/* Name */}
        <Typography.Title
          level={2}
          className="text-center m-0 leading-none font-enchant text-5xl tracking-wide w-full"
        >
          {character.name}
        </Typography.Title>
        <Divider />
        <Flex
          className="w-full sm:flex-row-reverse sm:mx-auto"
          vertical={isMobile}
          align="flex-start"
          justify="space-between"
          gap={16}
        >
          {/* Level/Race/Class */}
          <Descriptions
            items={descriptionsItems}
            bordered
            className="w-full sm:w-1/3"
            column={2}
            size="small"
          />
          {/* Experience Points */}
          <Flex gap={8}>
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
                  disabled={
                    character.xp < totalLevelRequirement || !userIsOwner
                  }
                  type="primary"
                  onClick={showLevelUpModal}
                  className="print:hidden shadow-none"
                >{`Level Up`}</Button>
              )}
            </Space.Compact>
            <HelpTooltip text="You can add to your XP total by highlighting the current value and typing a number starting with + or - (ex: +250) and hitting Enter" />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Hero;
