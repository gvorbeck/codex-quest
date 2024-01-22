import React from "react";
import {
  EditOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { avatarClassNames } from "@/support/cssSupport";
import {
  Flex,
  Badge,
  Avatar,
  Divider,
  Breadcrumb,
  Typography,
  Descriptions,
  BreadcrumbProps,
  DescriptionsProps,
} from "antd";
import { getAvatar } from "@/support/characterSupport";
import BreadcrumbHomeLink from "@/components/BreadcrumbHomeLink/BreadcrumbHomeLink";
import classNames from "classnames";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import { CharacterDataContext } from "@/contexts/CharacterContext";
import { classSplit } from "@/support/classSupport";
import ExperiencePoints from "./ExperiencePoints/ExperiencePoints";

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
  const heroClassNames = classNames("w-full", className);

  const classArr = classSplit(character.class);

  const showAvatarModal = () => {
    setModalIsOpen(true);
    setModalTitle("Change Avatar");
    setModalContent(
      <AvatarPicker character={character} setCharacter={setCharacter} />,
    );
  };

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
              size={64}
              className={avatarClassNames}
              icon={!character.avatar ? <UserOutlined /> : undefined}
              src={character.avatar ? getAvatar(character.avatar) : undefined}
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
          gap={16}
          align="flex-start"
          vertical={isMobile}
          justify="space-between"
          className="w-full sm:flex-row-reverse sm:mx-auto"
        >
          {/* Level/Race/Class */}
          <Descriptions
            bordered
            column={2}
            size="small"
            items={descriptionsItems}
            className="w-full sm:w-1/3"
          />
          <ExperiencePoints
            id={id}
            uid={uid}
            classArr={classArr}
            character={character}
            userIsOwner={userIsOwner}
            setCharacter={setCharacter}
            setModalTitle={setModalTitle}
            setModalIsOpen={setModalIsOpen}
            setModalContent={setModalContent}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default Hero;
